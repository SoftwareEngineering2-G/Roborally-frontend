"use client";

import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSignalR } from "./useSignalR";
import {
  UserJoinedLobbyEvent,
  UserLeftLobbyEvent,
  GameStartedEvent,
} from "@/types/signalr";
import { userJoinedLobby, userLeftLobby } from "@/redux/lobby/lobbySlice";
import { AppDispatch } from "@/redux/store";

export const useLobbySignalR = (gameId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const hubUrl = "/lobbyHub";
  const autoJoinLobby = true;

  // Use the simple SignalR hook
  const signalR = useSignalR(hubUrl);

  // Join lobby when connected and gameId is available
  useEffect(() => {
    if (signalR.isConnected && gameId && autoJoinLobby) {
      console.log(`Joining lobby: ${gameId}`);
      signalR.joinGroup(gameId).catch((err) => {
        console.error("Failed to join lobby:", err);
      });

      // Leave lobby on cleanup
      return () => {
        if (gameId) {
          signalR.leaveGroup(gameId).catch((err) => {
            console.error("Failed to leave lobby:", err);
          });
        }
      };
    }
  }, [signalR.isConnected, gameId, autoJoinLobby]);

  // Setup event listeners with Redux integration
  useEffect(() => {
    if (!signalR.isConnected) return;

    signalR.on("UserJoinedLobby", (data: UserJoinedLobbyEvent) => {
      console.log("User joined:", data);
      dispatch(userJoinedLobby({ username: data.username }));
      toast.success(`${data.username} joined the lobby`);
    });

    signalR.on("UserLeftLobby", (data: UserLeftLobbyEvent) => {
      console.log("User left:", data);
      dispatch(userLeftLobby({ username: data.username }));
      toast.info(`${data.username} left the lobby`);
    });

    signalR.on("GameStarted", (data: GameStartedEvent) => {
      console.log("Game started:", data);
      toast.success("Game is starting!");
    });

    // Cleanup all listeners
    return () => {
      signalR.off("UserJoinedLobby");
      signalR.off("UserLeftLobby");
      signalR.off("GameStarted");
    };
  }, [signalR.isConnected, dispatch]);

  // Helper methods for common lobby actions
  const togglePlayerReady = useCallback(
    async (username: string) => {
      if (!gameId || !username) {
        throw new Error("GameId and username are required");
      }
      return signalR.send("TogglePlayerReady", gameId, username);
    },
    [gameId, signalR]
  );

  return {
    // Connection state
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    error: signalR.error,

    // Connection methods
    connect: signalR.connect,
    disconnect: signalR.disconnect,
    clearError: signalR.clearError,

    // Direct access to SignalR methods if needed
    send: signalR.send,
    joinGroup: signalR.joinGroup,
    leaveGroup: signalR.leaveGroup,

    // Raw SignalR instance for custom event handling
    on: signalR.on,
    off: signalR.off,
  };
};
