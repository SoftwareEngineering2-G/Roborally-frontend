"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    useGetPublicLobbiesQuery,
    useJoinLobbyMutation,
    type Room,
} from "@/redux/api/lobby/lobbyApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCurrentRoom } from "@/redux/game/gameSlice";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { showSuccessToast, showErrorToast } from "@/lib/toast-handler";
import { Users, Gamepad2, Clock, RefreshCw } from "lucide-react";
import type { AppError } from "@/types/AppError";

interface PublicLobbiesProps {
    userId: string;
}

export default function PublicLobbies({ userId }: PublicLobbiesProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        data: { publicLobbies = [] } = {},
        isLoading,
        error,
        refetch,
    } = useGetPublicLobbiesQuery();

    const [joinLobby, { isLoading: joining }] = useJoinLobbyMutation();
    const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);

    const handleJoinLobby = async (lobby: Room) => {
        if (joining || lobby.joinedUsers.length >= lobby.maxPlayers) return;

        setJoiningLobbyId(lobby.gameId);
        try {
            const { gameLobby } = await joinLobby({
                lobbyId: lobby.gameId,
                userId,
            }).unwrap();

            dispatch(setCurrentRoom(gameLobby));
            showSuccessToast("Joined lobby!", `Welcome to ${gameLobby.gameRoomName}`);
            router.push(`/room/${gameLobby.gameId}`);
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
        return (
            <Card className="glass-panel">
                <CardHeader>
                    <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5" />
                        Public Lobbies
                    </CardTitle>
                    <CardDescription>Join an existing game</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div
                            key={`skeleton-${Date.now()}-${i}`}
                            className="p-4 border border-neon-teal/20 rounded-lg bg-surface-dark/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-32 bg-muted/20" />
                                    <Skeleton className="h-4 w-20 bg-muted/20" />
                                </div>
                                <Skeleton className="h-9 w-16 bg-muted/20" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="glass-panel">
                <CardHeader>
                    <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5" />
                        Public Lobbies
                    </CardTitle>
                    <CardDescription>Join an existing game</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Failed to load lobbies</p>
                        <Button onClick={handleRefresh} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
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
                        <p className="text-muted-foreground mb-2">No public lobbies available</p>
                        <p className="text-sm text-muted-foreground">
                            Create a room or check back later!
                        </p>
                    </div>
                ) : (
                    publicLobbies.map((lobby, index) => (
                        <motion.div
                            key={lobby.gameId}
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
                                        {lobby.gameStarted && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30"
                                            >
                                                In Progress
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {lobby.joinedUsers.length}/{lobby.maxPlayers}{" "}
                                                players
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleJoinLobby(lobby)}
                                    disabled={
                                        joining ||
                                        joiningLobbyId === lobby.gameId ||
                                        lobby.joinedUsers.length >= lobby.maxPlayers ||
                                        lobby.gameStarted
                                    }
                                    className="bg-gradient-primary"
                                    size="sm"
                                >
                                    {joiningLobbyId === lobby.gameId ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Joining...
                                        </>
                                    ) : lobby.joinedUsers.length >= lobby.maxPlayers ? (
                                        "Full"
                                    ) : lobby.gameStarted ? (
                                        "Started"
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
