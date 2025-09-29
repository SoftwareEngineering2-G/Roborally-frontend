"use client";

import { useState, useCallback } from "react";
import { ProgramCard } from "./types";

export interface DealingCard {
  id: string;
  card: ProgramCard;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  delay: number;
  isDealt: boolean;
}

export interface CardDealingState {
  isDealing: boolean;
  dealingCards: DealingCard[];
  deckCount: number;
}

export const useCardDealing = (initialDeckCount: number = 20) => {
  const [state, setState] = useState<CardDealingState>({
    isDealing: false,
    dealingCards: [],
    deckCount: initialDeckCount,
  });

  const generateMockHand = useCallback((): ProgramCard[] => {
    // Create one of each card type for a complete hand
    return [
      {
        id: "deal-1",
        name: "Move 1",
        type: "move1",
        imagePath: "/cards/move1.png",
      },
      {
        id: "deal-2",
        name: "Move 2",
        type: "move2",
        imagePath: "/cards/move2.png",
      },
      {
        id: "deal-3",
        name: "Move 3",
        type: "move3",
        imagePath: "/cards/move3.png",
      },
      {
        id: "deal-4",
        name: "Move Back",
        type: "moveback",
        imagePath: "/cards/moveback.png",
      },
      {
        id: "deal-5",
        name: "Power Up",
        type: "powerup",
        imagePath: "/cards/powerup.png",
      },
      {
        id: "deal-6",
        name: "Rotate Left",
        type: "rotateleft",
        imagePath: "/cards/rotateleft.png",
      },
      {
        id: "deal-7",
        name: "Rotate Right",
        type: "rotateright",
        imagePath: "/cards/rotateright.png",
      },
      {
        id: "deal-8",
        name: "U-Turn",
        type: "uturn",
        imagePath: "/cards/uturn.png",
      },
      {
        id: "deal-9",
        name: "Again",
        type: "move1",
        imagePath: "/cards/again.png",
      }, // Using again.png for variety
    ];
  }, []);

  const calculateCardPositions = useCallback(
    (handContainerRect: DOMRect, deckRect: DOMRect) => {
      console.log("Calculating positions:", { handContainerRect, deckRect });

      const positions: { x: number; y: number }[] = [];
      const cardWidth = 80; // Approximate card width
      const cardSpacing = 8; // Gap between cards
      const totalWidth = 9 * cardWidth + 8 * cardSpacing;
      const startX =
        handContainerRect.left + (handContainerRect.width - totalWidth) / 2;

      for (let i = 0; i < 9; i++) {
        positions.push({
          x: startX + i * (cardWidth + cardSpacing),
          y: handContainerRect.top,
        });
      }

      const result = positions.map((pos, index) => ({
        startPosition: {
          x: deckRect.left + deckRect.width / 2,
          y: deckRect.top + deckRect.height / 2,
        },
        endPosition: pos,
        delay: index * 150, // 150ms between each card
      }));

      console.log("Position calculation result:", result);
      return result;
    },
    []
  );

  const startDealing = useCallback(
    (
      deckElement: HTMLElement,
      handContainer: HTMLElement,
      onComplete: (cards: ProgramCard[]) => void
    ) => {
      console.log("Starting dealing...", {
        deckElement,
        handContainer,
        isDealing: state.isDealing,
        deckCount: state.deckCount,
      });

      if (state.isDealing || state.deckCount < 9) {
        console.log("Cannot deal - conditions not met");
        return;
      }

      const deckRect = deckElement.getBoundingClientRect();
      const handRect = handContainer.getBoundingClientRect();
      console.log("Element rects:", { deckRect, handRect });

      const newCards = generateMockHand();
      const positions = calculateCardPositions(handRect, deckRect);

      const dealingCards: DealingCard[] = newCards.map((card, index) => ({
        id: `dealing-${card.id}-${Date.now()}`,
        card,
        ...positions[index],
        isDealt: false,
      }));

      console.log("Created dealing cards:", dealingCards);

      setState((prev) => ({
        ...prev,
        isDealing: true,
        dealingCards,
      }));

      // Complete dealing animation after all cards are dealt
      const totalDealTime = 9 * 150 + 500; // 9 cards * 150ms + 500ms for last card animation
      setTimeout(() => {
        console.log("Dealing complete");
        setState((prev) => ({
          ...prev,
          isDealing: false,
          dealingCards: [],
          deckCount: prev.deckCount - 9,
        }));
        onComplete(newCards);
      }, totalDealTime);
    },
    [state.isDealing, state.deckCount, generateMockHand, calculateCardPositions]
  );

  const markCardAsDealt = useCallback((cardId: string) => {
    setState((prev) => ({
      ...prev,
      dealingCards: prev.dealingCards.map((card) =>
        card.id === cardId ? { ...card, isDealt: true } : card
      ),
    }));
  }, []);

  const resetDeck = useCallback(() => {
    setState((prev) => ({
      ...prev,
      deckCount: initialDeckCount,
    }));
  }, [initialDeckCount]);

  return {
    dealingState: state,
    startDealing,
    markCardAsDealt,
    resetDeck,
  };
};
