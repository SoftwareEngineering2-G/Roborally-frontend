"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { signalRConnection } from "@/lib/signalr/connection";
import { SignalRConnectionState, SignalRConfig } from "@/types/signalr";
import { useSignalRConnection } from "@/hooks/signalr";

interface SignalRProviderProps {
  children: ReactNode;
  config: SignalRConfig;
  autoConnect?: boolean;
}

interface SignalRContextType {
  connectionState: SignalRConnectionState;
  isConnected: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

export function SignalRProvider({
  children,
  config,
  autoConnect = true,
}: SignalRProviderProps) {
  const [initialized, setInitialized] = useState(false);

  // Initialize SignalR connection
  useEffect(() => {
    if (!initialized) {
      signalRConnection.initialize(config);
      setInitialized(true);
    }
  }, [config, initialized]);

  // Get connection state
  const connectionState = useSignalRConnection();

  // Auto-connect if requested
  useEffect(() => {
    if (
      initialized &&
      autoConnect &&
      !connectionState.isConnected &&
      !connectionState.isConnecting
    ) {
      connectionState.connect().catch((error) => {
        console.error("Auto-connect failed:", error);
      });
    }
  }, [initialized, autoConnect, connectionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      signalRConnection.cleanup();
    };
  }, []);

  const contextValue: SignalRContextType = {
    connectionState: connectionState.connectionState,
    isConnected: connectionState.isConnected,
    error: connectionState.error,
    connect: connectionState.connect,
    disconnect: connectionState.disconnect,
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalRContext(): SignalRContextType {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
}
