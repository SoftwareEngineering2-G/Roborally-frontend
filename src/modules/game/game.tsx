"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameState } from "./hooks/useGameState";
import { useGameSignalR } from "./ProgrammingPhase/hooks/useGameSignalR";
import type { ActivationPhaseStartedEvent } from "@/types/signalr";

// Phase components
import { ProgrammingPhase } from "./ProgrammingPhase";
import { ActivationPhase } from "./ActivationPhase";

interface Props {
  gameId: string;
}

export default function Game({ gameId }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const { gameState, isLoading, error } = useGameState(gameId);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  // Setup SignalR connection for the host to listen to game events
  const signalR = useGameSignalR(gameId, username || "");

  // Listen for activation phase started event - simple refresh hack to sync all player cards
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handleActivationPhaseStarted = (...args: unknown[]) => {
      const data = args[0] as ActivationPhaseStartedEvent;
      if (data.gameId === gameId) {
        window.location.reload();
      }
    };

    signalR.on("ActivationPhaseStarted", handleActivationPhaseStarted);

    return () => {
      signalR.off("ActivationPhaseStarted");
    };
  }, [signalR.isConnected, gameId, signalR]);

  // Don't render until we have username and game state
  if (!username || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {!username ? "Loading game..." : "Loading game state..."}
          </p>
        </div>
      </div>
    );
  }

  // Handle game state error
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load game state</div>
          <p className="text-muted-foreground">
            {typeof error === "string" ? error : "Unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if we don't have game state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading game state...</p>
        </div>
      </div>
    );
  }

  // Render appropriate phase based on game state
  const renderPhase = () => {
    switch (gameState.currentPhase) {
      case "ProgrammingPhase":
        return (
          <ProgrammingPhase
            gameId={gameId}
            username={username}
            gameBoard={gameState.gameBoard}
          />
        );
      case "ActivationPhase":
        return (
          <ActivationPhase
            gameId={gameId}
            username={username}
            gameBoard={gameState.gameBoard}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">Unknown game phase</div>
              <p className="text-muted-foreground">
                Phase: {gameState.currentPhase}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Phase-specific content - Each phase now handles its own host controls */}
      {renderPhase()}
    </div>
  );
}
