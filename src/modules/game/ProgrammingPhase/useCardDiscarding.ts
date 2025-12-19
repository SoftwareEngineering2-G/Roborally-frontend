"use client";

import { useState, useCallback } from "react";
import { ProgramCard } from "./types";

export interface DiscardingCard {
  id: string;
  card: ProgramCard;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  delay: number;
  isDiscarded: boolean;
}

export interface CardDiscardingState {
  isDiscarding: boolean;
  discardingCards: DiscardingCard[];
}

/**
 * @author Sachin Baral 2025-11-04 21:25:08 +0100 20
 */
export const useCardDiscarding = () => {
  const [state, setState] = useState<CardDiscardingState>({
    isDiscarding: false,
    discardingCards: [],
  });

  const calculateDiscardPositions = useCallback(
    (handElements: (HTMLElement | null)[], discardPileRect: DOMRect) => {
      const positions: {
        startPosition: { x: number; y: number };
        endPosition: { x: number; y: number };
        delay: number;
      }[] = [];

      // Get positions for each card in hand that needs to be discarded
      handElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          positions.push({
            startPosition: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            },
            endPosition: {
              x: discardPileRect.left + discardPileRect.width / 2,
              y: discardPileRect.top + discardPileRect.height / 2,
            },
            delay: index * 100, // 100ms between each card
          });
        }
      });

      return positions;
    },
    []
  );

  const startDiscarding = useCallback(
    (
      discardPileElement: HTMLElement,
      cardsToDiscard: ProgramCard[],
      handElements: (HTMLElement | null)[],
      onComplete: () => void
    ) => {
      if (state.isDiscarding || cardsToDiscard.length === 0) {
        return;
      }

      const discardRect = discardPileElement.getBoundingClientRect();

      // Filter hand elements to only those with cards
      const validHandElements = handElements.filter((el, index) => {
        return el && cardsToDiscard[index];
      });

      const positions = calculateDiscardPositions(
        validHandElements,
        discardRect
      );

      const discardingCards: DiscardingCard[] = cardsToDiscard.map(
        (card, index) => ({
          id: `discarding-${card.id}-${Date.now()}`,
          card,
          ...positions[index],
          isDiscarded: false,
        })
      );

      setState({
        isDiscarding: true,
        discardingCards,
      });

      // Complete discarding animation after all cards are discarded
      const totalDiscardTime = cardsToDiscard.length * 100 + 500; // cards * 100ms + 500ms for last card animation
      setTimeout(() => {
        setState({
          isDiscarding: false,
          discardingCards: [],
        });
        onComplete();
      }, totalDiscardTime);
    },
    [state.isDiscarding, calculateDiscardPositions]
  );

  const markCardAsDiscarded = useCallback((cardId: string) => {
    setState((prev) => ({
      ...prev,
      discardingCards: prev.discardingCards.map((card) =>
        card.id === cardId ? { ...card, isDiscarded: true } : card
      ),
    }));
  }, []);

  return {
    discardingState: state,
    startDiscarding,
    markCardAsDiscarded,
  };
};