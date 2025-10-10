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
  }>;
  currentPhase: "ProgrammingPhase" | "ActivationPhase";
    gameBoard: {
        name: string;
        spaces: { name: string }[][];
    };
};

export type RegisterProgrammedRequest = {
  gameId: string;
  username: string;
  lockedCardsInOrder: string[];
};