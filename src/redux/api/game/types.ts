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
};

export type GetCurrentGameStateResponse = {
  gameId: string;
  hostUsername: string;
  name: string;
  players: Array<{
    username: string;
    robot: string;
    hasLockedIn?: boolean;
    programmedCards?: string[]; // Array of card names locked in by player
  }>;
  currentPhase: "ProgrammingPhase" | "ActivationPhase";
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