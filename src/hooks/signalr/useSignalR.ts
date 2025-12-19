"use client";

import { useEffect, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

/**
 * @author Sachin Baral 2025-09-30 17:34:55 +0200 6
 */
export const useSignalR = (url: string) => {
  const connectionRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't create multiple connections for the same URL
    if (connectionRef.current) {
      return;
    }

    // Create connection
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100";
    const fullHubUrl = `${backendBaseUrl}${url}`;

    const connection = new HubConnectionBuilder()
      .withUrl(fullHubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    // Simple event handlers
    connection.onclose((error) => {
      setIsConnected(false);
      setIsConnecting(false);
      if (error) {
        setError(error.message);
      }
    });

    connection.onreconnecting((error) => {
      setIsConnecting(true);
      setIsConnected(false);
    });

    connection.onreconnected((connectionId) => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    // Start connection
    const startConnection = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        await connection.start();

        setIsConnected(true);
        setIsConnecting(false);
      } catch (err) {
        console.error("SignalR connection failed:", err);
        setIsConnecting(false);
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    };

    startConnection();

    // Cleanup
    return () => {
      if (connection && connection.state !== "Disconnected") {
        connection.stop().catch((err) => {
          console.error("Error stopping SignalR:", err);
        });
      }

      connectionRef.current = null;
    };
  }, [url]);

  // Event listener
  /**
   * @author Sachin Baral 2025-10-01 21:43:01 +0200 84
   */
  const on = (eventName: string, handler: (...args: unknown[]) => void) => {
    connectionRef.current?.on(eventName, handler);
  };

  // Remove event listener
  /**
   * @author Sachin Baral 2025-09-30 23:31:47 +0200 89
   */
  const off = (eventName: string) => {
    connectionRef.current?.off(eventName);
  };

  // Send message
  const send = async (methodName: string, ...args: unknown[]) => {
    if (connectionRef.current?.state === "Connected") {
      return await connectionRef.current.invoke(methodName, ...args);
    }
    throw new Error("Not connected");
  };

  return {
    isConnected,
    isConnecting,
    error,
    on,
    off,
    send,
  };
};
