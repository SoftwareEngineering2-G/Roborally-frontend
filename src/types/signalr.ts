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

export interface ActivationPhaseStartedEvent {
  gameId: string; // Guid from C# backend
}

export interface PlayerLockedInRegisterEvent {
  username: string;
  lockedCardsInOrder?: string[]; // Optional array of card names
}

export interface RegisterRevealedEvent {
  gameId: string;
  registerNumber: number;
  revealedCards: Array<{
    username: string;
    card: string;
  }>;
}

export interface RobotMovedEvent {
  gameId: string;
  username: string;
  positionX: number;
  positionY: number;
  direction: string;
  executedCard: string;
}
