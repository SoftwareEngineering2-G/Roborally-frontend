"use client";

import { useEffect, useRef, useState } from "react";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

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
    
    console.log(`Initializing SignalR connection to: ${url}`);
    
    // Create connection
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100";
    const fullHubUrl = `${backendBaseUrl}${url}`;
    
    console.log(`Full SignalR URL: ${fullHubUrl}`);
    
    const connection = new HubConnectionBuilder()
      .withUrl(fullHubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    // Simple event handlers
    connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      setIsConnected(false);
      setIsConnecting(false);
      if (error) {
        setError(error.message);
      }
    });

    connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
      setIsConnecting(true);
      setIsConnected(false);
    });

    connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    // Start connection
    const startConnection = async () => {
      try {
        console.log("Starting SignalR connection...");
        setIsConnecting(true);
        setError(null);
        
        await connection.start();
        
        console.log("SignalR connected successfully!");
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
      console.log("Cleaning up SignalR connection...");
      
      if (connection && connection.state !== "Disconnected") {
        connection.stop().catch((err) => {
          console.error("Error stopping SignalR:", err);
        });
      }
      
      connectionRef.current = null;
    };
  }, [url]);

  // Event listener
  const on = (eventName: string, handler: (...args: any[]) => void) => {
    connectionRef.current?.on(eventName, handler);
  };

  // Remove event listener  
  const off = (eventName: string) => {
    connectionRef.current?.off(eventName);
  };

  // Send message
  const send = async (methodName: string, ...args: any[]) => {
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
