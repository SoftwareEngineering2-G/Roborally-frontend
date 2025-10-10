"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameState } from "./hooks/useGameState";
import { useGameSignalR } from "./ProgrammingPhase/hooks/useGameSignalR";
import { useGetCurrentGameStateQuery } from "@/redux/api/game/gameApi";
import type { ActivationPhaseStartedEvent } from "@/types/signalr";

// Phase components
import { ProgrammingPhase } from "./ProgrammingPhase";
import { ActivationPhase } from "./ActivationPhase";

// Shared components
import { GameHostControls } from "./components/GameHostControls";

interface Props {
  gameId: string;
}

export default function Game({ gameId }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [cardsDealt, setCardsDealt] = useState(false);

  // Use the new unified game state hook
  const { gameState, isLoading, error } = useGameState(gameId);

  // Get refetch function to manually refresh game state
  const { refetch: refetchGameState } = useGetCurrentGameStateQuery({ gameId });

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  // Determine if current user is the host
  const isHost = gameState?.hostUsername === username;

  // Setup SignalR connection for the host to listen to game events
  const signalR = useGameSignalR(gameId, username || "");

  // Listen for card dealing events to sync the cardsDealt state
  useEffect(() => {
    if (!signalR.isConnected || !isHost) return;

    const handlePlayerCardsDealt = (...args: unknown[]) => {
      const data = args[0] as { gameId: string };
      console.log("Host: Cards dealt event received:", data);
      if (data.gameId === gameId) {
        setCardsDealt(true);
      }
    };

    signalR.on("PlayerCardsDealt", handlePlayerCardsDealt);

    return () => {
      signalR.off("PlayerCardsDealt");
    };
  }, [signalR.isConnected, isHost, gameId, signalR]);

  // Listen for activation phase started event to refetch game state for all players
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handleActivationPhaseStarted = (...args: unknown[]) => {
      const data = args[0] as ActivationPhaseStartedEvent;
      console.log("Activation phase started event received:", data);
      if (data.gameId === gameId) {
        // Refetch game state to get updated currentPhase
        refetchGameState();
      }
    };

    signalR.on("ActivationPhaseStarted", handleActivationPhaseStarted);

    return () => {
      signalR.off("ActivationPhaseStarted");
    };
  }, [signalR.isConnected, gameId, signalR, refetchGameState]);

  console.log("Game state:", gameState);
  console.log("Current username:", username);
  console.log("Host username:", gameState?.hostUsername);
  console.log("Is host:", isHost);
  
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
            {typeof error === 'string' ? error : "Unknown error occurred"}
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
            gameBoard={gameState?.gameBoard}
          />
        );
      case "ActivationPhase":
        return <ActivationPhase
            gameId={gameId}
            username={username}
            gameBoard={gameState?.gameBoard}
        />;
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
      {/* Host Controls - Always visible to host regardless of phase */}
      {isHost && (
        <div className="fixed top-4 right-4" style={{ zIndex: 10000 }}>
          <GameHostControls 
            gameId={gameId} 
            gameState={gameState} 
            cardsDealt={cardsDealt}
            onCardsDealt={() => setCardsDealt(true)}
          />
        </div>
      )}
      
      {/* Phase-specific content */}
      {renderPhase()}
    </div>
  );
}
