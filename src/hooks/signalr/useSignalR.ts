"use client";

import { useEffect, useRef, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export const useSignalR = (url: string) => {
  const hubUrl = url;
  const autoConnect = true;
  const reconnectOnClose = true;
  const connectionRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize connection
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    // Setup connection event handlers
    connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      setIsConnected(false);
      setIsConnecting(false);
      if (error) {
        setError(error.message || "Connection closed with error");
      }
    });

    connection.onreconnecting(() => {
      console.log("SignalR reconnecting...");
      setIsConnecting(true);
      setError(null);
    });

    connection.onreconnected(() => {
      console.log("SignalR reconnected");
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    // Auto connect if enabled
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (connection.state !== "Disconnected") {
        connection.stop().catch(console.error);
      }
    };
  }, [hubUrl]);

  const connect = async () => {
    if (!connectionRef.current || connectionRef.current.state === "Connected") {
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      await connectionRef.current.start();
      setIsConnected(true);
      setIsConnecting(false);
      console.log("SignalR connected successfully");
    } catch (err) {
      setIsConnecting(false);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect";
      setError(errorMessage);
      console.error("SignalR connection failed:", err);
    }
  };

  const disconnect = async () => {
    if (connectionRef.current && connectionRef.current.state === "Connected") {
      try {
        await connectionRef.current.stop();
        setIsConnected(false);
        setError(null);
      } catch (err) {
        console.error("Failed to disconnect:", err);
      }
    }
  };

  // Method to listen to events
  const on = (eventName: string, handler: (...args: any[]) => void) => {
    if (connectionRef.current) {
      connectionRef.current.on(eventName, handler);
    }
  };

  // Method to remove event listeners
  const off = (eventName: string, handler?: (...args: any[]) => void) => {
    if (connectionRef.current) {
      if (handler) {
        connectionRef.current.off(eventName, handler);
      } else {
        connectionRef.current.off(eventName);
      }
    }
  };

  // Method to send messages to the hub
  const send = async (methodName: string, ...args: any[]) => {
    if (connectionRef.current && connectionRef.current.state === "Connected") {
      try {
        return await connectionRef.current.invoke(methodName, ...args);
      } catch (err) {
        console.error(`Failed to send ${methodName}:`, err);
        throw err;
      }
    } else {
      throw new Error("SignalR connection is not established");
    }
  };

  // Method to join a group (common SignalR pattern)
  const joinGroup = async (groupName: string) => {
    return send("JoinGroup", groupName);
  };

  // Method to leave a group
  const leaveGroup = async (groupName: string) => {
    return send("LeaveGroup", groupName);
  };

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,

    // Connection methods
    connect,
    disconnect,

    // Event methods
    on,
    off,

    // Send methods
    send,
    joinGroup,
    leaveGroup,

    // Utility
    clearError: () => setError(null),
    connection: connectionRef.current,
  };
};
