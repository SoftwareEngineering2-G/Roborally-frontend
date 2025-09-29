"use client";

import { motion } from "framer-motion";
import { GameBoard } from "@/components/GameBoard";
import { ProgrammingControls } from "./ProgrammingControls";
import { DeckArea } from "./DeckArea";
import { DragDropIndicator } from "./DragDropIndicator";
import { ProgramCard, ProgrammingPhaseState } from "./types";

interface ProgrammingPhaseProps {
  state: ProgrammingPhaseState;
  handlers: {
    handleDrop: (registerId: number, card: ProgramCard) => void;
    handleCardRemove: (registerId: number) => void;
    handleRegisterSelect: (registerId: number) => void;
    handleCardSelect: (card: ProgramCard) => void;
    handleDragStart: (card: ProgramCard) => void;
    handleDragEnd: () => void;
  };
  showProgrammingControls: boolean;
  onToggleProgrammingControls: () => void;
  filledCount: number;
}

export const ProgrammingPhase = ({
  state,
  handlers,
  showProgrammingControls,
  onToggleProgrammingControls,
  filledCount,
}: ProgrammingPhaseProps) => {
  return (
    <motion.div
      key="programming"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-full"
    >
      {/* Central Board with extensive view */}
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
        <GameBoard className="max-w-5xl w-full" />
      </div>

      {/* Programming Controls */}
      <ProgrammingControls
        state={state}
        handlers={handlers}
        showControls={showProgrammingControls}
        onToggleControls={onToggleProgrammingControls}
        filledCount={filledCount}
      />

      {/* Programming and Discard Piles - Top Right */}
      <DeckArea
        showControls={showProgrammingControls}
        handSize={state.hand.length}
      />

      {/* Drag Drop Zones Indicator */}
      <DragDropIndicator isDragging={state.isDragging} />
    </motion.div>
  );
};
