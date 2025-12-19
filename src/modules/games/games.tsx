"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLazyGetAllGamesQuery } from "@/redux/api/game/gameApi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { DatePicker } from "@/components/ui/date-picker";
import { History, Filter, ChevronLeft, ChevronRight, Trophy, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/games/game-card";
import { GetAllGamesRequest } from "@/redux/api/game/types";

const ITEMS_PER_PAGE = 10;

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 22
 */
export default function GamesPage() {
  const router = useRouter();

  // User state
  const [username, setUsername] = useState<string>("");

  // Filter states
  const [isPrivateFilter, setIsPrivateFilter] = useState<string>("all");
  const [isFinishedFilter, setIsFinishedFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // API
  const [trigger, { data, isLoading, error }] = useLazyGetAllGamesQuery();
  const games = data?.items || [];
  const totalCount = data?.totalCount || 0;

  // Load username and fetch games
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      router.push("/signin");
    }
  }, [router]);

  // Track previous filter values to detect changes
  const prevFiltersRef = useRef({
    isPrivateFilter,
    isFinishedFilter,
    fromDate,
    toDate,
    searchTerm,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.isPrivateFilter !== isPrivateFilter ||
      prevFiltersRef.current.isFinishedFilter !== isFinishedFilter ||
      prevFiltersRef.current.fromDate !== fromDate ||
      prevFiltersRef.current.toDate !== toDate ||
      prevFiltersRef.current.searchTerm !== searchTerm;

    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1);
    }

    prevFiltersRef.current = {
      isPrivateFilter,
      isFinishedFilter,
      fromDate,
      toDate,
      searchTerm,
    };
  }, [isPrivateFilter, isFinishedFilter, fromDate, toDate, searchTerm, currentPage]);

  // Fetch games when filters or page change
  useEffect(() => {
    if (!username) return;

    const params: GetAllGamesRequest = { username };

    if (isPrivateFilter !== "all") {
      params.isPrivate = isPrivateFilter === "private";
    }

    if (isFinishedFilter !== "all") {
      params.isFinished = isFinishedFilter === "finished";
    }

    if (fromDate) {
      params.from = fromDate.toISOString().split("T")[0];
    }

    if (toDate) {
      params.to = toDate.toISOString().split("T")[0];
    }

    if (searchTerm) {
      params.searchTag = searchTerm;
    }

    // Add pagination parameters
    params.pageNumber = currentPage;
    params.pageSize = ITEMS_PER_PAGE;

    trigger(params);
  }, [
    username,
    isPrivateFilter,
    isFinishedFilter,
    fromDate,
    toDate,
    searchTerm,
    currentPage,
    trigger,
  ]);

  // Use games directly since pagination is handled by the API
  const paginatedGames = games;
  const totalPages = data?.totalPages || 0;

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 130
 */
  const handleClearFilters = () => {
    setIsPrivateFilter("all");
    setIsFinishedFilter("all");
    setFromDate(undefined);
    setToDate(undefined);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    isPrivateFilter !== "all" || isFinishedFilter !== "all" || fromDate || toDate || searchTerm;

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
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              size="sm"
              className="text-neon-teal hover:bg-neon-teal/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold neon-text flex items-center gap-2">
              <History className="w-6 h-6" />
              Game History
            </h1>
          </div>
          <Badge variant="secondary" className="bg-neon-teal/20 text-neon-teal border-neon-teal/30">
            Pilot: {username}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="glass-panel sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg text-neon-blue flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 mt-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium text-neon-blue">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-blue/70" />
                    <Input
                      id="search"
                      placeholder="Room or host name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-neon-blue/30 bg-surface-dark/50 focus:border-neon-blue/50 focus-visible:ring-neon-blue/20"
                    />
                  </div>
                </div>

                {/* Privacy Filter */}
                <div className="space-y-2">
                  <Label htmlFor="privacy" className="text-sm font-medium text-neon-blue">
                    Privacy
                  </Label>
                  <NativeSelect
                    id="privacy"
                    value={isPrivateFilter}
                    onChange={(e) => setIsPrivateFilter(e.target.value)}
                    className="border-neon-blue/30 bg-surface-dark/50 hover:bg-surface-dark/70 hover:border-neon-blue/50 focus-visible:border-neon-blue focus-visible:ring-neon-blue/20"
                  >
                    <NativeSelectOption value="all">All Games</NativeSelectOption>
                    <NativeSelectOption value="public">Public Only</NativeSelectOption>
                    <NativeSelectOption value="private">Private Only</NativeSelectOption>
                  </NativeSelect>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-neon-blue">
                    Status
                  </Label>
                  <NativeSelect
                    id="status"
                    value={isFinishedFilter}
                    onChange={(e) => setIsFinishedFilter(e.target.value)}
                    className="border-neon-blue/30 bg-surface-dark/50 hover:bg-surface-dark/70 hover:border-neon-blue/50 focus-visible:border-neon-blue focus-visible:ring-neon-blue/20"
                  >
                    <NativeSelectOption value="all">All Games</NativeSelectOption>
                    <NativeSelectOption value="finished">Finished</NativeSelectOption>
                    <NativeSelectOption value="ongoing">Ongoing</NativeSelectOption>
                  </NativeSelect>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label htmlFor="from-date" className="text-sm font-medium text-neon-blue">
                    From Date
                  </Label>
                  <DatePicker
                    date={fromDate}
                    onDateChange={setFromDate}
                    placeholder="Select start date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-date" className="text-sm font-medium text-neon-blue">
                    To Date
                  </Label>
                  <DatePicker
                    date={toDate}
                    onDateChange={setToDate}
                    placeholder="Select end date"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Games List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="glass-panel">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-neon-magenta">Your Games</CardTitle>
                    <CardDescription>
                      {totalCount} {totalCount === 1 ? "game" : "games"} found
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <GamesListSkeleton />
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Failed to load games</p>
                  </div>
                ) : !paginatedGames?.length ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">No games found</p>
                    <p className="text-sm text-muted-foreground">
                      {hasActiveFilters
                        ? "Try adjusting your filters"
                        : "Start playing to build your history!"}
                    </p>
                  </div>
                ) : (
                  <>
                    {paginatedGames.map((game, index) => (
                      <GameCard key={game.gameId} game={game} index={index} compact />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neon-magenta/20">
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                          className="border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                          </span>
                        </div>

                        <Button
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                          className="border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 364
 */
function GamesListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border border-neon-magenta/20 rounded-lg bg-surface-dark/30">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}