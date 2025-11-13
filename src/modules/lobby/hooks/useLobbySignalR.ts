"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSignalRContext } from "@/providers/SignalRProvider";
import { userJoinedLobby, userLeftLobby, hostChanged } from "@/redux/lobby/lobbySlice";
import type { AppDispatch } from "@/redux/store";

export const useLobbySignalR = (gameId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lobby: signalR } = useSignalRContext();

  // Join lobby automatically
  useEffect(() => {
    if (signalR.isConnected && gameId) {
      signalR.send("JoinLobby", gameId).catch(() => {
        toast.error("Failed to join lobby");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalR.isConnected, gameId]);

  // Setup event listeners
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handleUserJoined = (...args: unknown[]) => {
      const data = args[0] as { username: string };
      dispatch(userJoinedLobby({ username: data.username }));
    };

    const handleUserLeft = (...args: unknown[]) => {
      const data = args[0] as { username: string };
      dispatch(userLeftLobby({ username: data.username }));
    };

    const handleHostChanged = (...args: unknown[]) => {
      const data = args[0] as { newHost: string };
      console.log("🔄 Host changed to:", data.newHost);
      dispatch(hostChanged({ newHost: data.newHost }));
      toast.success(`${data.newHost} is now the host`);
    };

    const handleGameStarted = () => {};

    signalR.on("UserJoinedLobby", handleUserJoined);
    signalR.on("UserLeftLobby", handleUserLeft);
    signalR.on("HostChanged", handleHostChanged);
    signalR.on("GameStarted", handleGameStarted);

    return () => {
      signalR.off("UserJoinedLobby");
      signalR.off("UserLeftLobby");
      signalR.off("HostChanged");
      signalR.off("GameStarted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalR.isConnected, dispatch]);

  // Leave lobby on unmount
  useEffect(() => {
    return () => {
      if (gameId && signalR.isConnected) {
        signalR.send("LeaveLobby", gameId).catch((err) => {
          console.error("Failed to leave lobby:", err);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalR.isConnected, gameId]);

  return {
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    error: signalR.error,
    on: signalR.on,
    off: signalR.off,
  };
};
