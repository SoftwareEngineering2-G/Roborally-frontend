import { useState, useCallback } from "react";
import type { ProgramCard, RegisterSlot, ProgrammingPhaseState } from "./types";

export const useProgrammingPhase = (
  initialHand: ProgramCard[],
  initialRegisters: RegisterSlot[]
) => {
  const [state, setState] = useState<ProgrammingPhaseState>({
    hand: initialHand,
    registers: initialRegisters,
    selectedCard: null,
    selectedRegister: null,
    isDragging: false,
    programComplete: false,
  });

  // Card selection (mobile-friendly)
  const handleCardSelect = useCallback((card: ProgramCard) => {
    setState((prev) => ({
      ...prev,
      selectedCard: prev.selectedCard?.id === card.id ? null : card,
      selectedRegister: null,
    }));
  }, []);

  // Register selection
  const handleRegisterSelect = useCallback(
    (registerId: number) => {
      const register = state.registers.find((r) => r.id === registerId);
      if (!register) return;

      setState((prev) => {
        // If we have a selected card, place it in this register
        if (prev.selectedCard) {
          return {
            ...prev,
            registers: prev.registers.map((reg) =>
              reg.id === registerId
                ? { ...reg, card: prev.selectedCard }
                : reg.card?.id === prev.selectedCard?.id
                ? { ...reg, card: null }
                : reg
            ),
            hand: prev.hand.filter((card) => card.id !== prev.selectedCard?.id),
            selectedCard: null,
            selectedRegister: null,
          };
        }

        // Otherwise, just select/deselect the register
        return {
          ...prev,
          selectedRegister:
            prev.selectedRegister === registerId ? null : registerId,
          selectedCard: null,
        };
      });
    },
    [state.registers]
  );

  // Remove card from register
  const handleCardRemove = useCallback((registerId: number) => {
    setState((prev) => {
      const register = prev.registers.find((r) => r.id === registerId);
      if (!register?.card) return prev;

      return {
        ...prev,
        registers: prev.registers.map((reg) =>
          reg.id === registerId ? { ...reg, card: null } : reg
        ),
        hand: [...prev.hand, register.card],
        selectedCard: null,
        selectedRegister: null,
      };
    });
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((card: ProgramCard) => {
    setState((prev) => ({ ...prev, isDragging: true, selectedCard: card }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDrop = useCallback(
    (registerId: number, card: ProgramCard) => {
      const register = state.registers.find((r) => r.id === registerId);
      if (!register) return;

      setState((prev) => ({
        ...prev,
        registers: prev.registers.map((reg) => {
          if (reg.id === registerId) {
            return { ...reg, card };
          }
          // Remove card from other registers if it was there
          if (reg.card?.id === card.id) {
            return { ...reg, card: null };
          }
          return reg;
        }),
        hand: prev.hand.filter((c) => c.id !== card.id),
        selectedCard: null,
        isDragging: false,
      }));
    },
    [state.registers]
  );

  // Upload program
  const handleUploadProgram = useCallback(() => {
    const isComplete = state.registers.every((reg) => reg.card !== null);

    if (isComplete) {
      // Here you would send the program to the server
      console.log(
        "Uploading program:",
        state.registers.map((r) => r.card)
      );
      // For now, just show an alert
      alert("Program uploaded successfully!");
      return true;
    }
    return false;
  }, [state.registers]);

  return {
    state,
    handlers: {
      handleCardSelect,
      handleRegisterSelect,
      handleCardRemove,
      handleDragStart,
      handleDragEnd,
      handleDrop,
      handleUploadProgram,
    },
  };
};
