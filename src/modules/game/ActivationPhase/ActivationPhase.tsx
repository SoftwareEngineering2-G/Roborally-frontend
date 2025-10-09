"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { GameBoard } from "../components/GameBoard";
import { PlayerProgramDisplay } from "./PlayerProgramDisplay";
import { useGameSignalR } from "../ProgrammingPhase/hooks/useGameSignalR";
import { setRevealedRegister } from "@/redux/game/gameSlice";
import type { RegisterRevealedEvent } from "@/types/signalr";
import { toast } from "sonner";

interface ActivationPhaseProps {
  gameId: string;
  username: string;
}

export const ActivationPhase = ({ gameId, username }: ActivationPhaseProps) => {
  const dispatch = useAppDispatch();
  
  // Get game state from Redux (programmedCards should be populated from backend or SignalR)
  const { currentGame } = useAppSelector(state => state.game);
  
  // Setup SignalR connection for game events
  const signalR = useGameSignalR(gameId, username);

  // Listen for register revealed events
  useEffect(() => {
    if (!signalR.isConnected) return;

    const handleRegisterRevealed = (...args: unknown[]) => {
      const data = args[0] as RegisterRevealedEvent;
      console.log("Register revealed event:", data);
      
      // Only process if this event is for the current game
      if (data.gameId !== gameId) return;
      
      // Update Redux state with revealed register number
      dispatch(setRevealedRegister(data.registerNumber - 1)); // Backend sends 1-5, we use 0-4
      
      // Show toast notification
      const registerLabel = data.registerNumber === 1 ? "first" : data.registerNumber === 2 ? "second" : data.registerNumber === 3 ? "third" : data.registerNumber === 4 ? "fourth" : "fifth";
      toast.info(`${registerLabel.charAt(0).toUpperCase() + registerLabel.slice(1)} card revealed for all players!`);
    };

    signalR.on("RegisterRevealed", handleRegisterRevealed);

    return () => {
      signalR.off("RegisterRevealed");
    };
  }, [signalR.isConnected, gameId, dispatch, signalR]);

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

  return (
    <motion.div
      key="activation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-full"
    >
      {/* Header */}
      <div className="h-20 border-b border-glass-border bg-surface-dark/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neon-teal">
            Activation Phase
          </h1>
          <p className="text-sm text-muted-foreground">
            Watch robots execute their programs
          </p>
        </div>
      </div>

      {/* Side-by-side layout: Board on left, Players on right */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex">
        {/* Left side - Game Board */}
        <div className="flex-1 flex items-center justify-center p-4">
          <GameBoard className="max-w-2xl w-full" />
        </div>
        
        {/* Right side - Player Programs */}
        <div className="w-96 p-6 bg-surface-dark/30 border-l border-glass-border overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">
              Player Programs ({currentGame.players.length})
            </h3>
            <div className="space-y-3">
              {[...currentGame.players]
                .sort((a, b) => {
                  // Show current player first
                  if (a.username === username) return -1;
                  if (b.username === username) return 1;
                  return 0;
                })
                .map((player) => (
                  <PlayerProgramDisplay
                    key={player.username}
                    player={player}
                    isCurrentPlayer={player.username === username}
                    revealedUpTo={currentGame.currentRevealedRegister ?? -1}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};