import { Game } from "@/models/gameModels";

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

export type GetCurrentGameStateResponse = Game;

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

export type ExecuteProgrammingCardResponse = {
  positionX: number;
  positionY: number;
  direction: string;
};