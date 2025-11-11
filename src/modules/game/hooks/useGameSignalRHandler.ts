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
} from "@/redux/game/gameSlice";

export const useGameSignalRHandler = () => {
const { game } = useSignalRContext(); // Connect to the /game hub
const dispatch = useDispatch();

useEffect(() => {
    if (!game.isConnected) return;

    // 🟢 Handle updated game state from backend
    game.on("GameStateUpdated", (state) => {
      dispatch(setGameState(state));
    });

    // 🟢 Handle robot movement
    game.on("RobotMoved", (data: { username: string; positionX: number; positionY: number; direction: string }) => {
      dispatch(updateRobotPosition(data));
    });

    // 🟢 Handle revealed register updates
    game.on("RegisterRevealed", (data: { registerNumber: number }) => {
      dispatch(setRevealedRegister(data.registerNumber));
    });

    // 🟢 Handle when a player has executed
    game.on("PlayerExecuted", (data: { username: string }) => {
      dispatch(markPlayerExecuted(data.username));
    });

    // 🏁 Handle Game Over event
    game.on("GameOver", (data: { winner: string }) => {
      dispatch(setGameOver({ winner: data.winner }));
    });

    // Cleanup when component unmounts or connection changes
    return () => {
      game.off("GameStateUpdated");
      game.off("RobotMoved");
      game.off("RegisterRevealed");
      game.off("PlayerExecuted");
      game.off("GameOver");
    };
  }, [game.isConnected]);
};