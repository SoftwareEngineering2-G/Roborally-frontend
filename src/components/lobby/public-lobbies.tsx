"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  useGetPublicLobbiesQuery,
  useJoinLobbyMutation,
} from "@/redux/api/lobby/lobbyApi";
import { useAppDispatch } from "@/redux/hooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/lib/toast-handler";
import { Users, Gamepad2, Clock, RefreshCw } from "lucide-react";
import type { AppError } from "@/types/AppError";
import { Lobby } from "@/redux/api/lobby/types";
import PublicLobbiesSkeleton from "./public-lobbies-skeleton";
import PublicLobbiesError from "./public-lobbies-error";

interface Props {
  username: string;
}

export default function PublicLobbies({ username }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    data: publicLobbies = [],
    isLoading,
    error,
    refetch,
  } = useGetPublicLobbiesQuery();

  const [joinLobby, { isLoading: joining, isSuccess: joinSuccess, data }] =
    useJoinLobbyMutation();
  const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);
  const [successfulLobby, setSuccessfulLobby] = useState<Lobby | null>(null);

  // Handle successful join
  useEffect(() => {
    if (joinSuccess && successfulLobby) {
      showSuccessToast(
        "Joined lobby!",
        `Welcome to ${successfulLobby.gameRoomName}`
      );
      router.push(`/game/${successfulLobby.gameId}`);
      setSuccessfulLobby(null);
    }
  }, [joinSuccess, successfulLobby, router]);

  const handleJoinLobby = async (lobby: Lobby) => {
    if (joining || lobby.currentAmountOfPlayers >= 6) return;

    setJoiningLobbyId(lobby.gameId);
    try {
      await joinLobby({
        gameId: lobby.gameId,
        username,
      });

      // Store the lobby info for the success useEffect
      setSuccessfulLobby(lobby);
    } catch (err) {
      console.error("Error joining lobby:", err);
      const errorMessage =
        (err as { data: AppError })?.data.title ||
        "Room might be full or no longer available";
      showErrorToast("Failed to join lobby", errorMessage);
    } finally {
      setJoiningLobbyId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <PublicLobbiesSkeleton />;
  }

  if (error) {
    return <PublicLobbiesError onRetry={handleRefresh} />;
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Public Lobbies
            </CardTitle>
            <CardDescription>Join an existing game</CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="text-neon-teal hover:bg-neon-teal/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!publicLobbies?.length ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              No public lobbies available
            </p>
            <p className="text-sm text-muted-foreground">
              Create a room or check back later!
            </p>
          </div>
        ) : (
          publicLobbies.map((lobby, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="p-4 border border-neon-teal/20 rounded-lg bg-surface-dark/30 hover:border-neon-teal/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {lobby.gameRoomName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{lobby.currentAmountOfPlayers}/6 players</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleJoinLobby(lobby)}
                  disabled={
                    joining ||
                    joiningLobbyId === lobby.gameId ||
                    lobby.currentAmountOfPlayers >= 6
                  }
                  className="bg-gradient-primary"
                  size="sm"
                >
                  {joiningLobbyId === lobby.gameId ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : lobby.currentAmountOfPlayers >= 6 ? (
                    "Full"
                  ) : (
                    "Join"
                  )}
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
