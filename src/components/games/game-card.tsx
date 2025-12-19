"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Play, RotateCcw } from "lucide-react";
import { showInfoToast } from "@/lib/toast-handler";

interface GameCardProps {
  game: {
    gameId: string;
    gameRoomName: string;
    hostUsername: string;
    startDate: string;
    isFinished?: boolean;
    winner?: string | null;
  };
  index?: number;
  compact?: boolean; // For smaller cards in MyGames
}

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 23
 */
export function GameCard({ game, index = 0, compact = false }: GameCardProps) {
  const router = useRouter();
  const isOngoing = !game.isFinished;

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 27
 */
  const handleJoinGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/game/${game.gameId}`);
  };

/**
 * @author Sachin Baral 2025-11-03 12:59:33 +0100 32
 */
  const handleReplayGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    showInfoToast("Coming Soon", "Game replays feature is under development!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: compact ? -20 : 0, y: compact ? 0 : 20 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        scale: isOngoing && compact ? [1, 1.02, 1] : 1,
      }}
      transition={{ 
        delay: index * (compact ? 0.1 : 0.05), 
        duration: 0.3,
        scale: {
          repeat: isOngoing && compact ? Infinity : 0,
          duration: 2,
          ease: "easeInOut",
        }
      }}
      className={`
        p-4 rounded-lg transition-all card-hover relative
        ${isOngoing 
          ? 'border-2 border-neon-lime/40 bg-surface-dark/50 shadow-glow-teal hover:border-neon-lime/60 hover:shadow-[0_0_30px_hsl(var(--neon-lime)/0.4)]' 
          : 'border border-neon-magenta/20 bg-surface-dark/30 hover:border-neon-magenta/40'
        }
      `}
    >
      {/* Pulsing indicator for ongoing games */}
      {isOngoing && compact && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-neon-lime rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold truncate ${
                compact ? "text-base" : "text-lg"
              } ${isOngoing ? "text-neon-lime" : "text-foreground"}`}
            >
              {game.gameRoomName}
            </h3>
            <Badge
              variant="secondary"
              className={
                game.isFinished
                  ? "bg-surface-light text-muted-foreground border-muted-foreground/30"
                  : "bg-neon-lime/30 text-neon-lime border-neon-lime/50 animate-pulse"
              }
            >
              {game.isFinished ? "Finished" : "🔴 Live"}
            </Badge>
          </div>
          <div
            className={`flex items-center gap-4 text-muted-foreground ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">Host: {game.hostUsername}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(game.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: compact ? "numeric" : "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          {game.winner && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 font-semibold text-sm">
                🏆 Winner: {game.winner}
              </span>
            </div>
          )}
        </div>
        <motion.div
          animate={isOngoing && compact ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isOngoing && compact ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <Button
            onClick={(e) =>
              game.isFinished ? handleReplayGame(e) : handleJoinGame(e)
            }
            size={compact ? "sm" : "sm"}
            className={
              game.isFinished
                ? "bg-gradient-secondary shrink-0"
                : "bg-gradient-primary shrink-0 shadow-glow-teal"
            }
          >
            {game.isFinished ? (
              <>
                <RotateCcw className="w-4 h-4 mr-1" />
                Replay
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                {compact ? "Join Now" : "Join"}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}