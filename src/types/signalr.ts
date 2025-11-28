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
  isDeckReshuffled: boolean; // NEW - indicates if discard pile was shuffled into deck
  programmingPickPilesCount: number; // NEW - cards remaining in programming deck
  discardPilesCount: number; // NEW - cards in discard pile
}

export interface ActivationPhaseStartedEvent {
  gameId: string; // Guid from C# backend
}

export interface PlayerLockedInRegisterEvent {
  username: string;
  // Note: Backend only sends username, not the cards (security)
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

export interface NextPlayerInTurnEvent {
  gameId: string;
  nextPlayerUsername: string;
}

export interface GameOverEvent {
  gameId: string;
  username: string;
}

export interface GameCompletedBroadcastEvent {
  winner: string;
  gameId: string;
  oldRatings: Record<string, number>;
  newRatings: Record<string, number>;
}

// Game Pause SignalR Events
export interface GamePauseRequestedEvent {
  gameId: string;
  requesterUsername: string;
}

export interface GamePauseResponseEvent {
  gameId: string;
  username: string;
  approved: boolean;
}

export interface GamePauseResultEvent {
  gameId: string;
  result: boolean;
  requestedBy: string;
  playerResponses: Record<string, boolean>;
}

export interface CheckpointReachedEvent {
  gameId: string;
  username: string;
  checkpointNumber: number;
}
