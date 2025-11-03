"use client";

import { Button } from "@/components/ui/button";
import { useRevealNextRegisterMutation } from "@/redux/api/game/gameApi";
import { Crown, Users, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/models/gameModels";
import { useAppSelector } from "@/redux/hooks";

interface GameHostControlsProps {
  gameId: string;
  gameState: Game;
}

export const GameHostControls = ({
  gameId,
  gameState,
}: GameHostControlsProps) => {
  const [revealNextRegister, { isLoading: isRevealingRegister }] =
    useRevealNextRegisterMutation();

  // Get current revealed register and executed players from Redux
  const currentRevealedRegister = useAppSelector(
    (state) => state.game.currentGame?.currentRevealedRegister
  );
  const executedPlayers = useAppSelector((state) => state.game.executedPlayers);

  // Get username from localStorage
  const username = localStorage.getItem("username") || "host";

  // Determine which register to reveal next (0-4)
  const nextRegisterToReveal = (currentRevealedRegister ?? -1) + 1;
  const allRegistersRevealed = nextRegisterToReveal >= 5;

  // Check if all players have executed their current card
  const allPlayersExecuted =
    currentRevealedRegister !== undefined && currentRevealedRegister >= 0
      ? executedPlayers.length === gameState.players.length
      : true; // If no card revealed yet, allow revealing

  const handleRevealNextRegister = async () => {
    try {
      await revealNextRegister({ gameId, username }).unwrap();
    } catch (error) {
      toast.error("Failed to reveal next register");
      console.error("Failed to reveal next register:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
        <Crown className="w-3 h-3" />
        <span>Host</span>
      </div>

      {/* Activation Phase: Reveal Next Card */}
      {gameState.currentPhase === "ActivationPhase" && (
        <div className="flex items-center gap-2">
          {/* Show execution progress if card is revealed */}
          {currentRevealedRegister !== undefined &&
            currentRevealedRegister >= 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-surface-dark/30 px-2 py-1 rounded border border-glass-border">
                <Users className="w-3 h-3" />
                <span>
                  {executedPlayers.length}/{gameState.players.length} Executed
                </span>
              </div>
            )}

          <Button
            onClick={handleRevealNextRegister}
            disabled={
              allRegistersRevealed || isRevealingRegister || !allPlayersExecuted
            }
            size="sm"
            variant="outline"
            className={`h-7 text-xs ${
              !allRegistersRevealed && allPlayersExecuted
                ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50"
                : "bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Eye className="w-3 h-3 mr-1" />
            {isRevealingRegister
              ? "Revealing..."
              : allRegistersRevealed
              ? "All Cards Revealed"
              : !allPlayersExecuted
              ? "Waiting for players..."
              : `Reveal ${nextRegisterToReveal === 0 ? "First" : "Next"} Card`}
          </Button>
        </div>
      )}
    </div>
  );
};
