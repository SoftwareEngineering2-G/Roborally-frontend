"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { playerLockedIn } from "@/redux/game/gameSlice";
import { toast } from "sonner";
import type { PlayerLockedInRegisterEvent } from "@/types/signalr";

// Shared components
import { GameBoard as GameBoardComponent } from "../components/GameBoard";
import { PlayerInfoCard } from "../components/PlayerInfoCard";

// Programming phase specific components
import { ProgrammingHeader } from "./ProgrammingHeader";
import {
  ProgrammingControls,
  ProgrammingControlsRef,
} from "./ProgrammingControls";
import { DeckArea } from "./DeckArea";
import { DragDropIndicator } from "./DragDropIndicator";
import { DealingAnimationOverlaySimple } from "./DealingAnimationSimple";
import { DiscardAnimationOverlay } from "./DiscardAnimation";
import { ProgrammingPhaseHostControls } from "./ProgrammingPhaseHostControls";

// Hooks and types
import {
  INITIAL_REGISTERS,
  createCardFromBackendString,
  ProgramCard,
} from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { useCardDealing } from "./useCardDealing";
import { useCardDiscarding } from "./useCardDiscarding";
import { useGameSignalR } from "./hooks/useGameSignalR";
import type { GameBoard } from "@/models/gameModels";

interface ProgrammingPhaseProps {
  gameId: string;
  username: string;
  gameBoard: GameBoard;
}

