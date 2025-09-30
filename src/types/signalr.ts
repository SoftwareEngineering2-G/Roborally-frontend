// SignalR Types - matching C# backend GameLobbyBroadcaster

// Lobby SignalR Events (matching backend payload structure)
export interface UserJoinedLobbyEvent {
  gameId: string; // Guid from C# backend
  username: string;
}

export interface UserLeftLobbyEvent {
  gameId: string; // Guid from C# backend
  username: string;
}

export interface GameStartedEvent {
  gameId: string; // Guid from C# backend
}

// Game SignalR Events (matching backend GameBroadcaster)
export interface PlayerCardsDealtEvent {
  gameId: string; // Guid from C# backend
  username: string;
  dealtCards: string[]; // List of card names as strings
}
