"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Medal, ChevronRight, RefreshCw } from "lucide-react";
import { useGetLeaderboardQuery } from "@/redux/api/leaderboard/leaderboardApi";

export default function QuickLeaderboard() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetLeaderboardQuery({
    pageNumber: 1,
    pageSize: 10,
  });

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400 font-black";
    if (rank === 2) return "text-gray-300 font-bold";
    if (rank === 3) return "text-amber-600 font-bold";
    return "text-muted-foreground font-semibold";
  };

  if (isLoading) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Pilots
              </CardTitle>
              <CardDescription>Elite RoboRally Rankings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="h-4 bg-surface-light rounded w-32" />
                <div className="h-4 bg-surface-light rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top Pilots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">Failed to load leaderboard</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-2 border-neon-magenta/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
                TOP PILOTS
              </span>
            </CardTitle>
            <CardDescription>Elite RoboRally Rankings</CardDescription>
          </div>
          <Button
            onClick={() => refetch()}
            size="icon"
            variant="outline"
            className="border-neon-teal/50 text-neon-teal hover:bg-neon-teal/10 shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {data?.items.map((user, index) => {
          const rank = index + 1;
          return (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center justify-between p-3 rounded-lg transition-all
                ${
                  rank <= 3
                    ? "bg-gradient-to-r from-surface-light/50 to-surface-dark/50 border border-neon-teal/30"
                    : "bg-surface-light/30 hover:bg-surface-light/50"
                }
              `}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8">
                  {getMedalIcon(rank) || (
                    <span className={`text-sm font-bold ${getRankColor(rank)}`}>#{rank}</span>
                  )}
                </div>
                <span
                  className={`font-semibold truncate ${
                    rank <= 3 ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {user.username}
                </span>
              </div>
              <div
                className={`text-lg font-black px-3 py-1 rounded-md ${
                  rank === 1
                    ? "bg-yellow-400/20 text-yellow-400 shadow-glow-teal"
                    : rank === 2
                    ? "bg-gray-400/20 text-gray-300"
                    : rank === 3
                    ? "bg-amber-600/20 text-amber-600"
                    : "bg-neon-teal/20 text-neon-teal"
                }`}
              >
                {user.rating}
              </div>
            </motion.div>
          );
        })}

        <Button
          onClick={() => router.push("/leaderboard")}
          variant="outline"
          className="w-full mt-4 border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/10 font-semibold"
        >
          View Full Leaderboard
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
