# 🚀 Simple SignalR Implementation

A clean, simple SignalR implementation that makes connecting to SignalR hubs effortless.

## 🎯 Basic Usage

Connect to any SignalR hub with just a few lines of code:

```tsx
import { useSignalR } from "@/hooks/signalr";

function MyComponent() {
  const signalR = useSignalR("/myhub"); // Your SignalR hub URL

  useEffect(() => {
    if (signalR.isConnected) {
      // Listen to events
      signalR.on("MessageReceived", (data) => {
        console.log("Got message:", data);
      });

      // Join a group
      signalR.joinGroup("mygroup");

      // Cleanup
      return () => {
        signalR.off("MessageReceived");
        signalR.leaveGroup("mygroup");
      };
    }
  }, [signalR.isConnected]);

  const sendMessage = () => {
    signalR.send("SendMessage", "Hello World!");
  };

  return (
    <div>
      <p>Connected: {signalR.isConnected ? "✅ Yes" : "❌ No"}</p>
      {signalR.error && <p>Error: {signalR.error}</p>}
      <button onClick={sendMessage} disabled={!signalR.isConnected}>
        Send Message
      </button>
    </div>
  );
}
```

## 🎮 Lobby Usage

For lobby-specific functionality, use the lobby hook:

```tsx
import { useLobbySignalR } from "@/hooks/signalr";

function LobbyComponent({ gameId, username }) {
  const signalR = useLobbySignalR(parseInt(gameId));

  // Handle events manually
  useEffect(() => {
    if (!signalR.isConnected) return;

    signalR.on("UserJoinedLobby", (data) => console.log("User joined:", data));
    signalR.on("UserLeftLobby", (data) => console.log("User left:", data));
    signalR.on("GameStarted", (data) => {
      console.log("Game started:", data);
      router.push(`/game/${data.gameId}`);
    });

    return () => {
      signalR.off("UserJoinedLobby");
      signalR.off("UserLeftLobby");
      signalR.off("GameStarted");
    };
  }, [signalR.isConnected]);

  const toggleReady = () => signalR.togglePlayerReady();
  const startGame = () => signalR.startGame();

  return (
    <div>
      <p>Connected: {signalR.isConnected ? "✅ Yes" : "❌ No"}</p>
      {signalR.error && <p>Error: {signalR.error}</p>}
      <button onClick={toggleReady} disabled={!signalR.isConnected}>
        Toggle Ready
      </button>
      <button onClick={startGame} disabled={!signalR.isConnected}>
        Start Game
      </button>
    </div>
  );
}
```

## Key Benefits

- **Simple**: Just provide a hub URL and you're connected
- **Flexible**: Use the basic hook for any SignalR hub
- **Type-safe**: Full TypeScript support
- **Automatic**: Handles reconnection, error handling, cleanup
- **No complex state management**: Direct event handling with callbacks

## Available Methods

### useSignalR

- `isConnected` - Connection status
- `isConnecting` - Connection in progress
- `error` - Any connection errors
- `connect()` - Manually connect
- `disconnect()` - Manually disconnect
- `on(event, handler)` - Listen to events
- `off(event, handler)` - Remove event listeners
- `send(method, ...args)` - Send messages to hub
- `joinGroup(groupName)` - Join a SignalR group
- `leaveGroup(groupName)` - Leave a SignalR group

### useLobbySignalR

- All the above methods, plus:
- **Note:** SignalR is only for receiving events from backend, not for invoking methods
- Use REST API calls for actions like starting games, joining lobbies, etc.
- SignalR only handles: UserJoinedLobby, UserLeftLobby, GameStarted events
