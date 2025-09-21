"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Users, Check, X } from "lucide-react";

interface Player {
  id: string;
  username: string;
  isReady: boolean;
}

interface PlayersGridProps {
  players: Player[];
  maxPlayers: number;
  hostUsername: string;
  currentUserId: string;
  currentPlayerReady: boolean;
}

export const PlayersGrid = ({
  players,
  maxPlayers,
  hostUsername,
  currentUserId,
  currentPlayerReady,
}: PlayersGridProps) => {
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
                player.id === currentUserId
                  ? currentPlayerReady
                  : player.isReady;
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    isPlayerReady
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted border-border"
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

            {/* Empty slots */}
            {Array.from({
              length: maxPlayers - players.length,
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50"
              >
                <div className="flex items-center justify-center h-16 text-muted-foreground">
                  <Users className="w-6 h-6 mr-2" />
                  Waiting for player...
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
