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



  const calculateCardPositions = useCallback(
    (placeholderElements: (HTMLElement | null)[], deckRect: DOMRect) => {
      const positions: { x: number; y: number }[] = [];

      // Get exact positions from placeholder elements
      for (let i = 0; i < 9; i++) {
        const placeholder = placeholderElements[i];
        if (placeholder) {
          const rect = placeholder.getBoundingClientRect();
          // Calculate top-left position for exact alignment
          positions.push({
            x: rect.left + rect.width / 2, // Still use center for calculation, offset applied in animation
            y: rect.top + rect.height / 2, // Still use center for calculation, offset applied in animation
          });
        } else {
          console.warn(`❌ Placeholder ${i} not found`);
          positions.push({ x: 0, y: 0 });
        }
      }

      const result = positions.map((pos, index) => ({
        startPosition: {
          x: deckRect.left + deckRect.width / 2, // Start from deck center
          y: deckRect.top + deckRect.height / 2, // Start from deck center
        },
        endPosition: pos, // End at placeholder center (offset applied in animation)
        delay: index * 150, // 150ms between each card
      }));
      return result;
    },
    []
  );

  const startDealing = useCallback(
    (
      deckElement: HTMLElement,
      placeholderElements: (HTMLElement | null)[],
      cardsToAnimate: ProgramCard[],
      onComplete: (cards: ProgramCard[]) => void
    ) => {
      if (state.isDealing || cardsToAnimate.length === 0) {
        return;
      }

      const deckRect = deckElement.getBoundingClientRect();
      const positions = calculateCardPositions(placeholderElements, deckRect);

      const dealingCards: DealingCard[] = cardsToAnimate.map((card, index) => ({
        id: `dealing-${card.id}-${Date.now()}`,
        card,
        ...positions[index],
        isDealt: false,
      }));

      setState((prev) => ({
        ...prev,
        isDealing: true,
        dealingCards,
      }));

      // Complete dealing animation after all cards are dealt
      const totalDealTime = cardsToAnimate.length * 150 + 500; // cards * 150ms + 500ms for last card animation
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isDealing: false,
          dealingCards: [],
          deckCount: Math.max(0, prev.deckCount - cardsToAnimate.length),
        }));
        onComplete(cardsToAnimate);
      }, totalDealTime);
    },
    [state.isDealing, calculateCardPositions]
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
