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
          <CardTitle className="text-xl">Game Controls</CardTitle>
          <CardDescription>
            {isHost ? "Host controls" : "Player status"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Button
                onClick={onStartGame}
                disabled={!canStart}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>

              {!allPlayersReady && players.length >= 2 && (
                <p className="text-sm text-muted-foreground">
                  Waiting for all players to be ready
                </p>
              )}

              {players.length < 2 && (
                <p className="text-sm text-muted-foreground">
                  Need at least 2 players to start
                </p>
              )}
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
