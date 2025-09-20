# SignalR Integration Guide

This project includes a centralized SignalR implementation that provides real-time communication capabilities for the RoboRally lobby system.

## 🏗️ Architecture

The SignalR integration is organized into several layers:

### 1. Types (`src/types/signalr.ts`)

- Defines all SignalR-related TypeScript interfaces
- Event types for lobby functionality
- Connection state management

### 2. Connection Manager (`src/lib/signalr/connection.ts`)

- Singleton pattern for managing SignalR connection
- Automatic reconnection logic
- Group management for lobbies
- Event subscription/unsubscription

### 3. React Hooks (`src/hooks/signalr/`)

- `useSignalRConnection()` - Connection state management
- `useSignalREvent()` - Generic event subscription
- `useLobbySignalR()` - Complete lobby functionality
- `useUserJoinedSignalREvent()` - Specific user joined events

### 4. Provider (`src/lib/signalr/SignalRProvider.tsx`)

- React context provider for app-wide SignalR access
- Handles initialization and cleanup

## 🚀 Quick Start

### 1. Setup the Provider

First, wrap your app with the SignalR provider in your main layout or providers file:

```tsx
// In your src/app/providers.tsx or src/app/layout.tsx
import { SignalRProvider } from "@/lib/signalr/SignalRProvider";
import { SignalRConfig } from "@/types/signalr";

const signalRConfig: SignalRConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  hubPath: "/lobbyhub", // Your SignalR hub endpoint
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000],

  // Optional: Add authentication
  accessTokenFactory: async () => {
    const token = localStorage.getItem("authToken");
    return token || "";
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SignalRProvider config={signalRConfig} autoConnect={true}>
      {/* Your other providers */}
      {children}
    </SignalRProvider>
  );
}
```

### 2. Use in Components

#### Simple User Joined Events

```tsx
import { useUserJoinedSignalREvent } from "@/hooks/signalr";

function LobbyComponent({ gameId }: { gameId: string }) {
  useUserJoinedSignalREvent(gameId, (event) => {
    console.log(`${event.username} joined!`);
    toast.success(`${event.username} joined the battle arena!`);
  });

  return <div>Lobby Component</div>;
}
```

#### Full Lobby Integration

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
      onUserJoined: (event) => {
        toast.success(`${event.username} joined!`);
        // Update your player list
      },
      onUserLeft: (event) => {
        toast.info(`${event.username} left`);
        // Update your player list
      },
      onPlayerReady: (event) => {
        toast(`${event.username} is ${event.isReady ? "ready" : "not ready"}`);
        // Update player ready state
      },
      onGameStarted: (event) => {
        toast.success("Game starting!");
        router.push(`/lobby/${gameId}/game`);
      },
    },
    { username }
  );

  const handleToggleReady = async () => {
    try {
      await signalR.setPlayerReady(!isReady);
    } catch (error) {
      toast.error("Failed to update ready status");
    }
  };

  const handleStartGame = async () => {
    try {
      await signalR.startGame();
    } catch (error) {
      toast.error("Failed to start game");
    }
  };

  return (
    <div>
      <button onClick={handleToggleReady}>Toggle Ready</button>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
}
```

## 🎯 Available Hooks

### Core Hooks

#### `useSignalRConnection()`

Manages the basic SignalR connection state.

```tsx
const {
  connectionState,
  isConnected,
  isConnecting,
  error,
  connect,
  disconnect,
} = useSignalRConnection();
```

#### `useSignalREvent(eventName, handler, options)`

Subscribe to any SignalR event.

```tsx
useSignalREvent(
  "CustomEvent",
  (data) => {
    console.log("Received:", data);
  },
  { enabled: true }
);
```

### Lobby-Specific Hooks

#### `useUserJoinedSignalREvent(gameId, handler)`

Handle user joined events - exactly what you requested!

```tsx
useUserJoinedSignalREvent(gameId, (event) => {
  console.log(`User ${event.username} joined game ${event.gameId}`);
});
```

#### `usePlayerReadySignalREvent(gameId, handler)`

Handle player ready state changes.

#### `useGameStartedSignalREvent(gameId, handler)`

Handle game start events.

#### `useLobbySignalR(gameId, callbacks, options)`

Complete lobby functionality with all events and actions.

## 📡 Event Types

The system handles these lobby events:

- **UserJoined**: When a player joins the lobby
- **UserLeft**: When a player leaves the lobby
- **PlayerReady**: When a player changes ready status
- **GameStarted**: When the host starts the game
- **LobbyUpdated**: General lobby information updates

## 🔧 Configuration

### SignalR Config Options

```tsx
interface SignalRConfig {
  baseUrl: string; // Your backend URL
  hubPath: string; // Hub endpoint (e.g., '/lobbyhub')
  automaticReconnect?: boolean; // Enable auto-reconnect (default: true)
  reconnectDelays?: number[]; // Retry delays in ms
  accessTokenFactory?: () => string | Promise<string>; // Auth token
}
```

### Hook Options

```tsx
interface SignalRHookOptions {
  enabled?: boolean; // Enable/disable the hook
  gameId?: string; // Game ID for lobby events
  username?: string; // Username for actions
}
```

## 🔄 Connection Management

The system automatically:

- Connects when the provider loads
- Rejoins lobby groups on reconnection
- Handles connection errors gracefully
- Cleans up subscriptions on unmount

## 🧪 Example Implementation

Check `src/modules/lobby/lobby.tsx` to see a complete implementation example that demonstrates:

- Real-time player list updates
- Ready state synchronization
- Game start coordination
- Error handling
- Toast notifications

## 🔐 Security Considerations

1. **Authentication**: Use `accessTokenFactory` to provide auth tokens
2. **Validation**: Always validate incoming SignalR data
3. **Rate Limiting**: Implement rate limiting on your backend
4. **Group Security**: Ensure users can only join authorized lobbies

## 🐛 Troubleshooting

### Common Issues

1. **Connection Not Establishing**

   - Check `baseUrl` and `hubPath` configuration
   - Verify backend SignalR hub is running
   - Check browser console for connection errors

2. **Events Not Received**

   - Ensure you've joined the correct lobby group
   - Check if `enabled` option is true
   - Verify username is provided when required

3. **Authentication Issues**
   - Verify `accessTokenFactory` returns valid token
   - Check token expiration
   - Ensure backend accepts the token format

### Debug Tips

Enable detailed logging by setting the SignalR log level:

```tsx
// In connection.ts, change this line:
.configureLogging(signalR.LogLevel.Debug) // Instead of Information
```

## 🚀 Next Steps

1. **Setup Backend**: Ensure your backend has corresponding SignalR hub
2. **Configure Environment**: Set `NEXT_PUBLIC_API_BASE_URL`
3. **Add Provider**: Wrap your app with `SignalRProvider`
4. **Start Using**: Import hooks and start building real-time features!

---

**Pro Tip**: The hooks are designed to be composable. You can use `useUserJoinedSignalREvent()` alone for simple cases, or `useLobbySignalR()` for complete functionality!
