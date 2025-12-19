"use client";

import { useRouter } from "next/navigation";
import { useGetAllGamesQuery } from "@/redux/api/game/gameApi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowRight, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "./game-card";

interface Props {
  className?: string;
  username: string;
  useMockData?: boolean; // For demonstration purposes
}

// Mock data for demonstration
const mockGames = [
  {
    gameId: "mock-1",
    gameRoomName: "Epic Robot Battle",
    hostUsername: "RoboMaster",
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isFinished: false,
  },
  {
    gameId: "mock-2",
    gameRoomName: "Factory Frenzy",
    hostUsername: "SpeedRunner",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isFinished: true,
  },
  {
    gameId: "mock-3",
    gameRoomName: "Circuit Champions",
    hostUsername: "TechWizard",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isFinished: true,
  },
  {
    gameId: "mock-4",
    gameRoomName: "Neon Showdown",
    hostUsername: "CyberPilot",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isFinished: false,
  },
  {
    gameId: "mock-5",
    gameRoomName: "Mega Marathon",
    hostUsername: "ProGamer",
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isFinished: true,
  },
];

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 57
 */
export default function MyGames({ username, className, useMockData = false }: Props) {
  const router = useRouter();

  const {
    data: apiGames,
    isLoading,
    error,
  } = useGetAllGamesQuery({ username }, { skip: useMockData });

  // Use mock data if enabled, otherwise use API data
  const games = useMockData ? mockGames : apiGames?.items || [];

  // Get last 3 games
  const recentGames = games.slice(0, 3);

  if (isLoading) {
    return <MyGamesSkeleton />;
  }

  if (error) {
    return <MyGamesError />;
  }

  return (
    <Card className={`glass-panel ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
              <History className="w-5 h-5" />
              My Games
            </CardTitle>
            <CardDescription>Your recent game history</CardDescription>
          </div>
          <Button
            onClick={() => router.push("/games")}
            variant="ghost"
            size="sm"
            className="text-neon-teal hover:bg-neon-magenta/10"
          >
            See All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!recentGames?.length ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">No games played yet</p>
            <p className="text-sm text-muted-foreground">Start a game to see your history!</p>
          </div>
        ) : (
          <>
            {recentGames.map((game: (typeof games)[0], index: number) => (
              <GameCard key={game.gameId} game={game} index={index} compact />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 121
 */
function MyGamesSkeleton() {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-neon-magenta flex items-center gap-2">
              <History className="w-5 h-5" />
              My Games
            </CardTitle>
            <CardDescription>Your recent game history</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-neon-magenta/20 rounded-lg bg-surface-dark/30">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 152
 */
function MyGamesError() {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-xl text-neon-magenta flex items-center gap-2">
          <History className="w-5 h-5" />
          My Games
        </CardTitle>
        <CardDescription>Your recent game history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load game history</p>
        </div>
      </CardContent>
    </Card>
  );
}