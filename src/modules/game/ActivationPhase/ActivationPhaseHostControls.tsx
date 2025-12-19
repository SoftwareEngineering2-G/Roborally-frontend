"use client";

import { Button } from "@/components/ui/button";
import {
  useRevealNextRegisterMutation,
  useActivateNextBoardElementMutation,
  useStartNextRoundMutation,
  useExecuteProgrammingCardMutation,
} from "@/redux/api/game/gameApi";
import { Crown, Users, Eye, RotateCw, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/models/gameModels";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { setBatchModeActive } from "@/redux/game/gameSlice";

interface ActivationPhaseHostControlsProps {
  gameId: string;
  gameState: Game;
  username: string;
}

/**
 * @author Sachin Baral 2025-11-04 21:25:08 +0100 23
 */
export const ActivationPhaseHostControls = ({
  gameId,
  gameState,
  username,
}: ActivationPhaseHostControlsProps) => {
  const dispatch = useAppDispatch();
  const [revealNextRegister, { isLoading: isRevealingRegister }] = useRevealNextRegisterMutation();
  const [activateNextBoardElement] = useActivateNextBoardElementMutation();
  const [startNextRound, { isLoading: isStartingNextRound }] = useStartNextRoundMutation();
  const [executeCard] = useExecuteProgrammingCardMutation();
  const [canStartNextRound, setCanStartNextRound] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isPausedForInteraction, setIsPausedForInteraction] = useState(false);
  const pausedForPlayer = useRef<string | null>(null);

  // Get current revealed register, current turn, and executed players from Redux
  const currentRevealedRegister = useAppSelector(
    (state) => state.game.currentGame?.currentRevealedRegister
  );
  const currentTurnUsername = useAppSelector((state) => state.game.currentTurnUsername);
  const executedPlayers = useAppSelector((state) => state.game.executedPlayers);

  // Determine which register to reveal next (0-4)
/**
 * @author Sachin Baral 2025-11-04 21:25:08 +0100 46
 */
  const nextRegisterToReveal = (currentRevealedRegister ?? -1) + 1;
  const allRegistersRevealed = nextRegisterToReveal >= 5;

  // If currentTurnUsername is null, that means a new register must be revealed
  // Otherwise, the respective player must execute their card
  const shouldRevealNextRegister = currentTurnUsername === null;
  const canRevealNextRegister = shouldRevealNextRegister && !allRegistersRevealed;

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

          // 2nd: Green Conveyor Belts
          await activateNextBoardElement({ gameId, username }).unwrap();

          // 3rd: Gears
          await activateNextBoardElement({ gameId, username }).unwrap();

          // If this was the last register (register 4 in 0-indexed), enable next round button
          if (currentRevealedRegister === 4) {
            setCanStartNextRound(true);
            toast.success("Round complete! You can start the next round.");
          } else {
            toast.info("Board elements activated! Ready for next register.");
          }
        } catch (error) {
          toast.error("Failed to activate board elements");
          console.error("Failed to activate board elements:", error);
        }
      }
    };

    activateBoardElements();
  }, [allPlayersExecuted, currentRevealedRegister, activateNextBoardElement, gameId, username]);

  // Batch mode auto-execution logic
  useEffect(() => {
    if (!isBatchMode || isPausedForInteraction) return;

    // Stop batch mode if all registers are revealed AND all players have executed the last register
    if (allRegistersRevealed && allPlayersExecuted) {
      setIsBatchMode(false);
      dispatch(setBatchModeActive(false));
      toast.success("Batch mode complete - all registers executed");
      return;
    }

    const runBatchStep = async () => {
      // Step 1: If no register revealed yet or all players executed, reveal next register
      if (shouldRevealNextRegister && !allRegistersRevealed) {
        await handleRevealNextRegister();
        return;
      }

      // Step 2: If there's a player whose turn it is, execute their card
      if (currentTurnUsername) {
        const player = gameState.players.find((p) => p.username === currentTurnUsername);
        if (!player) return;

        const currentRegisterIndex = currentRevealedRegister ?? 0;
        const cardToExecute = player.revealedCardsInOrder[currentRegisterIndex];
        
        if (!cardToExecute) return;

        // Check if card is interactive (requires user input)
        const isInteractive = cardToExecute === "Swap Position" || cardToExecute === "Movement Choice";
        
        if (isInteractive) {
          // Pause batch mode for interactive cards (keep batch mode active state, just pause execution)
          setIsPausedForInteraction(true);
          pausedForPlayer.current = currentTurnUsername;
          // Don't set batch mode to false, just pause - execute button should still be hidden
          toast.warning(`Batch mode paused: ${currentTurnUsername} needs to configure ${cardToExecute}`);
          return;
        }

        // Execute non-interactive card automatically
        try {
          await executeCard({
            gameId,
            username: currentTurnUsername,
            cardName: cardToExecute,
          }).unwrap();
        } catch (error) {
          console.error("Batch mode execution failed:", error);
          toast.error("Batch mode execution failed");
          setIsBatchMode(false);
          dispatch(setBatchModeActive(false));
        }
      }
    };

    // Small delay to allow state updates to propagate
    const timer = setTimeout(runBatchStep, 800);
    return () => clearTimeout(timer);
  }, [
    isBatchMode,
    isPausedForInteraction,
    shouldRevealNextRegister,
    allRegistersRevealed,
    allPlayersExecuted,
    currentTurnUsername,
    currentRevealedRegister,
    gameState.players,
    handleRevealNextRegister,
    executeCard,
    gameId,
    dispatch,
  ]);

  // Resume batch mode after interactive card is executed
  useEffect(() => {
    if (isPausedForInteraction && pausedForPlayer.current) {
      // Check if the paused player is no longer the current turn (meaning they executed)
      if (currentTurnUsername !== pausedForPlayer.current) {
        setIsPausedForInteraction(false);
        pausedForPlayer.current = null;
        toast.success("Batch mode resumed");
      }
    }
  }, [currentTurnUsername, isPausedForInteraction]);

  const handleStartNextRound = async () => {
    try {
      await startNextRound({ gameId }).unwrap();
      setCanStartNextRound(false);
      toast.success("Starting next round...");
    } catch (error) {
      toast.error("Failed to start next round");
      console.error("Failed to start next round:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
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

        {/* Batch Mode Toggle Button */}
        <Button
          onClick={() => {
            const newMode = !isBatchMode;
            setIsBatchMode(newMode);
            dispatch(setBatchModeActive(newMode));
            if (newMode) {
              toast.success("Batch mode started - cards will auto-execute");
              setIsPausedForInteraction(false);
              pausedForPlayer.current = null;
            } else {
              toast.info("Batch mode stopped");
            }
          }}
          disabled={allRegistersRevealed}
          size="sm"
          variant="outline"
          className={`h-7 text-xs ${
            isBatchMode
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50"
              : "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50"
          }`}
        >
          {isBatchMode ? (
            <>
              <Pause className="w-3 h-3 mr-1" />
              {isPausedForInteraction ? "Paused for Input" : "Stop Batch"}
            </>
          ) : (
            <>
              <Play className="w-3 h-3 mr-1" />
              Start Batch
            </>
          )}
        </Button>

        <Button
          onClick={handleRevealNextRegister}
          disabled={!canRevealNextRegister || isRevealingRegister || isBatchMode}
          size="sm"
          variant="outline"
          className={`h-7 text-xs ${
            canRevealNextRegister && !isBatchMode
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

        {/* Start Next Round Button - only shown when activation phase is complete */}
        {allRegistersRevealed && (
          <Button
            onClick={handleStartNextRound}
            disabled={!canStartNextRound || isStartingNextRound}
            size="sm"
            variant="outline"
            className={`h-7 text-xs ${canStartNextRound
              ? "bg-neon-teal/10 border-neon-teal/30 text-neon-teal hover:bg-neon-teal/20 hover:border-neon-teal/50"
              : "bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed"
              }`}
          >
            <RotateCw className="w-3 h-3 mr-1" />
            {isStartingNextRound
              ? "Starting..."
              : canStartNextRound
                ? "Start Next Round"
                : "Activating board elements..."}
          </Button>
        )}
      </div>
    </div>
  );
};