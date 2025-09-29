export interface ProgramCard {
  id: string;
  name: string;
  type:
    | "move1"
    | "move2"
    | "move3"
    | "moveback"
    | "powerup"
    | "rotateleft"
    | "rotateright"
    | "uturn";
  imagePath: string;
}

export interface RegisterSlot {
  id: number;
  card: ProgramCard | null;
}

export interface ProgrammingPhaseState {
  hand: ProgramCard[];
  registers: RegisterSlot[];
  selectedCard: ProgramCard | null;
  selectedRegister: number | null;
  isDragging: boolean;
  programComplete: boolean;
}

// Sample card data with the 9 card types
export const SAMPLE_CARDS: ProgramCard[] = [
  { id: "1", name: "Move 1", type: "move1", imagePath: "/cards/move1.png" },
  { id: "2", name: "Move 2", type: "move2", imagePath: "/cards/move2.png" },
  { id: "3", name: "Move 3", type: "move3", imagePath: "/cards/move3.png" },
  {
    id: "4",
    name: "Move Back",
    type: "moveback",
    imagePath: "/cards/moveback.png",
  },
  {
    id: "5",
    name: "Power Up",
    type: "powerup",
    imagePath: "/cards/powerup.png",
  },
  {
    id: "6",
    name: "Rotate Left",
    type: "rotateleft",
    imagePath: "/cards/rotateleft.png",
  },
  {
    id: "7",
    name: "Rotate Right",
    type: "rotateright",
    imagePath: "/cards/rotateright.png",
  },
  { id: "8", name: "U-Turn", type: "uturn", imagePath: "/cards/uturn.png" },
  { id: "9", name: "Move 1", type: "move1", imagePath: "/cards/move1.png" },
];

export const INITIAL_REGISTERS: RegisterSlot[] = [
  { id: 1, card: null },
  { id: 2, card: null },
  { id: 3, card: null },
  { id: 4, card: null },
  { id: 5, card: null },
];