export const ProgrammingPhase = ({
  gameId,
  username,
  gameBoard,
}: ProgrammingPhaseProps) => {
  const [showProgrammingControls, setShowProgrammingControls] = useState(true);
  const dispatch = useAppDispatch();

  // Get game state from Redux
  const { currentGame } = useAppSelector((state) => state.game);

  const { state, handlers, isSubmitting } = useProgrammingPhase(
    [], // Start with empty hand
    INITIAL_REGISTERS,
    gameId,
    username
  );

  const { dealingState, startDealing, markCardAsDealt, resetDeck } =
    useCardDealing(20);

  const { discardingState, startDiscarding, markCardAsDiscarded } =
    useCardDiscarding();

  // Setup SignalR connection for game events
  const signalR = useGameSignalR(gameId, username);

  const filledCount = getFilledRegistersCount(state.registers);
  const programComplete = isProgramComplete(state.registers);

  const programmingControlsRef = useRef<ProgrammingControlsRef>(null);

  // Check if current user is the host
  const isHost = currentGame?.hostUsername === username;

  // Derive locked-in state from Redux personalState (source of truth)
  const isLockedInFromBackend = Boolean(
    currentGame?.personalState.lockedInCards &&
      currentGame.personalState.lockedInCards.length > 0
  );

  // Sync state from Redux personalState - this keeps UI in sync with backend state
  useEffect(() => {
    if (!currentGame) return;

    const personalState = currentGame.personalState;

    // Restore locked-in state
    if (personalState.lockedInCards && personalState.lockedInCards.length > 0) {
      // Check if our local state already matches (to avoid unnecessary updates)
      const currentRegisterCards = state.registers
        .map((r) => r.card?.name)
        .filter(Boolean);

      const registersMatch =
        JSON.stringify(currentRegisterCards) ===
        JSON.stringify(personalState.lockedInCards);

      if (!registersMatch) {
        // Player has locked in - restore their registers
        const restoredRegisters = personalState.lockedInCards.map(
          (cardName, index) => ({
            id: index + 1,
            card: createCardFromBackendString(
              cardName,
              `restored-${index}-${Date.now()}`
            ),
          })
        );

        // Update the registers with the locked-in cards
        handlers.handleSetRegisters(restoredRegisters);

        // Clear the hand (cards were discarded when locked in)
        handlers.handleClearHand();

        console.log("✅ Synced locked-in state from Redux:", {
          username,
          lockedInCards: personalState.lockedInCards,
        });
      }
    }
    // Restore dealt cards (if player hasn't locked in yet but has dealt cards)
    else if (personalState.dealtCards && personalState.dealtCards.length > 0) {
      // Only restore if we don't already have cards in hand
      if (state.hand.length === 0) {
        const restoredHand: ProgramCard[] = personalState.dealtCards.map(
          (cardName: string, index: number) =>
            createCardFromBackendString(
              cardName,
              `restored-${index}-${Date.now()}`
            )
        );

        handlers.handleSetHand(restoredHand);

        console.log("✅ Synced dealt cards from Redux:", {
          username,
          dealtCards: personalState.dealtCards,
        });
      }
    }
  }, [currentGame, state.registers, state.hand.length, username, handlers]);

  // Handle SignalR events - only update Redux state
  useEffect(() => {
    if (!signalR.isConnected) return;

    // Listen for cards dealt event
    const handlePlayerCardsDealt = (...args: unknown[]) => {
      const data = args[0] as {
        username: string;
        gameId: string;
        dealtCards: string[];
      };

      // Dispatch custom event for host controls to sync state
      window.dispatchEvent(new CustomEvent("programmingPhaseCardsDealt"));

      // Only process if this event is for the current player
      if (data.username === username && data.gameId === gameId) {
        // Convert backend card names to ProgramCard objects
        const dealtCards: ProgramCard[] = data.dealtCards.map(
          (cardName: string, index: number) =>
            createCardFromBackendString(
              cardName,
              `dealt-${index}-${Date.now()}`
            )
        );

        // Try to trigger dealing animation if deck is visible
        const deckElement = document.querySelector(
          "[data-deck-element]"
        ) as HTMLElement;
        const handElements = Array.from(
          document.querySelectorAll("[data-hand-placeholder]")
        ) as HTMLElement[];

        if (deckElement && handElements.length > 0) {
          // Use the dealing animation system with actual cards from SignalR
          startDealing(
            deckElement,
            handElements,
            dealtCards,
            (animatedCards: ProgramCard[]) => {
              // The animation completes with the actual dealt cards
              handlers.handleSetHand(animatedCards);
            }
          );
        } else {
          // Fallback: directly set cards if animation elements not found
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
  }, [
    signalR.isConnected,
    username,
    gameId,
    handlers,
    resetDeck,
    startDealing,
    signalR,
  ]);

  // Listen for PlayerLockedInRegister events - only update Redux
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handlePlayerLockedInRegister = (...args: unknown[]) => {
      const data = args[0] as PlayerLockedInRegisterEvent;

      // Update Redux to mark the player as locked in
      // For current user: also store their locked cards in personalState
      if (data.username === username) {
        // Current user - include their locked cards
        dispatch(
          playerLockedIn({
            username: data.username,
            lockedCards: state.registers
              .map((r) => r.card?.name)
              .filter(Boolean) as string[],
          })
        );
      } else {
        // Other player - just mark them as locked in (no cards)
        dispatch(
          playerLockedIn({
            username: data.username,
          })
        );
        toast.info(`${data.username} has locked in their program`);
      }
    };

    signalR.on("PlayerLockedInRegister", handlePlayerLockedInRegister);

    return () => {
      signalR.off("PlayerLockedInRegister");
    };
  }, [signalR.isConnected, username, dispatch, signalR]);

  // Wrapper for handleUploadProgram to trigger discard animation
  const handleUploadProgramWithAnimation = async () => {
    const result = await handlers.handleUploadProgram();

    if (result.success && result.cardsToDiscard.length > 0) {
      // Find the discard pile element
      const discardPileElement = document.querySelector(
        "[data-discard-pile]"
      ) as HTMLElement;

      if (discardPileElement && programmingControlsRef.current) {
        // Get hand placeholder elements for animation start positions
        const handElements =
          programmingControlsRef.current.getPlaceholderElements();

        // Filter to only elements with cards
        const elementsWithCards = handElements.slice(
          0,
          result.cardsToDiscard.length
        );

        // Start the discard animation
        startDiscarding(
          discardPileElement,
          result.cardsToDiscard,
          elementsWithCards,
          () => {
            // After animation completes, clear the hand
            handlers.handleClearHand();
          }
        );
      } else {
        // Fallback: just clear the hand without animation
        handlers.handleClearHand();
      }
    }
  };

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
      {/* Host Controls - Only visible to host in programming phase */}
      {isHost && (
        <ProgrammingPhaseHostControls
          gameId={gameId}
          gameState={currentGame}
          username={username}
        />
      )}

      {/* Header */}
      <ProgrammingHeader filledCount={filledCount} />

      {/* Side-by-side layout: Board on left, Players on right */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex">
        {/* Left side - Game Board */}
        <div className="flex-1 flex items-center justify-center p-1 min-h-0">
          <GameBoardComponent
            gameBoardData={gameBoard}
            players={currentGame.players}
            className="w-full h-full max-h-full"
          />
        </div>
        {/* Right side - Player Information */}
        <div className="w-64 p-4 bg-surface-dark/30 border-l border-glass-border flex-shrink-0">
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
        handlers={{
          ...handlers,
          handleUploadProgram: handleUploadProgramWithAnimation,
        }}
        showControls={showProgrammingControls}
        onToggleControls={() =>
          setShowProgrammingControls(!showProgrammingControls)
        }
        filledCount={filledCount}
        programComplete={programComplete}
        isSubmitting={isSubmitting}
        isLockedIn={isLockedInFromBackend}
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

      {/* Discard Animation Overlay */}
      <DiscardAnimationOverlay
        discardingCards={discardingState.discardingCards}
        onCardDiscarded={markCardAsDiscarded}
      />
    </motion.div>
  );
};
