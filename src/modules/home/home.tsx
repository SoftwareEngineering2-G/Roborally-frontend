"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCreateLobbyMutation, useJoinPrivateLobbyMutation } from "@/redux/api/lobby/lobbyApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentRoom } from "@/redux/game/gameSlice";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { showSuccessToast, showErrorToast } from "@/lib/toast-handler";
import { Plus, Lock, Key, LogOut } from "lucide-react";
import { PublicLobbies } from "@/components/lobby";

export default function Home() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [createLobby, { isLoading: creating }] = useCreateLobbyMutation();
    const [joinPrivateLobby] = useJoinPrivateLobbyMutation();
    const currentRoom = useAppSelector((s) => s.game.currentRoom);

    // user state (loaded after mount)
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) setUser({ id: username, username });
        else router.push("/signin");
    }, [router]);

    useEffect(() => {
        if (currentRoom?.gameStarted) router.push(`/game/${currentRoom.gameId}`);
    }, [currentRoom, router]);

    // UI state
    const [roomName, setRoomName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [privateKey, setPrivateKey] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(false);

    const handleCreateRoom = async () => {
        if (!user || !roomName.trim()) return;
        try {
            const response = await createLobby({
                hostUsername: user.username,
                gameRoomName: roomName.trim(),
                isPrivate,
            }).unwrap();

            showSuccessToast(
                "Room created!",
                isPrivate ? `Room key: ${response.gameRoomId}` : "Players can now join"
            );
            console.log("Romm created with id:", response.gameRoomId, "and room name", roomName);

            setShowCreateDialog(false);
            setRoomName("");
            setIsPrivate(false);
        } catch (err) {
            console.error("Error creating lobby:", err);
            showErrorToast("Failed to create room", "Something went wrong");
        }
    };

    const handleJoinPrivateRoom = async () => {
        if (!user || privateKey.trim().length !== 6) return;
        try {
            const room = await joinPrivateLobby({
                roomKey: privateKey.trim().toUpperCase(),
                userId: user.id,
            }).unwrap();
            dispatch(setCurrentRoom(room));
            setShowJoinDialog(false);
            setPrivateKey("");
            router.push(`/room/${room.gameId}`);
        } catch {
            showErrorToast("Invalid room key", "Room not found or is full");
        }
    };

    // While user is loading, render placeholder to keep SSR markup stable
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background circuit-bg">
            <header className="border-b border-neon-teal/20 bg-surface-dark/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold neon-text">RoboRally Lobby</h1>
                    <Badge
                        variant="secondary"
                        className="bg-neon-teal/20 text-neon-teal border-neon-teal/30"
                    >
                        Pilot: {user.username}
                    </Badge>
                    <Button
                        onClick={() => {
                            localStorage.removeItem("username");
                            router.push("/signin");
                        }}
                        variant="outline"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="glass-panel">
                            <CardHeader>
                                <CardTitle className="text-xl text-neon-teal">
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>Start your RoboRally adventure</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Create Room */}
                                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full bg-gradient-primary"
                                            disabled={creating}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Room
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-panel border-neon-teal/30">
                                        <DialogHeader>
                                            <DialogTitle>Create New Room</DialogTitle>
                                            <DialogDescription>
                                                Set up a new game room
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <Label htmlFor="roomName">Room Name</Label>
                                            <Input
                                                id="roomName"
                                                value={roomName}
                                                onChange={(e) => setRoomName(e.target.value)}
                                            />
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={isPrivate}
                                                    onCheckedChange={setIsPrivate}
                                                    id="private"
                                                />
                                                <Label htmlFor="private">
                                                    <Lock className="w-4 h-4" />
                                                    Private
                                                </Label>
                                            </div>
                                            <Button
                                                onClick={handleCreateRoom}
                                                disabled={!roomName.trim() || creating}
                                            >
                                                Create
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Join Room */}
                                <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Key className="w-4 h-4 mr-2" />
                                            Join Private Room
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-panel border-neon-magenta/30">
                                        <DialogHeader>
                                            <DialogTitle>Join Private Room</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <Label htmlFor="privateKey">Room Key</Label>
                                            <Input
                                                id="privateKey"
                                                value={privateKey}
                                                onChange={(e) => setPrivateKey(e.target.value)}
                                                maxLength={6}
                                                className="uppercase"
                                            />
                                            <Button
                                                onClick={handleJoinPrivateRoom}
                                                disabled={privateKey.trim().length !== 6}
                                            >
                                                Join
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Public Lobbies Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <PublicLobbies username={user.username} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
