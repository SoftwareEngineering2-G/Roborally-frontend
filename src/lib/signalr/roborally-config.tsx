// SignalR Configuration for your RoboRally Backend

import { SignalRProvider } from "@/lib/signalr/SignalRProvider";
import { SignalRConfig } from "@/types/signalr";

// Configuration matching your backend setup
export const lobbySignalRConfig: SignalRConfig = {
  baseUrl: "http://localhost:5100",
  hubPath: "/game-lobbies", // Primary hub for lobby events
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000],
};

// Future hub configurations (if you need multiple hubs)
export const gamePlaySignalRConfig: SignalRConfig = {
  baseUrl: "http://localhost:5100",
  hubPath: "/game-play", // For actual gameplay events
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000],
};

export const chatSignalRConfig: SignalRConfig = {
  baseUrl: "http://localhost:5100",
  hubPath: "/chat", // For chat functionality
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000],
};

// Lobby-specific SignalR Provider (only use in lobby pages)
export function LobbySignalRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignalRProvider config={lobbySignalRConfig} autoConnect={true}>
      {children}
    </SignalRProvider>
  );
}

// Game-specific SignalR Provider (only use in game pages)
export function GamePlaySignalRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignalRProvider config={gamePlaySignalRConfig} autoConnect={true}>
      {children}
    </SignalRProvider>
  );
}

/*
To use this in your app, modify your existing providers:

// In your src/app/providers.tsx
import { RoboRallySignalRProvider } from './path/to/this/file';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RoboRallySignalRProvider>
      <StoreProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </StoreProvider>
    </RoboRallySignalRProvider>
  );
}
*/
