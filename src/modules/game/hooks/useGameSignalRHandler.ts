"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSignalRContext } from "@/providers/SignalRProvider";
import {
  setGameState,
  updateRobotPosition,
  setRevealedRegister,
  markPlayerExecuted,
  setGameOver,
  updatePlayerCheckpoint,
} from "@/redux/game/gameSlice";

import type {
  GameCompletedBroadcastEvent,
  CheckpointReachedEvent,
  RobotMovedEvent,
} from "@/types/signalr";
import type { GetCurrentGameStateResponse } from "@/redux/api/game/types";

/**
 * @author thorrila 2025-11-11 13:41:48 +0100 22
 */
export const useGameSignalRHandler = () => {
  const { game } = useSignalRContext(); // Connect to the /game hub
  const dispatch = useDispatch();

  useEffect(() => {
    if (!game.isConnected) return;

    // Handle updated game state from backend
    game.on("GameStateUpdated", (...args: unknown[]) => {
      const state = args[0] as GetCurrentGameStateResponse;
      dispatch(setGameState(state));
    });

    // Handle robot movement
    game.on("RobotMoved", (...args: unknown[]) => {
      const data = args[0] as RobotMovedEvent;
      dispatch(
        updateRobotPosition({
          username: data.username,
          positionX: data.positionX,
          positionY: data.positionY,
          direction: data.direction,
        })
      );
    });

    // Handle revealed register updates
    game.on("RegisterRevealed", (...args: unknown[]) => {
      const data = args[0] as { registerNumber: number };
      dispatch(setRevealedRegister(data.registerNumber));
    });

    // Handle when a player has executed
    game.on("PlayerExecuted", (...args: unknown[]) => {
      const data = args[0] as { username: string };
      dispatch(markPlayerExecuted(data.username));
    });

    // Handle checkpoints
    game.on("CheckpointReached", (...args: unknown[]) => {
      const data = args[0] as CheckpointReachedEvent;
      dispatch(
        updatePlayerCheckpoint({ username: data.username, checkpointNumber: data.checkpointNumber })
      );
    });

    // Handle Game Over event
    game.on("GameCompleted", (...args: unknown[]) => {
      const data = args[0] as GameCompletedBroadcastEvent;

      console.log("Game Completed Event Received:", data);
      dispatch(
        setGameOver({
          winner: data.winner,
          oldRatings: data.oldRatings,
          newRatings: data.newRatings,
        })
      );
    });

    // Cleanup when component unmounts or connection changes
    return () => {
      game.off("GameStateUpdated");
      game.off("RobotMoved");
      game.off("RegisterRevealed");
      game.off("PlayerExecuted");
      game.off("CheckpointReached");
      game.off("GameCompleted");
    };
  }, [game.isConnected, game, dispatch]);
};