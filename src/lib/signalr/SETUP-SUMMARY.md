# RoboRally SignalR Integration - Configuration Summary

## ✅ Updated Configuration

Your SignalR setup has been updated to match your backend implementation:

### Backend Integration Points

- **URL**: `http://localhost:5100`
- **Hub Path**: `/game-lobbies`
- **Hub Methods**: `JoinLobby(gameId)`, `LeaveLobby(gameId)`
- **Events**: `UserJoinedLobby`, `UserLeftLobby`
- **Group Naming**: `lobby-{gameId}` (handled by backend)

### Event Structure

Your backend sends simplified events:

```csharp
// UserJoinedLobby event payload
{ GameId = gameId, Username = username }

// UserLeftLobby event payload
{ GameId = gameId, Username = username }
```

## 🚀 Quick Setup

### 1. Add to Your Providers

Add the SignalR provider to your app (in `src/app/providers.tsx` or similar):

```tsx
import { SignalRProvider } from "@/lib/signalr/SignalRProvider";
import { signalRConfig } from "@/lib/signalr/roborally-config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SignalRProvider config={signalRConfig} autoConnect={true}>
      {/* Your other providers like StoreProvider, ThemeProvider etc */}
      {children}
    </SignalRProvider>
  );
}
```

### 2. Use in Your Lobby Component

Your lobby component is already updated! It uses:

```tsx
import { useLobbySignalR } from "@/hooks/signalr";

const signalRLobby = useLobbySignalR(
  gameId,
  {
    onUserJoined: (event) => {
      toast.success(`${event.username} joined the battle arena!`);
      refetch(); // Updates player list
    },
    onUserLeft: (event) => {
      toast.info(`${event.username} left the arena`);
      refetch(); // Updates player list
    },
    // ... other events
  },
  {
    username: username || undefined,
    enabled: !!username && signalRConnection.isConnected,
  }
);
```

## 📡 Available Hooks

### Simple Usage (as you requested)

```tsx
import { useUserJoinedSignalREvent } from "@/hooks/signalr";

function MyLobbyComponent({ gameId }: { gameId: string }) {
  useUserJoinedSignalREvent(gameId, (event) => {
    console.log(`${event.username} joined game ${event.gameId}!`);
  });

  return <div>Lobby Component</div>;
}
```

### Full Featured Usage

```tsx
import { useLobbySignalR } from "@/hooks/signalr";

function AdvancedLobby({
  gameId,
  username,
}: {
  gameId: string;
  username: string;
}) {
  const signalR = useLobbySignalR(
    gameId,
    {
      onUserJoined: (event) => toast.success(`${event.username} joined!`),
      onUserLeft: (event) => toast.info(`${event.username} left`),
      // Add other events as you implement them in backend
    },
    { username }
  );

  return <div>Advanced Lobby</div>;
}
```

## 🔧 Configuration Details

The configuration matches your backend exactly:

```tsx
export const signalRConfig: SignalRConfig = {
  baseUrl: "http://localhost:5100", // Your backend URL
  hubPath: "/game-lobbies", // Your SignalR hub endpoint
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000],
};
```

## 🎯 Current Features Working

✅ **Connection Management**: Automatic connection, reconnection  
✅ **Lobby Joining**: Calls `JoinLobby(gameId)` on your backend  
✅ **User Joined Events**: Receives `UserJoinedLobby` events  
✅ **User Left Events**: Receives `UserLeftLobby` events  
✅ **Automatic Cleanup**: Leaves lobbies and cleans up connections  
✅ **Error Handling**: Graceful error handling with toast notifications  
✅ **Type Safety**: Full TypeScript support

## 🚧 Future Extensions

When you add more features to your backend, you can easily extend:

```tsx
// Add new events to your backend broadcaster
await _hubContext.Clients.Group(groupId).SendAsync(
  "PlayerReady",
  payload,
  cancellationToken
);
await _hubContext.Clients.Group(groupId).SendAsync(
  "GameStarted",
  payload,
  cancellationToken
);

// The frontend hooks are already prepared for these events!
```

## 🎮 Ready to Use!

Your SignalR integration is now fully configured and ready to use with your RoboRally backend. The lobby component will automatically:

1. Connect to SignalR when loaded
2. Join the lobby group for the specific game
3. Listen for user join/leave events
4. Show toast notifications
5. Refresh lobby data when events occur
6. Clean up connections when component unmounts

Just make sure your backend is running on `localhost:5100` and the frontend will connect automatically!
