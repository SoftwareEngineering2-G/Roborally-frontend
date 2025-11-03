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

export type GetCurrentGameStateResponse ={
  game: Game;
  currentTurn?: string | null;
  executedPlayers?: string[];
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

export type ExecuteProgrammingCardResponse = {
  positionX: number;
  positionY: number;
  direction: string;
};

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
