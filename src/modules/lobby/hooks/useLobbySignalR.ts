"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSignalRContext } from "@/providers/SignalRProvider";
import { userJoinedLobby, userLeftLobby, hostChanged } from "@/redux/lobby/lobbySlice";
import type { AppDispatch } from "@/redux/store";

/**
 * @author Sachin Baral 2025-09-30 17:34:55 +0200 10
 */
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

    /**
     * @author Sachin Baral 2025-10-01 21:43:01 +0200 28
     */
    const handleUserJoined = (...args: unknown[]) => {
      const data = args[0] as { username: string };
      dispatch(userJoinedLobby({ username: data.username }));
    };

    /**
     * @author Sachin Baral 2025-10-01 21:43:01 +0200 33
     */
    const handleUserLeft = (...args: unknown[]) => {
      const data = args[0] as { username: string };
      dispatch(userLeftLobby({ username: data.username }));
    };

    /**
     * @author Vincenzo Altaserse 2025-10-18 15:03:53 +0200 38
     */
    const handleHostChanged = (...args: unknown[]) => {
      const data = args[0] as { newHost: string };
      dispatch(hostChanged({ newHost: data.newHost }));
      toast.success(`${data.newHost} is now the host`);
    };

    /**
     * @author Truong Son NGO 2025-11-12 15:33:18 +0100 44
     */
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
