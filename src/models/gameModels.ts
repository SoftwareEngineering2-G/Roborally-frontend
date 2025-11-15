export type Direction = "North" | "East" | "South" | "West";
export type GearDirection = "ClockWise" | "AntiClockWise";
export type Celltype = "EmptySpace" | "BlueConveyorBelt" | "GreenConveyorBelt" | "Gear";
// Add other cell types as needed

type GameBoardCell = {
  name: Celltype;
  walls: Direction[];
  direction: Direction | GearDirection | null;
};

export type GameBoard = {
  name: string;
  spaces: GameBoardCell[][];
};

export type GamePlayer = {
  username: string;
  currentRating: number;
  robot: string;
  positionX: number;
  positionY: number;
  direction: Direction;
  hasLockedInRegisters: boolean;
  revealedCardsInOrder: ProgrammingCards[]; // Cards revealed during activation phase in order
  currentExecutingRegister: number | null;
  currentCheckpoint: number;
};

export type MyState = {
  hasLockedInRegisters: boolean;
  lockedInCards: ProgrammingCards[] | null; // Player's own locked in cards (5 cards when locked)
  dealtCards: ProgrammingCards[] | null; // Player's dealt hand (9 cards when dealt)
};

export type GamePhase = "ProgrammingPhase" | "ActivationPhase";

export type ProgrammingCards =
  | "Move 1"
  | "Move 2"
  | "Move 3"
  | "Rotate Left"
  | "Rotate Right"
  | "U-Turn"
  | "Move Back"
  | "Power Up"
  | "Again";

export type Game = {
  gameId: string;
  hostUsername: string;
  name: string;
  isPrivate: boolean;
  players: GamePlayer[];
  gameBoard: GameBoard;
  currentPhase: GamePhase;
  currentRevealedRegister: number | null;
  personalState: MyState; // Player's own state information
  currentTurnUsername: string | null;
  currentExecutingRegister: number | null;
};
