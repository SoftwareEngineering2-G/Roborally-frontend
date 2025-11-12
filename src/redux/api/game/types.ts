export type StartCardDealingForAllRequest = {
  gameId: string;
  username: string;
};

export type StartActivationPhaseRequest = {
  gameId: string;
  username: string;
};

export type GetCurrentGameStateRequest = {
  gameId: string;
  username: string;
};

export type GetCurrentGameStateResponse = {
  gameId: string;
  players: Array<{
    username: string;
    robot: string;
    positionX: number;
    positionY: number;
    direction: string;
    hasLockedInRegisters: boolean;
    revealedCardsInOrder: string[];
    currentExecutingRegister: number | null;
  }>;
  currentPhase: string;
  hostUsername: string;
  name: string;
  isPrivate: boolean;
  gameBoard: {
    name: string;
    spaces: Array<
      Array<{
        name: string;
        walls: string[];
        direction?: string | null;
      }>
    >;
  };
  currentRevealedRegister: number | null;
  currentTurnUsername: string | null;
  currentExecutingRegister: number | null;
  personalState: {
    hasLockedInRegisters: boolean;
    lockedInCards: string[] | null;
    dealtCards: string[] | null;
  };
};

export type RegisterProgrammedRequest = {
  gameId: string;
  username: string;
  lockedCardsInOrder: string[];
};

export type RevealNextRegisterRequest = {
  gameId: string;
  username: string;
};

export type RevealNextRegisterResponse = {
  registerNumber: number;
  revealedCards: Array<{
    username: string;
    card: string;
  }>;
};

export type ExecuteProgrammingCardRequest = {
  gameId: string;
  username: string;
  cardName: string;
};

export interface ExecuteProgrammingCardResponse {
  message: string;
  playerState: {
    positionX: number;
    positionY: number;
    direction: string;
  };
}

// Activate board element types
export interface ActivateNextBoardElementRequest {
  gameId: string;
  username: string;
}

// Game History types
export interface GetAllGamesRequest {
  username: string;
  isPrivate?: boolean;
  isFinished?: boolean;
  from?: string; // ISO date string (DateOnly)
  to?: string; // ISO date string (DateOnly)
  searchTag?: string; // Search by room name or host name
}

export interface GetAllGamesResponse {
  gameId: string;
  gameRoomName: string;
  hostUsername: string;
  startDate: string; // ISO date string
  isFinished: boolean;
  isPrivate: boolean;
}

export type RequestGamePauseRequest = {
  gameId: string;
  username: string;
};

export type RespondToGamePauseRequest = {
  gameId: string;
  username: string;
  approved: boolean;
};

// Paused Games
export type GetPausedGameResponse = {
  gameId: string;
  gameRoomName: string;
  hostUsername: string;
  playerUsernames: string[];
};

export type GetPausedGamesRequest = {
  username: string;
};
