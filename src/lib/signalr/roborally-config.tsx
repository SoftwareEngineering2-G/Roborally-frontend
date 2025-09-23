// SignalR Configuration for your RoboRally Backend

import { SignalRProvider } from "@/lib/signalr/SignalRProvider";
import { getConfig } from "@/lib/signalr/base-config";

// Configuration for different hubs
export const lobbySignalRConfig = getConfig("/game-lobbies"); // Primary hub for lobby events
export const gamePlaySignalRConfig = getConfig("/game-play"); // For actual gameplay events

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
