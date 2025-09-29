// Main component
export { RegistersProgram } from "./registers-program";

// Sub-components
export { ProgramCardComponent } from "./ProgramCard";
export { RegisterSlotComponent } from "./RegisterSlot";
export { ProgramPreview } from "./ProgramPreview";
export { Deck } from "./Deck";

// Custom hooks
export { useProgrammingPhase } from "./hooks";

// Utility functions
export {
  getCardTypeClasses,
  getFilledRegistersCount,
  isProgramComplete,
} from "./utils";

// Types and constants
export type { ProgramCard, RegisterSlot, ProgrammingPhaseState } from "./types";

export { SAMPLE_CARDS, INITIAL_REGISTERS } from "./types";
