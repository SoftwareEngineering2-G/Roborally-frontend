export type Direction = "North" | "East" | "South" | "West";

export interface GameBoardCell {
    name: string;
    walls: Direction[];
};

export interface BoardElement extends GameBoardCell {
    direction: Direction | null;
}

export type GameBoard = {
    name: string;
    spaces: GameBoardCell[][];
};

export type GamePlayer ={
    username: string;
    robot: string;
    positionX: number;
    positionY: number;
    direction: Direction;
    revealedCards?: ProgrammingCards[];
    hasLockedIn?: boolean;
    programmedCards?: string[]; // Array of card names locked in by player
};

export type GamePhase = "ProgrammingPhase" | "ActivationPhase";

export type ProgrammingCards = "Move 1" | "Move 2" | "Move 3" | "Rotate Left" | "Rotate Right" | "U-Turn" | "Move Back" | "Power Up" | "Again";

export type Game = {
    gameId: string;
    hostUsername: string;
    name: string;
    players: GamePlayer[];
    gameBoard: GameBoard;
    currentPhase: GamePhase;
    currentRevealedRegister?: number;
};