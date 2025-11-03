"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check, X, Play } from "lucide-react";
import { BoardSelector } from "@/components/lobby/BoardSelector";

interface Player {
  username: string;
  isReady: boolean;
}

interface GameControlsProps {
  isHost: boolean;
  currentPlayerReady: boolean;
  players: Player[];
  canStart: boolean;
  allPlayersReady: boolean;
  isPrivate: boolean;
  gameId: string;
  selectedBoard: string;
  onBoardChange: (board: string) => void;
  onToggleReady?: () => void; // Optional since player ready is not supported yet
  onStartGame: () => void;
  onCopyGameId: () => void;
}

export const GameControls = ({
  isHost,
  currentPlayerReady,
  players,
  canStart,
  allPlayersReady,
  isPrivate,
  gameId,
  selectedBoard,
  onBoardChange,
  onToggleReady,
  onStartGame,
  onCopyGameId,
}: GameControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isHost ? "Host Controls" : "Player Status"}
          </CardTitle>
          <CardDescription>
            {isHost ? "Configure and start the game" : "Get ready to play"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isHost && onToggleReady && (
            <Button
              onClick={onToggleReady}
              variant={currentPlayerReady ? "destructive" : "default"}
              className="w-full"
            >
              {currentPlayerReady ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Ready
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Ready Up
                </>
              )}
            </Button>
          )}

          {isHost && (
            <>
              <BoardSelector
                value={selectedBoard}
                onValueChange={onBoardChange}
                disabled={false}
              />

              <div className="pt-2 space-y-3">
                <Button
                  onClick={onStartGame}
                  disabled={!canStart || !selectedBoard}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {selectedBoard ? `Start Game on ${selectedBoard}` : "Select a Board to Start"}
                </Button>

                {!allPlayersReady && players.length >= 2 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                    <span className="text-lg">⏳</span>
                    <span>Waiting for all players to be ready</span>
                  </div>
                )}

                {players.length < 2 && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <span className="text-lg">👥</span>
                    <span>Need at least 2 players to start</span>
                  </div>
                )}
              </div>
            </>
          )}

          {isPrivate && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Lobby Key:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-muted rounded text-primary font-mono text-sm">
                  {gameId}
                </code>
                <Button size="sm" variant="outline" onClick={onCopyGameId}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
