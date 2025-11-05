"use client";

import { Button } from "@/components/ui/button";
import { useRevealNextRegisterMutation, useActivateNextBoardElementMutation } from "@/redux/api/game/gameApi";
import { Crown, Users, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/models/gameModels";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react";

interface ActivationPhaseHostControlsProps {
  gameId: string;
  gameState: Game;
  username: string;
}

export const ActivationPhaseHostControls = ({
  gameId,
  gameState,
  username,
}: ActivationPhaseHostControlsProps) => {
  const [revealNextRegister, { isLoading: isRevealingRegister }] =
    useRevealNextRegisterMutation();
  const [activateNextBoardElement, { isLoading: isActivatingBoardElement }] =
    useActivateNextBoardElementMutation();

  // Get current revealed register, current turn, and executed players from Redux
  const currentRevealedRegister = useAppSelector(
    (state) => state.game.currentGame?.currentRevealedRegister
  );
  const currentTurnUsername = useAppSelector(
    (state) => state.game.currentGame?.currentTurnUsername
  );
  const executedPlayers = useAppSelector((state) => state.game.executedPlayers);

  // Determine which register to reveal next (0-4)
  const nextRegisterToReveal = (currentRevealedRegister ?? -1) + 1;
  const allRegistersRevealed = nextRegisterToReveal >= 5;

  // If currentTurnUsername is null, that means a new register must be revealed
  // Otherwise, the respective player must execute their card
  const shouldRevealNextRegister = currentTurnUsername === null;
  const canRevealNextRegister =
    shouldRevealNextRegister && !allRegistersRevealed;

  const handleRevealNextRegister = async () => {
    try {
      await revealNextRegister({ gameId, username }).unwrap();
    } catch (error) {
      toast.error("Failed to reveal next register");
      console.error("Failed to reveal next register:", error);
    }
  };

  // Track if we've already activated board elements for this register
  const hasActivatedForRegister = useRef<number>(-1);

  // Check if all players have executed their cards for the current register
  const allPlayersExecuted = executedPlayers.length === gameState.players.length;

  // Automatically activate board elements when all players have executed
  useEffect(() => {
    const activateBoardElements = async () => {
      // Only activate if:
      // 1. All players have executed their cards
      // 2. We haven't already activated for this register
      // 3. There is a current revealed register
      if (
        allPlayersExecuted &&
        currentRevealedRegister !== null &&
        currentRevealedRegister !== undefined &&
        currentRevealedRegister >= 0 &&
        hasActivatedForRegister.current !== currentRevealedRegister
      ) {
        hasActivatedForRegister.current = currentRevealedRegister;

        try {
          // Call the activation endpoint 3 times to activate all board elements
          // 1st: Blue Conveyor Belts
          await activateNextBoardElement({ gameId, username }).unwrap();
          toast.success("Blue conveyor belts activated!");

          // 2nd: Green Conveyor Belts
          await activateNextBoardElement({ gameId, username }).unwrap();
          toast.success("Green conveyor belts activated!");

          // 3rd: Gears
          await activateNextBoardElement({ gameId, username }).unwrap();
          toast.success("Gears activated!");

          toast.info("All board elements activated! Ready for next register.");
        } catch (error) {
          toast.error("Failed to activate board elements");
          console.error("Failed to activate board elements:", error);
        }
      }
    };

    activateBoardElements();
  }, [
    allPlayersExecuted,
    currentRevealedRegister,
    activateNextBoardElement,
    gameId,
    username,
  ]);

  return (
    <div className="fixed top-4 right-4 z-[10000] flex items-center gap-2">
      <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
        <Crown className="w-3 h-3" />
        <span>Host</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Show current turn information */}
        {currentTurnUsername && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-surface-dark/30 px-2 py-1 rounded border border-glass-border">
            <Users className="w-3 h-3" />
            <span>Waiting for {currentTurnUsername} to execute</span>
          </div>
        )}

        {/* Show execution progress if card is revealed */}
        {currentRevealedRegister != null && currentRevealedRegister >= 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-surface-dark/30 px-2 py-1 rounded border border-glass-border">
            <Users className="w-3 h-3" />
            <span>
              {executedPlayers.length}/{gameState.players.length} Executed
            </span>
          </div>
        )}

        <Button
          onClick={handleRevealNextRegister}
          disabled={!canRevealNextRegister || isRevealingRegister}
          size="sm"
          variant="outline"
          className={`h-7 text-xs ${
            canRevealNextRegister
              ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50"
              : "bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Eye className="w-3 h-3 mr-1" />
          {isRevealingRegister
            ? "Revealing..."
            : allRegistersRevealed
            ? "All Cards Revealed"
            : !shouldRevealNextRegister
            ? "Waiting for players..."
            : `Reveal ${nextRegisterToReveal === 0 ? "First" : "Next"} Card`}
        </Button>
      </div>
    </div>
  );
};
