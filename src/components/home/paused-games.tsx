"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPausedGamesQuery } from "@/redux/api/game/gameApi";
import { useJoinContinueGameLobbyMutation } from "@/redux/api/lobby/lobbyApi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showSuccessToast, showErrorToast } from "@/lib/toast-handler";
import { Users, PlayCircle, RefreshCw, Pause, Crown } from "lucide-react";
import type { AppError } from "@/types/AppError";
import type { GetPausedGameResponse } from "@/redux/api/game/types";
import PublicLobbiesSkeleton from "../lobby/public-lobbies-skeleton";
import PublicLobbiesError from "../lobby/public-lobbies-error";

interface Props {
  username: string;
}

export default function PausedGames({ username }: Props) {
  const router = useRouter();

  const {
    data: pausedGames = [],
    isLoading,
    error,
    refetch,
  } = useGetPausedGamesQuery({ username });

  const [joinContinueLobby, { isLoading: joining }] = useJoinContinueGameLobbyMutation();

  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);

  const handleContinueGame = async (game: GetPausedGameResponse) => {
    if (joining) return;

    setJoiningGameId(game.gameId);
    try {
      await joinContinueLobby({
        gameId: game.gameId,
        username,
      }).unwrap();

      showSuccessToast("Resuming game!", `Returning to ${game.gameRoomName}`);
      router.push(`/lobby/${game.gameId}`);
    } catch (err) {
      console.error("Error continuing game:", err);
      const errorMessage =
        (err as { data: AppError })?.data.title || "Failed to resume game. Please try again.";
      showErrorToast("Failed to continue game", errorMessage);
    } finally {
      setJoiningGameId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <PublicLobbiesSkeleton title="Paused Games" description="Resume your interrupted battles" />
    );
  }

  if (error) {
    return (
      <PublicLobbiesError
        title="Paused Games"
        description="Resume your interrupted battles"
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between paused-games-header">
          <div>
            <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
              <Pause className="w-5 h-5" />
              Paused Games
            </CardTitle>
            <CardDescription>Resume your interrupted battles</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-chrome-light hover:text-neon-teal"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pausedGames.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Pause className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No paused games found</p>
              <p className="text-sm text-muted-foreground mt-1">
                All your battles are either ongoing or completed
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {pausedGames.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4 border border-neon-teal/20 hover:border-neon-teal/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Game Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-foreground truncate">{game.gameRoomName}</h3>
                        {game.hostUsername === username && (
                          <Badge
                            variant="secondary"
                            className="bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30 text-xs"
                          >
                            <Crown className="w-3 h-3 mr-1" />
                            Host
                          </Badge>
                        )}
                      </div>

                      {/* Players */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{game.playerUsernames.length} pilots</span>
                        <span className="text-chrome/50">•</span>
                        <span className="text-xs truncate">{game.playerUsernames.join(", ")}</span>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <Button
                      onClick={() => handleContinueGame(game)}
                      disabled={joining && joiningGameId === game.gameId}
                      className="bg-neon-teal/20 hover:bg-neon-teal/40 text-neon-teal border border-neon-teal/30 shrink-0"
                    >
                      {joining && joiningGameId === game.gameId ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
