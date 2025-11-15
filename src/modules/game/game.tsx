"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameState } from "./hooks/useGameState";
import { useGameSignalR } from "./ProgrammingPhase/hooks/useGameSignalR";
import { useGameSignalRHandler } from "./hooks/useGameSignalRHandler";
import { useGamePause } from "./hooks/useGamePause";
import type { ActivationPhaseStartedEvent } from "@/types/signalr";

// Phase components
import { ProgrammingPhase } from "./ProgrammingPhase";
import { ActivationPhase } from "./ActivationPhase";

// Shared components
// import { GameHostControls } from "./components/GameHostControls";
import { GamePauseButton } from "./components/GamePauseButton";
import { GamePauseDialog } from "./components/GamePauseDialog";
import { GamePauseResultDialog } from "./components/GamePauseResultDialog";
import GameOverModal from "./components/GameOverModal";

interface Props {
  gameId: string;
}

export default function Game({ gameId }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  const { gameState, isLoading, error } = useGameState(gameId, username);

  // Setup SignalR connection for the host to listen to game events
  const signalR = useGameSignalR(gameId, username || "");

  // Listen for all backend game events (GameOver, PlayerMoved, etc.)
  useGameSignalRHandler();

  // Setup game pause functionality
  const {
    handleRequestPause,
    handleRespondToPause,
    handleContinue,
    showRequestDialog,
    setShowRequestDialog,
    showResultDialog,
    pauseResult,
    pauseRequest,
    isRequester,
    totalPlayers,
    isRequestingPause,
    isResponding,
  } = useGamePause({ gameId, username: username || "" });

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
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
            type="button"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading game state...</p>
        </div>
      </div>
    );
  }

  // Prepare pause button component
  const pauseButton = gameState?.isPrivate ? (
    <GamePauseButton
      onRequestPause={handleRequestPause}
      disabled={pauseRequest?.isActive}
      isLoading={isRequestingPause}
    />
  ) : null;

  // Render appropriate phase based on game state
  const renderPhase = () => {
    switch (gameState.currentPhase) {
      case "ProgrammingPhase":
        return (
          <ProgrammingPhase
            gameId={gameId}
            username={username}
            gameBoard={gameState.gameBoard}
            pauseButton={pauseButton}
          />
        );
      case "ActivationPhase":
        return (
          <ActivationPhase
            gameId={gameId}
            username={username}
            gameBoard={gameState.gameBoard}
            pauseButton={pauseButton}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">Unknown game phase</div>
              <p className="text-muted-foreground">Phase: {gameState.currentPhase}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Game Over Modal */}
      <GameOverModal myUsername={username} />

      {/* Pause Request Dialog */}
      {pauseRequest && (
        <GamePauseDialog
          open={showRequestDialog}
          onOpenChange={setShowRequestDialog}
          isRequester={isRequester}
          requesterUsername={pauseRequest.requester || ""}
          onRespond={handleRespondToPause}
          responses={pauseRequest.responses}
          totalPlayers={totalPlayers}
          isLoading={isResponding}
        />
      )}

      {/* Pause Result Dialog */}
      {pauseResult && (
        <GamePauseResultDialog
          open={showResultDialog}
          onOpenChange={() => {}}
          result={pauseResult.result}
          requestedBy={pauseResult.requestedBy}
          playerResponses={pauseResult.playerResponses}
          onContinue={handleContinue}
        />
      )}

      {/* Phase-specific content - Each phase now handles its own host controls */}
      {renderPhase()}
    </div>
  );
}
