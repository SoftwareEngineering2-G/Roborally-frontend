"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Trophy, ChevronRight, RefreshCw } from "lucide-react";
import { useGetMyProfileQuery } from "@/redux/api/user/userApi";
import { useGetAllGamesQuery } from "@/redux/api/game/gameApi";
import { GameCard } from "../games/game-card";

interface Props {
  username: string;
}

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 17
 */
export default function MyProfile({ username }: Props) {
  const router = useRouter();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetMyProfileQuery({ username });

  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
    refetch: refetchGames,
  } = useGetAllGamesQuery({ username, pageNumber: 1, pageSize: 3 });

  const recentGames = gamesData?.items || [];

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 36
 */
  const handleRefresh = () => {
    refetchProfile();
    refetchGames();
  };

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 41
 */
  const formatBirthday = (birthday: string) => {
    try {
      return new Date(birthday).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return birthday;
    }
  };

  return (
    <Card className="glass-panel border-2 border-neon-teal/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-neon-teal flex items-center gap-2">
              <User className="w-6 h-6" />
              My Profile
            </CardTitle>
            <CardDescription>Your pilot information and recent battles</CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            size="icon"
            variant="outline"
            className="border-neon-teal/50 text-neon-teal hover:bg-neon-teal/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Info */}
        {profileLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-surface-light rounded w-3/4" />
            <div className="h-4 bg-surface-light rounded w-1/2" />
            <div className="h-4 bg-surface-light rounded w-1/3" />
          </div>
        ) : profileError ? (
          <div className="text-destructive text-sm">Failed to load profile</div>
        ) : profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Username */}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-neon-teal" />
              <div>
                <p className="text-xs text-muted-foreground">Pilot Name</p>
                <p className="text-xl font-bold text-foreground">{profile.username}</p>
              </div>
            </div>

            {/* Birthday */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-neon-magenta" />
              <div>
                <p className="text-xs text-muted-foreground">Birthday</p>
                <p className="text-lg text-foreground">{formatBirthday(profile.birthday)}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground">Current Rating</p>
                <Badge
                  variant="secondary"
                  className="text-xl font-black bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border-yellow-400/50 px-4 py-1"
                >
                  {profile.rating}
                </Badge>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Divider */}
        <div className="border-t border-surface-light/50" />

        {/* Recent Games */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-neon-teal">Recent Games</h3>
            <Button
              onClick={() => router.push("/games")}
              variant="ghost"
              size="sm"
              className="text-neon-magenta hover:text-neon-magenta/80 hover:bg-neon-magenta/10"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {gamesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-surface-light/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : gamesError ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Failed to load recent games
            </div>
          ) : recentGames.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No games played yet</p>
              <p className="text-sm text-muted-foreground mt-1">Start your first battle!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentGames.map((game, index) => (
                <GameCard key={game.gameId} game={game} index={index} compact={true} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}