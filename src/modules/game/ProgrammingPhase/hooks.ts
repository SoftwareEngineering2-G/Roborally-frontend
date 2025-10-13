import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { playerLockedIn } from "@/redux/game/gameSlice";
import { useRegistersProgrammedMutation } from "@/redux/api/game/playerApi";
import type { ProgramCard, RegisterSlot, ProgrammingPhaseState } from "./types";

export const useProgrammingPhase = (
  initialHand: ProgramCard[],
  initialRegisters: RegisterSlot[],
  gameId: string,
  username: string
) => {
  const dispatch = useAppDispatch();
  
  const [state, setState] = useState<ProgrammingPhaseState>({
    hand: initialHand,
    registers: initialRegisters,
    selectedCard: null,
    selectedRegister: null,
    isDragging: false,
    programComplete: false,
  });

  // API mutation for submitting locked-in program
  const [registersProgrammed, { isLoading: isSubmitting }] = useRegistersProgrammedMutation();

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
          const existingCard = register.card;

          return {
            ...prev,
            registers: prev.registers.map((reg) =>
              reg.id === registerId
                ? { ...reg, card: prev.selectedCard }
                : reg.card?.id === prev.selectedCard?.id
                ? { ...reg, card: null }
                : reg
            ),
            hand: [
              // Remove the selected card from hand
              ...prev.hand.filter((card) => card.id !== prev.selectedCard?.id),
              // Add the existing card back to hand if there was one
              ...(existingCard ? [existingCard] : []),
            ],
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

      setState((prev) => {
        const targetRegister = prev.registers.find((r) => r.id === registerId);
        const existingCard = targetRegister?.card;

        return {
          ...prev,
          registers: prev.registers.map((reg) => {
            if (reg.id === registerId) {
              // Place the new card in this register
              return { ...reg, card };
            }
            // Remove the dragged card from other registers if it was there
            if (reg.card?.id === card.id) {
              return { ...reg, card: null };
            }
            return reg;
          }),
          hand: [
            // Remove the dragged card from hand
            ...prev.hand.filter((c) => c.id !== card.id),
            // Add the existing card back to hand if there was one
            ...(existingCard ? [existingCard] : []),
          ],
          selectedCard: null,
          isDragging: false,
        };
      });
    },
    [state.registers]
  );

  // Lock in program
  const handleUploadProgram = useCallback(async () => {
    const isComplete = state.registers.every((reg) => reg.card !== null);

    if (!isComplete) {
      toast.error("All registers must be filled before locking in!");
      return false;
    }

    if (isSubmitting) {
      return false; // Prevent multiple submissions
    }

    try {
      // Extract card names from the registers in order
      const lockedCardsInOrder = state.registers
        .sort((a, b) => a.id - b.id) // Ensure correct order
        .map((register) => register.card?.name || "")
        .filter(Boolean); // Remove any empty slots


      // Send to backend
      await registersProgrammed({
        gameId,
        username,
        lockedCardsInOrder,
      }).unwrap();

      // Store locally in Redux for immediate display
      dispatch(playerLockedIn({ 
        username, 
        programmedCards: lockedCardsInOrder 
      }));

      toast.success("Program locked in successfully!");
      return true;
    } catch (error) {
      console.error("Failed to lock in program:", error);
      toast.error("Failed to lock in program. Please try again.");
      return false;
    }
  }, [state.registers, gameId, username, registersProgrammed, isSubmitting, dispatch]);

  // Set hand (for dealing cards)
  const handleSetHand = useCallback((newHand: ProgramCard[]) => {
    setState((prev) => ({
      ...prev,
      hand: newHand,
      selectedCard: null,
    }));
  }, []);

  return {
    state,
    isSubmitting,
    handlers: {
      handleCardSelect,
      handleRegisterSelect,
      handleCardRemove,
      handleDragStart,
      handleDragEnd,
      handleDrop,
      handleUploadProgram,
      handleSetHand,
    },
  };
};
