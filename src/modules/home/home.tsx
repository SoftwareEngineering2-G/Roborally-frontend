"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JoinLobbyDialog } from "@/components/JoinLobbyDialog/join-lobby-dialog";
import { CreateLobbyDialog } from "@/components/CreateLobbyDialog/create-lobby-dialog";
import PublicLobbies from "@/components/lobby/public-lobbies";
import PausedGames, { useGetPausedGamesQuery } from "@/components/home/paused-games";
import QuickLeaderboard from "@/components/home/quick-leaderboard";
import MyProfile from "@/components/home/my-profile";
import { LogOut } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // user state (loaded after mount)
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setUsername(username);
    else router.push("/signin");
  }, [router]);

  // Check if there are paused games to conditionally render
  const { data: pausedGames, isLoading: loadingPausedGames } = useGetPausedGamesQuery(
    { username },
    { skip: !username }
  );
  const hasPausedGames = loadingPausedGames || (pausedGames && pausedGames.length > 0);

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
      {/* Header */}
      <header className="border-b border-neon-teal/20 bg-surface-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black bg-gradient-to-r from-neon-teal via-neon-magenta to-neon-teal text-transparent bg-clip-text">
                ROBORALLY
              </h1>
              <Badge
                variant="secondary"
                className="bg-neon-teal/20 text-neon-teal border-neon-teal/30 font-semibold"
              >
                {username}
              </Badge>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem("username");
                router.push("/signin");
              }}
              variant="outline"
              size="sm"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section - Profile & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card - Takes 2 columns */}
            <div className="lg:col-span-2">
              <MyProfile username={username} />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div className="space-y-4">
              <Card className="glass-panel border-2 border-neon-magenta/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-neon-magenta">Quick Start</CardTitle>
                  <CardDescription className="text-xs">Launch into action</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CreateLobbyDialog username={username} />
                  <JoinLobbyDialog username={username} />
                </CardContent>
              </Card>

              {/* Leaderboard Preview */}
              <QuickLeaderboard />
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Paused Games */}
            {hasPausedGames && <PausedGames username={username} />}

            {/* Public Lobbies */}
            <PublicLobbies username={username} />
          </motion.div>

          {/* Right Column - Can add more sections here later */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* This space can be used for additional features */}
            {/* For now, it helps balance the layout */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
