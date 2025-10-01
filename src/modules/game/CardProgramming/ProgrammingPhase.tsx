"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { GameBoard } from "@/components/GameBoard";
import { PlayerInfoCard } from "@/components/PlayerInfoCard";
import { GetCurrentGameStateResponse } from "@/redux/api/game/types";
import {
  ProgrammingControls,
  ProgrammingControlsRef,
} from "./ProgrammingControls";
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
    handleUploadProgram: () => void;
  };
  showProgrammingControls: boolean;
  onToggleProgrammingControls: () => void;
  filledCount: number;
  programComplete: boolean;
  isSubmitting: boolean;
  deckCount: number;
  isDealing: boolean;
  onResetDeck?: () => void;
  gameState: GetCurrentGameStateResponse;
  currentUsername: string;
}

export const ProgrammingPhase = ({
  state,
  handlers,
  showProgrammingControls,
  onToggleProgrammingControls,
  filledCount,
  programComplete,
  isSubmitting,
  deckCount,
  isDealing,
  onResetDeck,
  gameState,
  currentUsername,
}: ProgrammingPhaseProps) => {
  const programmingControlsRef = useRef<ProgrammingControlsRef>(null);

  return (
    <motion.div
      key="programming"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-full"
    >
      {/* Side-by-side layout: Board on left, Players on right */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex">
        {/* Left side - Game Board */}
        <div className="flex-1 flex items-center justify-center p-4">
          <GameBoard className="max-w-2xl w-full" />
        </div>
        
        {/* Right side - Player Information */}
        <div className="w-80 p-6 bg-surface-dark/30 border-l border-glass-border">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">
              Players ({gameState.players.length})
            </h3>
            <div className="space-y-3">
              {[...gameState.players]
                .sort((a, b) => {
                  if (a.username === currentUsername) return -1;
                  if (b.username === currentUsername) return 1;
                  return 0;
                })
                .map((player) => (
                  <PlayerInfoCard
                    key={player.username}
                    player={player}
                    isCurrentPlayer={player.username === currentUsername}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Programming Controls */}
      <ProgrammingControls
        ref={programmingControlsRef}
        state={state}
        handlers={handlers}
        showControls={showProgrammingControls}
        onToggleControls={onToggleProgrammingControls}
        filledCount={filledCount}
        programComplete={programComplete}
        isSubmitting={isSubmitting}
      />
      
      {/* Programming and Discard Piles - Top Right */}
      <DeckArea
        showControls={showProgrammingControls}
        handSize={state.hand.length}
        deckCount={deckCount}
        isDealing={isDealing}
        onResetDeck={onResetDeck}
      />
      
      {/* Drag Drop Zones Indicator */}
      <DragDropIndicator isDragging={state.isDragging} />
    </motion.div>
  );
};
