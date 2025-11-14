"use client";

import React, { createContext, useContext } from "react";
import { useSignalR } from "@/hooks/signalr/useSignalR";

interface SignalRConnection {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  send: (methodName: string, ...args: unknown[]) => Promise<unknown>;
  on: (eventName: string, handler: (...args: unknown[]) => void) => void;
  off: (eventName: string) => void;
}

interface SignalRContextType {
  lobby: SignalRConnection;
  game: SignalRConnection;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within SignalRProvider");
  }
  return context;
};

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize both connections at top level
  const lobbySignalR = useSignalR("/game-lobbies");
  const gameSignalR = useSignalR("/game");

  const value: SignalRContextType = {
    lobby: {
      isConnected: lobbySignalR.isConnected,
      isConnecting: lobbySignalR.isConnecting,
      error: lobbySignalR.error,
      send: lobbySignalR.send,
      on: lobbySignalR.on,
      off: lobbySignalR.off,
    },
    game: {
      isConnected: gameSignalR.isConnected,
      isConnecting: gameSignalR.isConnecting,
      error: gameSignalR.error,
      send: gameSignalR.send,
      on: gameSignalR.on,
      off: gameSignalR.off,
    },
  };

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
};
