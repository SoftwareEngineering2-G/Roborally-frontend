// SignalR Connection States
export enum SignalRConnectionState {
  Disconnected = "Disconnected",
  Connecting = "Connecting",
  Connected = "Connected",
  Disconnecting = "Disconnecting",
  Reconnecting = "Reconnecting",
}

// Base SignalR Event interface
export interface SignalREvent<T = any> {
  event: string;
  data: T;
}

// Lobby-specific SignalR Events (matching backend payload structure)
export interface UserJoinedLobbyEvent {
  gameId: string;
  username: string;
}

export interface UserLeftLobbyEvent {
  gameId: string;
  username: string;
}

export interface PlayerReadyEvent {
  gameId: string;
  username: string;
  isReady: boolean;
  timestamp: string;
}

export interface GameStartedEvent {
  gameId: string;
}

export interface LobbyUpdatedEvent {
  gameId: string;
  lobbyname: string;
  hostUsername: string;
  joinedUsernames: string[];
  maxPlayers: number;
  timestamp: string;
}

// SignalR Connection Configuration
export interface SignalRConfig {
  baseUrl: string;
  hubPath: string;
  automaticReconnect?: boolean;
  reconnectDelays?: number[];
  accessTokenFactory?: () => string | Promise<string>;
}

// SignalR Hook Options
export interface SignalRHookOptions {
  enabled?: boolean;
  gameId?: string;
  username?: string;
}

// Event handler types
export type EventHandler<T = any> = (data: T) => void;
export type ErrorHandler = (error: Error) => void;
export type ConnectionStateHandler = (state: SignalRConnectionState) => void;
