"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Users, Check, X } from "lucide-react";

interface Player {
  username: string;
  isReady: boolean;
}

interface PlayersGridProps {
  players: Player[];
  maxPlayers: number;
  hostUsername: string;
  currentPlayerReady: boolean;
  requiredPlayers?: string[] | null;
}

export const PlayersGrid = ({
  players,
  maxPlayers,
  hostUsername,
  currentPlayerReady,
  requiredPlayers = null,
}: PlayersGridProps) => {
  const isPausedGame = requiredPlayers !== null && requiredPlayers.length > 0;
  const currentPlayerUsernames = players.map((p) => p.username);

  // For paused games, show missing required players
  const missingRequiredPlayers = isPausedGame
    ? requiredPlayers.filter((username) => !currentPlayerUsernames.includes(username))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Players in Lobby
          </CardTitle>
          <CardDescription>Waiting for all players to be ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {players.map((player, index) => {
              const isPlayerReady =
                player.username === hostUsername ? currentPlayerReady : player.isReady;
              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    isPlayerReady ? "bg-primary/10 border-primary/30" : "bg-muted border-border"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>🤖</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{player.username}</span>
                        {player.username === hostUsername && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {isPlayerReady ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <X className="w-3 h-3 mr-1" />
                            Not Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty slots - only show if NOT a paused game */}
            {!isPausedGame &&
              Array.from({
                length: maxPlayers - players.length,
              }).map((_, index) => (
                <div
                  key={`empty-slot-${maxPlayers}-${index}`}
                  className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50"
                >
                  <div className="flex items-center justify-center h-16 text-muted-foreground">
                    <Users className="w-6 h-6 mr-2" />
                    Waiting for player...
                  </div>
                </div>
              ))}

            {/* Missing required players - show for paused games */}
            {isPausedGame &&
              missingRequiredPlayers.map((username, index) => (
                <motion.div
                  key={username}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ delay: (players.length + index) * 0.1 }}
                  className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>🤖</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{username}</span>
                        {username === hostUsername && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          Not Joined
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
