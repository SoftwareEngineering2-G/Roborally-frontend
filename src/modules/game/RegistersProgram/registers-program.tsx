"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PhaseHeader } from "./PhaseHeader";
import { ActivationPhase } from "./ActivationPhase";
import { ProgrammingPhase } from "./ProgrammingPhase";
import { DealingAnimationOverlaySimple } from "./DealingAnimationSimple";
import { SAMPLE_CARDS, INITIAL_REGISTERS } from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { useCardDealing } from "./useCardDealing";

type GamePhase = "programming" | "activation";

export const RegistersProgram = () => {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("programming");
  const [showProgrammingControls, setShowProgrammingControls] = useState(true);
  const { state, handlers } = useProgrammingPhase(
    [], // Start with empty hand
    INITIAL_REGISTERS
  );

  const { dealingState, startDealing, markCardAsDealt, resetDeck } =
    useCardDealing(20);

  const filledCount = getFilledRegistersCount(state.registers);
  const programComplete = isProgramComplete(state.registers);

  const togglePhase = () => {
    setCurrentPhase((prev) =>
      prev === "programming" ? "activation" : "programming"
    );
  };

  const toggleProgrammingControls = () => {
    setShowProgrammingControls((prev) => !prev);
  };

  const handleDrawCards = (
    deckElement: HTMLElement,
    handContainer: HTMLElement
  ) => {
    startDealing(deckElement, handContainer, (newCards) => {
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
      {/* Phase Toggle Header */}
      <PhaseHeader
        currentPhase={currentPhase}
        filledCount={filledCount}
        programComplete={programComplete}
        onPhaseToggle={togglePhase}
        onUploadProgram={handlers.handleUploadProgram}
      />

      {/* Main Content Area */}
      <div className="relative min-h-[calc(100vh-5rem)]">
        <AnimatePresence mode="wait">
          {currentPhase === "activation" ? (
            <ActivationPhase registers={state.registers} />
          ) : (
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
          )}
        </AnimatePresence>
      </div>

      {/* Card Dealing Animation Overlay */}
      <DealingAnimationOverlaySimple
        dealingCards={dealingState.dealingCards}
        onCardDealt={markCardAsDealt}
      />
    </div>
  );
};
