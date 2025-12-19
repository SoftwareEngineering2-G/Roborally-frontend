"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Medal, ChevronLeft, ChevronRight, Home, RefreshCw } from "lucide-react";
import { useGetLeaderboardQuery } from "@/redux/api/leaderboard/leaderboardApi";

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 11
 */
export default function LeaderboardPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;

  const { data, isLoading, error, refetch } = useGetLeaderboardQuery({
    pageNumber: currentPage,
    pageSize,
  });

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 21
 */
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 28
 */
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400 font-black text-2xl";
    if (rank === 2) return "text-gray-300 font-bold text-xl";
    if (rank === 3) return "text-amber-600 font-bold text-xl";
    return "text-muted-foreground font-semibold";
  };

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 35
 */
  const getRankBg = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400/50";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-2 border-amber-600/50";
    return "bg-surface-light/30 border border-surface-light/50 hover:bg-surface-light/50";
  };

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 45
 */
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 51
 */
  const handleNext = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

/**
 * @author Sachin Baral 2025-11-15 19:44:46 +0100 57
 */
  const globalRank = (index: number) => (currentPage - 1) * pageSize + index + 1;

  return (
    <div className="min-h-screen bg-background circuit-bg">
      {/* Header */}
      <header className="border-b border-neon-teal/20 bg-surface-dark/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="sm"
              className="border-neon-teal/50 text-neon-teal hover:bg-neon-teal/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
              🏆 LEADERBOARD
            </h1>
          </div>
          {data && (
            <div className="text-sm text-muted-foreground">
              Total Pilots: <span className="text-neon-teal font-bold">{data.totalCount}</span>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-panel border-2 border-neon-magenta/30">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="text-2xl text-neon-teal flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Elite Pilots Ranking
                </CardTitle>
                <div className="flex items-center gap-3">
                  {data && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Page {data.currentPage} of {data.totalPages}
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={() => refetch()}
                    size="icon"
                    variant="outline"
                    className="border-neon-teal/50 text-neon-teal hover:bg-neon-teal/10"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-6 w-6 bg-surface-light rounded" />
                        <div className="h-4 bg-surface-light rounded w-48" />
                      </div>
                      <div className="h-6 bg-surface-light rounded w-20" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-destructive text-lg font-semibold">
                    Failed to load leaderboard
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {data && data.items.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No pilots found</p>
                </div>
              )}

              {data && data.items.length > 0 && (
                <>
                  <div className="space-y-2">
                    {data.items.map((user, index) => {
                      const rank = globalRank(index);
                      return (
                        <motion.div
                          key={`${user.username}-${rank}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`
                            flex items-center justify-between p-4 rounded-lg transition-all
                            ${getRankBg(rank)}
                          `}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-12 h-12">
                              {getMedalIcon(rank) || (
                                <span className={`font-bold ${getRankColor(rank)}`}>#{rank}</span>
                              )}
                            </div>
                            <span
                              className={`text-lg font-bold truncate ${
                                rank <= 3 ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {user.username}
                            </span>
                          </div>
                          <div
                            className={`text-2xl font-black px-4 py-2 rounded-lg ${
                              rank === 1
                                ? "bg-yellow-400/30 text-yellow-400 shadow-glow-teal"
                                : rank === 2
                                ? "bg-gray-400/30 text-gray-300"
                                : rank === 3
                                ? "bg-amber-600/30 text-amber-600"
                                : "bg-neon-teal/20 text-neon-teal"
                            }`}
                          >
                            {user.rating}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-light/50">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-neon-teal/50 text-neon-teal hover:bg-neon-teal/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="text-muted-foreground">Page</span>
                      <span className="text-neon-teal text-lg">{data.currentPage}</span>
                      <span className="text-muted-foreground">of</span>
                      <span className="text-neon-magenta text-lg">{data.totalPages}</span>
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={currentPage >= data.totalPages}
                      variant="outline"
                      className="border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}