"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useJoinLobbyMutation } from "@/redux/api/lobby/lobbyApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentRoom } from "@/redux/game/gameSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showSuccessToast, showErrorToast } from "@/lib/toast-handler";
import { JoinLobbyDialog } from "@/components/JoinLobbyDialog/join-lobby-dialog";
import { CreateRoomDialog } from "@/components/CreateRoomDialog/create-room-dialog";
import { LogOut } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentRoom = useAppSelector((s) => s.game.currentRoom);

  // user state (loaded after mount)
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setUsername(username);
    else router.push("/signin");
  }, [router]);

  useEffect(() => {
    if (currentRoom?.gameStarted) router.push(`/game/${currentRoom.id}`);
  }, [currentRoom, router]);

  // While user is loading, render placeholder to keep SSR markup stable
  if (!username) {
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
            Pilot: {username}
          </Badge>
          <Button
            onClick={() => {
              localStorage.removeItem("userId");
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
              <CreateRoomDialog username={username} />

              {/* Join Room */}
              <JoinLobbyDialog username={username} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
