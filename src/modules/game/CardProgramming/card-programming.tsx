"use client";

import { useState, useEffect } from "react";
import { ProgrammingHeader } from "./ProgrammingHeader";
import { ProgrammingPhase } from "./ProgrammingPhase";
import { DealingAnimationOverlaySimple } from "./DealingAnimationSimple";
import { SAMPLE_CARDS, INITIAL_REGISTERS, createCardFromBackendString, ProgramCard } from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { useCardDealing } from "./useCardDealing";
import { useGameSignalR } from "./hooks/useGameSignalR";
import { toast } from "sonner";
import { GetCurrentGameStateResponse } from "@/redux/api/game/types";
import { useAppDispatch } from "@/redux/hooks";
import { playerLockedIn } from "@/redux/game/gameSlice";

interface CardProgrammingProps {
  gameId: string;
  username: string;
  gameState: GetCurrentGameStateResponse;
  hostControls?: React.ReactNode;
}

export const CardProgramming = ({ gameId, username, gameState, hostControls }: CardProgrammingProps) => {
  const [showProgrammingControls, setShowProgrammingControls] = useState(true);
  const dispatch = useAppDispatch();
  
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

  // Handle SignalR events
  useEffect(() => {
    if (!signalR.isConnected) return;

    // Listen for cards dealt event
    const handlePlayerCardsDealt = (data: any) => {
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
  }, [signalR.isConnected, username, gameId, handlers.handleSetHand, resetDeck, startDealing]);

  // Listen for PlayerLockedInRegister events
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handlePlayerLockedInRegister = (data: { username: string }) => {
      console.log("Player locked in register:", data);
      
      // Update Redux state to mark player as locked in
      dispatch(playerLockedIn({ username: data.username }));
      
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
  }, [signalR.isConnected, username, dispatch]);

  const toggleProgrammingControls = () => {
    setShowProgrammingControls((prev) => !prev);
  };

  const generateSampleCards = (count: number = 9): ProgramCard[] => {
    const cardTypes = ["Move 1", "Move 2", "Move 3", "Move Back", "Power Up", "Rotate Left", "Rotate Right", "U-Turn", "Again"];
    const imageMap: Record<string, string> = {
      "Move 1": "move1",
      "Move 2": "move2", 
      "Move 3": "move3",
      "Move Back": "moveback",
      "Power Up": "powerup",
      "Rotate Left": "rotateleft",
      "Rotate Right": "rotateright",
      "U-Turn": "uturn",
      "Again": "again"
    };
    
    return Array.from({ length: count }, (_, i) => {
      const cardType = cardTypes[i % cardTypes.length];
      return {
        id: `manual-${Date.now()}-${i}`,
        name: cardType as any,
        type: cardType as any,
        imagePath: `/cards/${imageMap[cardType]}.png`,
      };
    });
  };


  const handleResetDeck = () => {
    // Clear the hand and reset deck
    handlers.handleSetHand([]);
    resetDeck();
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* SignalR Connection Status */}
      {!signalR.isConnected && (
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {signalR.isConnecting
                  ? "Connecting to game session..."
                  : "Not connected to game session"}
                {signalR.error && ` - Error: ${signalR.error}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Programming Header */}
      <ProgrammingHeader
        filledCount={filledCount}
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
          programComplete={programComplete}
          isSubmitting={isSubmitting}
          deckCount={dealingState.deckCount}
          isDealing={dealingState.isDealing}
          onResetDeck={handleResetDeck}
          gameState={gameState}
          currentUsername={username}
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