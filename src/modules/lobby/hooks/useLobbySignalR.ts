"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSignalRContext } from "@/providers/SignalRProvider";
import { userJoinedLobby, userLeftLobby } from "@/redux/lobby/lobbySlice";
import { AppDispatch } from "@/redux/store";

export const useLobbySignalR = (gameId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lobby: signalR } = useSignalRContext();

  // Join lobby when connected
  useEffect(() => {
    if (signalR.isConnected && gameId) {
      console.log(`Joining lobby: ${gameId}`);
      signalR.send("JoinLobby", gameId).catch((err) => {
        console.error("Failed to join lobby:", err);
        toast.error("Failed to join lobby");
      });
    }
  }, [signalR.isConnected, gameId, signalR.send]);

  // Setup event listeners
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handleUserJoined = (data: any) => {
      dispatch(userJoinedLobby({ username: data.username }));
      toast.success(`${data.username} joined the lobby`);
    };

    const handleUserLeft = (data: any) => {
      dispatch(userLeftLobby({ username: data.username }));
      toast.info(`${data.username} left the lobby`);
    };

    const handleGameStarted = () => {
      toast.success("Game is starting!");
    };

    signalR.on("UserJoinedLobby", handleUserJoined);
    signalR.on("UserLeftLobby", handleUserLeft);
    signalR.on("GameStarted", handleGameStarted);

    return () => {
      signalR.off("UserJoinedLobby");
      signalR.off("UserLeftLobby");
      signalR.off("GameStarted");
    };
  }, [signalR.isConnected, dispatch, signalR.on, signalR.off]);

  // Leave lobby on unmount
  useEffect(() => {
    return () => {
      if (gameId && signalR.isConnected) {
        console.log(`Leaving lobby: ${gameId}`);
        signalR.send("LeaveLobby", gameId).catch((err) => {
          console.error("Failed to leave lobby:", err);
        });
      }
    };
  }, [gameId, signalR.isConnected, signalR.send]);

  return {
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    error: signalR.error,
    on: signalR.on,
    off: signalR.off,
  };
};
