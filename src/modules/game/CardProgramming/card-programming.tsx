"use client";

import { useState } from "react";
import { ProgrammingHeader } from "./ProgrammingHeader";
import { ProgrammingPhase } from "./ProgrammingPhase";
import { DealingAnimationOverlaySimple } from "./DealingAnimationSimple";
import { SAMPLE_CARDS, INITIAL_REGISTERS } from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { useCardDealing } from "./useCardDealing";

interface CardProgrammingProps {
  hostControls?: React.ReactNode;
}

export const CardProgramming = ({ hostControls }: CardProgrammingProps = {}) => {
  const [showProgrammingControls, setShowProgrammingControls] = useState(true);
  const { state, handlers } = useProgrammingPhase(
    [], // Start with empty hand
    INITIAL_REGISTERS
  );

  const { dealingState, startDealing, markCardAsDealt, resetDeck } =
    useCardDealing(20);

  const filledCount = getFilledRegistersCount(state.registers);
  const programComplete = isProgramComplete(state.registers);

  const toggleProgrammingControls = () => {
    setShowProgrammingControls((prev) => !prev);
  };

  const handleDrawCards = (
    deckElement: HTMLElement,
    placeholderElements: (HTMLElement | null)[]
  ) => {
    startDealing(deckElement, placeholderElements, (newCards) => {
      // Replace the hand with the newly dealt cards
      handlers.handleSetHand(newCards);
    });
  };

  const handleResetDeck = () => {
    // Clear the hand and reset deck
    handlers.handleSetHand([]);
    resetDeck();
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Programming Header */}
      <ProgrammingHeader
        filledCount={filledCount}
        programComplete={programComplete}
        onUploadProgram={handlers.handleUploadProgram}
        hostControls={hostControls}
      />

      {/* Main Programming Interface */}
      <div className="relative min-h-[calc(100vh-5rem)]">
        <ProgrammingPhase
          state={state}
          handlers={handlers}
          showProgrammingControls={showProgrammingControls}
          onToggleProgrammingControls={toggleProgrammingControls}
          filledCount={filledCount}
          deckCount={dealingState.deckCount}
          isDealing={dealingState.isDealing}
          onDrawCards={handleDrawCards}
          onResetDeck={handleResetDeck}
        />
      </div>

      {/* Card Dealing Animation Overlay */}
      <DealingAnimationOverlaySimple
        dealingCards={dealingState.dealingCards}
        onCardDealt={markCardAsDealt}
      />
    </div>
  );
};