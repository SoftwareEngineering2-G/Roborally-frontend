"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JoinLobbyDialog } from "@/components/JoinLobbyDialog/join-lobby-dialog";
import { CreateLobbyDialog } from "@/components/CreateLobbyDialog/create-lobby-dialog";
import PublicLobbies from "@/components/lobby/public-lobbies";
import PausedGames, { useGetPausedGamesQuery } from "@/components/home/paused-games";
import MyProfile from "@/components/home/my-profile";
import { LogOut, Trophy, User } from "lucide-react";

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
      {/* Streamlined Header */}
      <header className="border-b border-neon-teal/30 bg-gradient-to-r from-surface-dark via-surface-dark/95 to-surface-dark backdrop-blur-lg sticky top-0 z-50 shadow-lg shadow-neon-teal/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black bg-gradient-to-r from-neon-teal via-cyan-400 to-neon-magenta text-transparent bg-clip-text tracking-wider">
                ⚡ ROBORALLY
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-neon-teal/20 to-neon-magenta/20 text-neon-teal border-neon-teal/40 font-bold px-3 py-1 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => router.push("/leaderboard")}
              >
                <User className="w-3 h-3 mr-1" />
                {username}
              </Badge>
              <Button
                onClick={() => {
                  localStorage.removeItem("username");
                  router.push("/signin");
                }}
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="glass-panel border-2 border-neon-magenta/40 bg-gradient-to-br from-surface-dark/80 via-neon-magenta/5 to-neon-teal/5 p-6 rounded-2xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-black bg-gradient-to-r from-neon-teal to-neon-magenta text-transparent bg-clip-text mb-2">
                  Ready to Race?
                </h2>
                <p className="text-muted-foreground">Choose your path to victory</p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <CreateLobbyDialog username={username} />
                <JoinLobbyDialog username={username} />
                <Button
                  onClick={() => router.push("/leaderboard")}
                  variant="outline"
                  size="lg"
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-bold"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Leaderboard
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Side - Profile Stats (Smaller) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="xl:col-span-1"
          >
            <MyProfile username={username} />
          </motion.div>

          {/* Right Side - Lobbies (Larger, Focus Area) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="xl:col-span-2 space-y-6"
          >
            {hasPausedGames && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="glass-panel border-2 border-orange-400/40 bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl shadow-lg shadow-orange-400/10">
                  <PausedGames username={username} />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <PublicLobbies username={username} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
