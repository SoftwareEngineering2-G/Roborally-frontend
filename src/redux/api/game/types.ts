
export interface GamePlayer {
    username: string;
    robot: string;                 // e.g. "Red"
    facingDirection: "North" | "East" | "South" | "West";
    currentPosition: { x: number; y: number };
    spawnPosition: { x: number; y: number };
    programmingDeck: {
        pickPiles: unknown[];        //TODO refine later when you model cards
        discardedPiles: unknown[];
    };
    playerEvents: unknown[];       //TODO refine when events are modeled
}

export type GameBoardSpace = Record<string, unknown>; //TODO future: walls, belts, etc.

export interface GameBoard {
    name: string;
    space: GameBoardSpace[][];
}



export interface GetGameRequest {
    gameId: string;
}

export interface GetGameResponse {
    gameId: string;
    gameBoard: GameBoard;
    currentPhase: string;
    players: GamePlayer[];
}




