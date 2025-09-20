# 🎯 Better SignalR Architecture - Usage Guide

## 🏗️ **New Architecture**

Instead of wrapping the entire app, we now use **feature-specific providers**:

### **Structure**

```
App (No SignalR)
├── Home Page (No SignalR)
├── Sign In (No SignalR)
└── Lobby Pages
    └── [gameId] (✅ LobbySignalRProvider)
        └── Lobby Component (Gets SignalR)
```

## 📁 **File Structure**

### `src/lib/signalr/roborally-config.tsx`

```tsx
export function LobbySignalRProvider({ children }) {
  // Only connects to /game-lobbies hub
  return (
    <SignalRProvider config={lobbySignalRConfig}>{children}</SignalRProvider>
  );
}

export function GamePlaySignalRProvider({ children }) {
  // Only connects to /game-play hub
  return (
    <SignalRProvider config={gamePlaySignalRConfig}>{children}</SignalRProvider>
  );
}
```

### `src/app/(protected)/lobby/[gameId]/page.tsx`

```tsx
export default function LobbyPage({ params }) {
  return (
    <LobbySignalRProvider>
      {" "}
      {/* ✅ SignalR only for lobby */}
      <Lobby gameId={gameId} />
    </LobbySignalRProvider>
  );
}
```

### `src/app/providers.tsx`

```tsx
export function Providers({ children }) {
  return (
    <Provider store={store}>
      {" "}
      {/* ✅ No SignalR here */}
      {children}
      <Toaster />
    </Provider>
  );
}
```

## 🎯 **Benefits**

### ✅ **Performance**

- SignalR connection only when needed
- No unnecessary connections on home/signin pages
- Faster app startup

### ✅ **Modularity**

- Each feature has its own SignalR setup
- Easy to add new hubs (game-play, chat, etc.)
- Clear separation of concerns

### ✅ **Flexibility**

- Different pages can use different SignalR hubs
- Easy to disable SignalR for specific features
- Better error isolation

## 🚀 **Usage Examples**

### **Lobby Page** (Current)

```tsx
// src/app/(protected)/lobby/[gameId]/page.tsx
<LobbySignalRProvider>
  <Lobby gameId={gameId} /> // Gets lobby SignalR hooks
</LobbySignalRProvider>
```

### **Future Game Page**

```tsx
// src/app/(protected)/lobby/[gameId]/game/page.tsx
<GamePlaySignalRProvider>
  <GameBoard gameId={gameId} /> // Gets game-play SignalR hooks
</GamePlaySignalRProvider>
```

### **Future Chat Feature**

```tsx
// src/components/chat/chat-panel.tsx
<ChatSignalRProvider>
  <ChatMessages /> // Gets chat SignalR hooks
</ChatSignalRProvider>
```

## 🔧 **How to Add New SignalR Features**

1. **Add config** in `roborally-config.tsx`:

   ```tsx
   export const newFeatureSignalRConfig: SignalRConfig = {
     baseUrl: "http://localhost:5100",
     hubPath: "/new-feature-hub",
     // ...
   };
   ```

2. **Create provider**:

   ```tsx
   export function NewFeatureSignalRProvider({ children }) {
     return (
       <SignalRProvider config={newFeatureSignalRConfig}>
         {children}
       </SignalRProvider>
     );
   }
   ```

3. **Wrap your component**:
   ```tsx
   <NewFeatureSignalRProvider>
     <YourComponent />
   </NewFeatureSignalRProvider>
   ```

## 🎯 **Current State**

- ✅ **Main app**: No SignalR overhead
- ✅ **Lobby pages**: SignalR for lobby events only
- ✅ **Clean separation**: Each feature manages its own connections
- ✅ **Easy to extend**: Add new hubs as needed

This is much better architecture! 🚀
