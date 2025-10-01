"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardProgramming } from "./CardProgramming";
import { GameHostControls } from "./GameHostControls";
import { useGetCurrentGameStateQuery } from "@/redux/api/game/gameApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setGameState, setGameLoading, setGameError } from "@/redux/game/gameSlice";

interface Props {
  gameId: string;
  isHost: boolean;
}

export default function Game({ gameId, isHost }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string | null>(null);

  // Get game state from Redux
  const { currentGame, isLoading: gameStateLoading, error: gameStateError } = useAppSelector(state => state.game);

  // Fetch game state from API and save to Redux
  const { 
    data: apiGameState, 
    error: apiError, 
    isLoading: isApiLoading 
  } = useGetCurrentGameStateQuery({ gameId });

  // Handle API response and save to Redux
  useEffect(() => {
    if (isApiLoading) {
      dispatch(setGameLoading(true));
    } else if (apiError) {
      dispatch(setGameError(apiError instanceof Error ? apiError.message : "Failed to load game state"));
    } else if (apiGameState) {
      dispatch(setGameState(apiGameState));
    }
  }, [apiGameState, apiError, isApiLoading, dispatch]);

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  console.log("Is host:", isHost);
  
  // Don't render until we have username and game state
  if (!username || gameStateLoading) {
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
  if (gameStateError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load game state</div>
          <p className="text-muted-foreground">
            {typeof gameStateError === 'string' ? gameStateError : "Unknown error occurred"}
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
  if (!currentGame) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading game state...</p>
        </div>
      </div>
    );
  }

  console.log("Game state loaded from Redux:", currentGame);
  
  return (
    <CardProgramming 
      gameId={gameId}
      username={username}
      gameState={currentGame}
      hostControls={isHost ? <GameHostControls gameId={gameId} gameState={currentGame} /> : undefined}
    />
  );
}
