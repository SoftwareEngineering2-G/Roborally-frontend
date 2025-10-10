"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { playerLockedIn } from "@/redux/game/gameSlice";
import { toast } from "sonner";
import type { PlayerLockedInRegisterEvent } from "@/types/signalr";

// Shared components
import { GameBoard } from "../components/GameBoard";
import { PlayerInfoCard } from "../components/PlayerInfoCard";

// Programming phase specific components
import { ProgrammingHeader } from "./ProgrammingHeader";
import { ProgrammingControls, ProgrammingControlsRef } from "./ProgrammingControls";
import { DeckArea } from "./DeckArea";
import { DragDropIndicator } from "./DragDropIndicator";
import { DealingAnimationOverlaySimple } from "./DealingAnimationSimple";

// Hooks and types
import { INITIAL_REGISTERS, createCardFromBackendString, ProgramCard } from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { useCardDealing } from "./useCardDealing";
import { useGameSignalR } from "./hooks/useGameSignalR";

interface ProgrammingPhaseProps {
  gameId: string;
  username: string;
}

export const ProgrammingPhase = ({ gameId, username }: ProgrammingPhaseProps) => {
  const [showProgrammingControls, setShowProgrammingControls] = useState(true);
  const dispatch = useAppDispatch();
  
  // Get game state from Redux
  const { currentGame } = useAppSelector(state => state.game);
  
  const { state, handlers, isSubmitting } = useProgrammingPhase(
    [], // Start with empty hand
    INITIAL_REGISTERS,
    gameId,
    username
  );

  const { dealingState, startDealing, markCardAsDealt, resetDeck } =
    useCardDealing(20);

  // Setup SignalR connection for game events
  const signalR = useGameSignalR(gameId, username);

  const filledCount = getFilledRegistersCount(state.registers);
  const programComplete = isProgramComplete(state.registers);
  
  const programmingControlsRef = useRef<ProgrammingControlsRef>(null);

  // Handle SignalR events - only update Redux state
  useEffect(() => {
    if (!signalR.isConnected) return;

    // Listen for cards dealt event
    const handlePlayerCardsDealt = (...args: unknown[]) => {
      const data = args[0] as { username: string; gameId: string; dealtCards: string[] };
      console.log("Cards dealt received:", data);
      
      // Only process if this event is for the current player
      if (data.username === username && data.gameId === gameId) {
        
        // Convert backend card names to ProgramCard objects
        const dealtCards: ProgramCard[] = data.dealtCards.map((cardName: string, index: number) => 
          createCardFromBackendString(cardName, `dealt-${index}-${Date.now()}`)
        );
        
        // Try to trigger dealing animation if deck is visible
        const deckElement = document.querySelector('[data-deck-element]') as HTMLElement;
        const handElements = Array.from(document.querySelectorAll('[data-hand-placeholder]')) as HTMLElement[];
        
        if (deckElement && handElements.length > 0) {
          // Use the dealing animation system with actual cards from SignalR
          console.log("Triggering card dealing animation with actual cards:", dealtCards);
          startDealing(deckElement, handElements, dealtCards, (animatedCards: ProgramCard[]) => {
            // The animation completes with the actual dealt cards
            handlers.handleSetHand(animatedCards);
          });
        } else {
          // Fallback: directly set cards if animation elements not found
          console.log("Animation elements not found, setting cards directly");
          handlers.handleSetHand(dealtCards);
        }
        
        // Reset deck count (since cards are now dealt)
        resetDeck();
        
        toast.info(`Received ${dealtCards.length} cards`);
      }
    };

    signalR.on("PlayerCardsDealt", handlePlayerCardsDealt);

    return () => {
      signalR.off("PlayerCardsDealt");
    };
  }, [signalR.isConnected, username, gameId, handlers, resetDeck, startDealing, signalR]);

  // Listen for PlayerLockedInRegister events - only update Redux
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handlePlayerLockedInRegister = (...args: unknown[]) => {
      const data = args[0] as PlayerLockedInRegisterEvent;
      console.log("Player locked in register:", data);
      
      // Update Redux state to mark player as locked in with their programmed cards
      dispatch(playerLockedIn({ 
        username: data.username,
        programmedCards: data.lockedCardsInOrder 
      }));
      
      // Show toast notification
      if (data.username === username) {
        toast.success("Your program has been locked in!");
      } else {
        toast.info(`${data.username} has locked in their program`);
      }
    };

    signalR.on("PlayerLockedInRegister", handlePlayerLockedInRegister);

    return () => {
      signalR.off("PlayerLockedInRegister");
    };
  }, [signalR.isConnected, username, dispatch, signalR]);

  // Don't render if we don't have game state
  if (!currentGame) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading game state...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="programming"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-full"
    >
      {/* Header */}
      <ProgrammingHeader 
        filledCount={filledCount}
      />

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
              Players ({currentGame.players.length})
            </h3>
            <div className="space-y-3">
              {[...currentGame.players]
                .sort((a, b) => {
                  if (a.username === username) return -1;
                  if (b.username === username) return 1;
                  return 0;
                })
                .map((player) => (
                  <PlayerInfoCard
                    key={player.username}
                    player={player}
                    isCurrentPlayer={player.username === username}
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
        onToggleControls={() => setShowProgrammingControls(!showProgrammingControls)}
        filledCount={filledCount}
        programComplete={programComplete}
        isSubmitting={isSubmitting}
      />
      
      {/* Programming and Discard Piles - Top Right */}
      <DeckArea
        showControls={showProgrammingControls}
        handSize={state.hand.length}
        deckCount={dealingState.deckCount}
        isDealing={dealingState.isDealing}
        onResetDeck={resetDeck}
      />
      
      {/* Drag Drop Zones Indicator */}
      <DragDropIndicator isDragging={state.isDragging} />

      {/* Dealing Animation Overlay */}
      <DealingAnimationOverlaySimple
        dealingCards={dealingState.dealingCards}
        onCardDealt={markCardAsDealt}
      />
    </motion.div>
  );
};
