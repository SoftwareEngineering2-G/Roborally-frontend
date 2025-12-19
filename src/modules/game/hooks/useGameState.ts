"use client";

import { useEffect } from "react";
import { useGetCurrentGameStateQuery } from "@/redux/api/game/gameApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setGameState,
  setGameLoading,
  setGameError,
} from "@/redux/game/gameSlice";

/**
 * Custom hook that manages game state fetching and Redux integration
 * This is the single source of truth for game state management
 */
/**
 * @author Sachin Baral 2025-11-04 21:25:08 +0100 16
 */
export const useGameState = (gameId: string, username: string) => {
  const dispatch = useAppDispatch();

  // Get game state from Redux
  const {
    currentGame,
    isLoading: gameStateLoading,
    error: gameStateError,
  } = useAppSelector((state) => state.game);

  // Fetch game state from API - includes username for personalized state
  const {
    data: apiGameState,
    error: apiError,
    isLoading: isApiLoading,
  } = useGetCurrentGameStateQuery(
    { gameId, username },
    {
      skip: !username, // Skip query if username is not available yet
    }
  );

  // Handle API response and save to Redux
  useEffect(() => {
    if (isApiLoading) {
      dispatch(setGameLoading(true));
    } else if (apiError) {
      dispatch(
        setGameError(
          apiError instanceof Error
            ? apiError.message
            : "Failed to load game state"
        )
      );
    } else if (apiGameState) {
      dispatch(setGameState(apiGameState));
    }
  }, [apiGameState, apiError, isApiLoading, dispatch]);

  return {
    gameState: currentGame,
    isLoading: gameStateLoading,
    error: gameStateError,
  };
};