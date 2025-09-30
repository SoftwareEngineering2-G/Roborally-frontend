export interface ProgramCard {
  id: string;
  name: string;
  type:
    | "Move 1"
    | "Move 2"
    | "Move 3"
    | "Move Back"
    | "Power Up"
    | "Rotate Left"
    | "Rotate Right"
    | "U-Turn"
    | "Again";
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

// Sample card data matching backend exactly
export const SAMPLE_CARDS: ProgramCard[] = [
  { id: "1", name: "Move 1", type: "Move 1", imagePath: "/cards/move1.png" },
  { id: "2", name: "Move 2", type: "Move 2", imagePath: "/cards/move2.png" },
  { id: "3", name: "Move 3", type: "Move 3", imagePath: "/cards/move3.png" },
  {
    id: "4",
    name: "Move Back",
    type: "Move Back",
    imagePath: "/cards/moveback.png",
  },
  {
    id: "5",
    name: "Power Up",
    type: "Power Up",
    imagePath: "/cards/powerup.png",
  },
  {
    id: "6",
    name: "Rotate Left",
    type: "Rotate Left",
    imagePath: "/cards/rotateleft.png",
  },
  {
    id: "7",
    name: "Rotate Right",
    type: "Rotate Right",
    imagePath: "/cards/rotateright.png",
  },
  { id: "8", name: "U-Turn", type: "U-Turn", imagePath: "/cards/uturn.png" },
  { id: "9", name: "Again", type: "Again", imagePath: "/cards/again.png" },
];

export const INITIAL_REGISTERS: RegisterSlot[] = [
  { id: 1, card: null },
  { id: 2, card: null },
  { id: 3, card: null },
  { id: 4, card: null },
  { id: 5, card: null },
];

// Helper function to create card from backend string
export const createCardFromBackendString = (cardName: string, id: string): ProgramCard => {
  const typeMap: Record<string, ProgramCard['type']> = {
    "Move 1": "Move 1",
    "Move 2": "Move 2", 
    "Move 3": "Move 3",
    "Rotate Left": "Rotate Left",
    "Rotate Right": "Rotate Right",
    "U-Turn": "U-Turn",
    "Move Back": "Move Back",
    "Power Up": "Power Up",
    "Again": "Again"
  };

  const imageMap: Record<string, string> = {
    "Move 1": "/cards/move1.png",
    "Move 2": "/cards/move2.png",
    "Move 3": "/cards/move3.png",
    "Rotate Left": "/cards/rotateleft.png",
    "Rotate Right": "/cards/rotateright.png",
    "U-Turn": "/cards/uturn.png",
    "Move Back": "/cards/moveback.png",
    "Power Up": "/cards/powerup.png",
    "Again": "/cards/again.png"
  };

  return {
    id,
    name: cardName,
    type: typeMap[cardName] || "Move 1", // fallback
    imagePath: imageMap[cardName] || "/cards/move1.png" // fallback
  };
};
