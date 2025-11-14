"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { GameBoard as GameBoardComponent } from "../components/GameBoard";
import { PlayerProgramDisplay } from "./PlayerProgramDisplay";
import { ActivationPhaseHostControls } from "./ActivationPhaseHostControls";
import { useGameSignalR } from "../ProgrammingPhase/hooks/useGameSignalR";
import { useRequestGameEndMutation } from "@/redux/api/game/gameApi";
import {
  updateRevealedCards,
  setCurrentTurn,
  updateRobotPosition,
  markPlayerExecuted,
  updatePlayerCheckpoint,
} from "@/redux/game/gameSlice";
import type {
  RegisterRevealedEvent,
  RobotMovedEvent,
  NextPlayerInTurnEvent,
  CheckpointReachedEvent,
} from "@/types/signalr";
import { toast } from "sonner";
import type { GameBoard } from "@/models/gameModels";

interface ActivationPhaseProps {
  gameId: string;
  username: string;
  gameBoard: GameBoard;
  pauseButton?: React.ReactNode;
}

export const ActivationPhase = ({
  gameId,
  username,
  gameBoard,
  pauseButton,
}: ActivationPhaseProps) => {
  const dispatch = useAppDispatch();

  // Get game state from Redux (programmedCards should be populated from backend or SignalR)
  const { currentGame, currentTurnUsername } = useAppSelector((state) => state.game);
  const [requestGameEnd] = useRequestGameEndMutation();

  type TileWithName = {
    name?: string;
    Name?: string;
  };

  const lastCheckpointNumber = useMemo(() => {
    if (!gameBoard?.spaces) return 0;

    let max = 0;

    for (const row of gameBoard.spaces as TileWithName[][]) {
      for (const tile of row) {
        const tileName = tile.name ?? tile.Name;

        if (tileName?.startsWith("Checkpoint")) {
          if (tileName) {
            const n = Number(tileName.replace("Checkpoint", ""));
            if (!Number.isNaN(n) && n > max) {
              max = n;
            }
          }
        }
      }
    }

    return max;
  }, [gameBoard]);

  // Check if current user is the host
  const isHost = currentGame?.hostUsername === username;

  // Setup SignalR connection for game events
  const signalR = useGameSignalR(gameId, username);

  // Listen for register revealed events
  useEffect(() => {
    if (!signalR.isConnected || !currentGame) return;

    const handleRegisterRevealed = (...args: unknown[]) => {
      const data = args[0] as RegisterRevealedEvent;

      // Only process if this event is for the current game
      if (data.gameId !== gameId) return;

      // Update Redux state with revealed cards and register number
      dispatch(
        updateRevealedCards({
          registerNumber: data.registerNumber,
          revealedCards: data.revealedCards,
        })
      );

      // Show toast notification
      const registerLabel =
        data.registerNumber === 1
          ? "first"
          : data.registerNumber === 2
          ? "second"
          : data.registerNumber === 3
          ? "third"
          : data.registerNumber === 4
          ? "fourth"
          : "fifth";
      toast.info(
        `${
          registerLabel.charAt(0).toUpperCase() + registerLabel.slice(1)
        } card revealed for all players!`
      );
    };

    signalR.on("RegisterRevealed", handleRegisterRevealed);

    return () => {
      signalR.off("RegisterRevealed");
    };
  }, [signalR.isConnected, gameId, dispatch, signalR, currentGame]);

  // Listen for robot movement events (handles both card execution and pushed robots)
  useEffect(() => {
    if (!signalR.isConnected || !currentGame) return;

    const handleRobotMoved = (...args: unknown[]) => {
      const data = args[0] as RobotMovedEvent;

      // Only process if this event is for the current game
      if (data.gameId !== gameId) return;

      const isPushed = !data.executedCard || data.executedCard === "Pushed";

      // Update robot position in Redux
      dispatch(
        updateRobotPosition({
          username: data.username,
          positionX: data.positionX,
          positionY: data.positionY,
          direction: data.direction,
        })
      );

      // Only mark as executed if they actually executed a card (not pushed)
      if (!isPushed) {
        dispatch(markPlayerExecuted(data.username));
      }

      // Show toast for pushed robots
      if (isPushed) {
        toast.info(`${data.username}'s robot was pushed!`);
      }
    };

    signalR.on("RobotMoved", handleRobotMoved);

    return () => {
      signalR.off("RobotMoved");
    };
  }, [signalR.isConnected, gameId, dispatch, signalR, currentGame]);

  useEffect(() => {
    if (!signalR.isConnected || !currentGame) return;
    const handleCheckpointReached = (...args: unknown[]) => {
      const payload = args[0] as CheckpointReachedEvent;

      dispatch(
        updatePlayerCheckpoint({
          username: payload.username,
          checkpointNumber: payload.checkpointNumber,
        })
      );

      // Show toast notification
      toast.success(`${payload.username} reached checkpoint ${payload.checkpointNumber}!`);

      if (payload.checkpointNumber === lastCheckpointNumber) {
        requestGameEnd({ gameId, winnerUsername: payload.username });
      }
    };

    signalR.on("CheckpointReached", handleCheckpointReached);

    return () => {
      signalR.off("CheckpointReached");
    };
  }, [
    signalR.isConnected,
    gameId,
    dispatch,
    signalR,
    currentGame,
    lastCheckpointNumber,
    requestGameEnd,
  ]);

  // Listen for next player in turn events
  useEffect(() => {
    if (!signalR.isConnected || !currentGame) return;

    const handleNextPlayerInTurn = (...args: unknown[]) => {
      const data = args[0] as NextPlayerInTurnEvent;

      // Only process if this event is for the current game
      if (data.gameId !== gameId) return;

      // Update the current turn username
      dispatch(setCurrentTurn(data.nextPlayerUsername));

      // Show toast notification if it's the current user's turn
      if (data.nextPlayerUsername === username) {
        toast.info("It's your turn to execute your card!");
      } else if (data.nextPlayerUsername) {
        toast.info(`It's ${data.nextPlayerUsername}'s turn to execute!`);
      }
    };

    signalR.on("NextPlayerInTurn", handleNextPlayerInTurn);

    return () => {
      signalR.off("NextPlayerInTurn");
    };
  }, [signalR.isConnected, gameId, dispatch, signalR, currentGame, username]);

  // Don't render if we don't have game state
  if (!currentGame) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading game state...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="activation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-full"
    >
      {/* Host Controls - Only visible to host in activation phase */}
      {isHost && (
        <ActivationPhaseHostControls gameId={gameId} gameState={currentGame} username={username} />
      )}

      {/* Header */}
      <div className="h-20 border-b border-glass-border bg-surface-dark/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neon-teal">Activation Phase</h1>
          <p className="text-sm text-muted-foreground">Watch robots execute their programs</p>
          {pauseButton}
        </div>
      </div>

      {/* Side-by-side layout: Board on left, Players on right */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex">
        {/* Left side - Game Board */}
        <div className="flex-1 flex items-center justify-center p-1 min-h-0">
          <GameBoardComponent
            gameBoardData={gameBoard}
            players={currentGame.players}
            className="w-full h-full max-h-full"
            myUsername={username}
          />
        </div>
        {/* Right side - Player Programs */}
        <div className="w-64 p-4 bg-surface-dark/30 border-l border-glass-border flex-shrink-0">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">
              Player Programs ({currentGame.players.length})
            </h3>
            <div className="space-y-3">
              {[...currentGame.players]
                .sort((a, b) => {
                  // Show current player first
                  if (a.username === username) return -1;
                  if (b.username === username) return 1;
                  return 0;
                })
                .map((player) => (
                  <PlayerProgramDisplay
                    key={player.username}
                    player={player}
                    isCurrentPlayer={player.username === username}
                    revealedUpTo={currentGame.currentRevealedRegister ?? -1}
                    isCurrentTurn={player.username === currentTurnUsername}
                    gameId={gameId}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
