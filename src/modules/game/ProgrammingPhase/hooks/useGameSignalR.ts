"use client";

import { useEffect } from "react";
import { useSignalRContext } from "@/providers/SignalRProvider";

export const useGameSignalR = (gameId: string, username: string) => {
  const { game: signalR } = useSignalRContext();

  // Join game when connected
  useEffect(() => {
    if (signalR.isConnected && gameId && username) {
      signalR.send("JoinGame", username, gameId).catch((err) => {
        console.error("Failed to join game:", err);
      });
    }
  }, [signalR.isConnected, gameId, username, signalR]);

  // Leave game on unmount
  useEffect(() => {
    return () => {
      if (gameId && username && signalR.isConnected) {
        signalR.send("LeaveGame", username, gameId).catch((err) => {
          console.error("Failed to leave game:", err);
        });
      }
    };
  }, [gameId, username, signalR]);

  return {
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    error: signalR.error,
    on: signalR.on,
    off: signalR.off,
  };
};