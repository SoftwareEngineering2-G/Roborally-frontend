"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { GameBoard } from "@/components/GameBoard";
import { ProgrammingControls } from "./ProgrammingControls";
import { DeckArea } from "./DeckAreaSimple";
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
  deckCount: number;
  isDealing: boolean;
  onDrawCards: (deckElement: HTMLElement, handContainer: HTMLElement) => void;
  onResetDeck?: () => void;
}

export const ProgrammingPhase = ({
  state,
  handlers,
  showProgrammingControls,
  onToggleProgrammingControls,
  filledCount,
  deckCount,
  isDealing,
  onDrawCards,
  onResetDeck,
}: ProgrammingPhaseProps) => {
  const handContainerRef = useRef<HTMLDivElement>(null);

  const handleDrawCardsWithRef = (deckElement: HTMLElement) => {
    if (handContainerRef.current) {
      onDrawCards(deckElement, handContainerRef.current);
    }
  };
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
        ref={handContainerRef}
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
        deckCount={deckCount}
        isDealing={isDealing}
        onDrawCards={handleDrawCardsWithRef}
        onResetDeck={onResetDeck}
      />{" "}
      {/* Drag Drop Zones Indicator */}
      <DragDropIndicator isDragging={state.isDragging} />
    </motion.div>
  );
};
