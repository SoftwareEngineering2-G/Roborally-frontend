"use client";

import { Button } from "@/components/ui/button";
import { useStartCardDealingForAllMutation, useStartActivationPhaseMutation, useRevealNextRegisterMutation } from "@/redux/api/game/gameApi";
import { Crown, Play, Users, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import type { GetCurrentGameStateResponse } from "@/redux/api/game/types";
import { useAppSelector } from "@/redux/hooks";

interface GameHostControlsProps {
  gameId: string;
  gameState: GetCurrentGameStateResponse;
  cardsDealt: boolean;
  onCardsDealt: () => void;
}

export const GameHostControls = ({ gameId, gameState, cardsDealt, onCardsDealt }: GameHostControlsProps) => {
  const [startCardDealing, { isLoading: isDealingCards }] = useStartCardDealingForAllMutation();
  const [startActivationPhase, { isLoading: isStartingActivation }] = useStartActivationPhaseMutation();
  const [revealNextRegister, { isLoading: isRevealingRegister }] = useRevealNextRegisterMutation();

  // Get current revealed register from Redux
  const currentRevealedRegister = useAppSelector(state => state.game.currentGame?.currentRevealedRegister);

  // Get username from localStorage
  const username = localStorage.getItem("username") || "host";

  // Check if all players have locked in their programs
  const allPlayersLockedIn = gameState.players.every((player) => player.hasLockedIn);
  const lockedInCount = gameState.players.filter((player) => player.hasLockedIn).length;

  // Determine which register to reveal next (0-4)
  const nextRegisterToReveal = (currentRevealedRegister ?? -1) + 1;
  const allRegistersRevealed = nextRegisterToReveal >= 5;

  const handleStartCardDealing = async () => {
    try {
      await startCardDealing({ gameId, username }).unwrap();
      onCardsDealt();
      toast.success("Cards dealt to all players!");
    } catch (error) {
      toast.error("Failed to deal cards");
      console.error("Failed to start card dealing:", error);
    }
  };

  const handleStartActivationPhase = async () => {
    try {
      await startActivationPhase({ gameId, username }).unwrap();
      toast.success("Activation phase started!");
    } catch (error) {
      toast.error("Failed to start activation phase");
      console.error("Failed to start activation phase:", error);
    }
  };

  const handleRevealNextRegister = async () => {
    try {
      await revealNextRegister({ gameId, username }).unwrap();
      const registerLabel = nextRegisterToReveal === 0 ? "first" : nextRegisterToReveal === 1 ? "second" : nextRegisterToReveal === 2 ? "third" : nextRegisterToReveal === 3 ? "fourth" : "fifth";
      toast.success(`Revealed ${registerLabel} card for all players!`);
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
      
      {/* Programming Phase: Deal Cards or Start Activation */}
      {gameState.currentPhase === "ProgrammingPhase" && (
        <>
          {!cardsDealt ? (
            <Button
              onClick={handleStartCardDealing}
              disabled={isDealingCards}
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              <Play className="w-3 h-3 mr-1" />
              {isDealingCards ? "Starting..." : "Deal Cards"}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-surface-dark/30 px-2 py-1 rounded border border-glass-border">
                <Users className="w-3 h-3" />
                <span>{lockedInCount}/{gameState.players.length} Ready</span>
              </div>
              <Button
                onClick={handleStartActivationPhase}
                disabled={!allPlayersLockedIn || isStartingActivation}
                size="sm"
                variant="outline"
                className={`h-7 text-xs ${
                  allPlayersLockedIn 
                    ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50" 
                    : "bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {isStartingActivation ? "Starting..." : "Start Activation Phase"}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Activation Phase: Reveal Next Card */}
      {gameState.currentPhase === "ActivationPhase" && (
        <Button
          onClick={handleRevealNextRegister}
          disabled={allRegistersRevealed || isRevealingRegister}
          size="sm"
          variant="outline"
          className={`h-7 text-xs ${
            !allRegistersRevealed
              ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50" 
              : "bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Eye className="w-3 h-3 mr-1" />
          {isRevealingRegister 
            ? "Revealing..." 
            : allRegistersRevealed 
              ? "All Cards Revealed" 
              : `Reveal ${nextRegisterToReveal === 0 ? "First" : "Next"} Card`
          }
        </Button>
      )}
    </div>
  );
};
