"use client";
import { motion } from "framer-motion";
import { useGetAvailableBoardsQuery } from "@/redux/api/gameBoard/gameBoardApi";
import { Map, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

// Board metadata with descriptions and themes
const boardMetadata: Record<
  string,
  {
    description: string;
    difficulty: string;
    color: string;
    icon: string;
  }
> = {
  "Starter Course": {
    description:
      "Classic circuit design with dual conveyor loops - perfect for beginners",
    difficulty: "Easy",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: "🎯",
  },
  "Castle Tour": {
    description:
      "Navigate the castle's outer green loop and inner blue circuit with rotating gears",
    difficulty: "Medium",
    color: "from-purple-500/20 to-pink-500/20",
    icon: "🏰",
  },
};

/**
 * @author Satish 2025-11-03 14:13:07 +0100 39
 */
export const BoardSelector = ({
  value,
  onValueChange,
  disabled = false,
}: BoardSelectorProps) => {
  const { data: boards, isLoading, error } = useGetAvailableBoardsQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">Select Game Board</h3>
        </div>
        <div className="flex items-center justify-center gap-2 p-8 border rounded-lg bg-muted/50">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading available boards...
          </span>
        </div>
      </div>
    );
  }

  if (error || !boards || boards.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">Select Game Board</h3>
        </div>
        <div className="flex items-center gap-2 p-4 border rounded-lg bg-destructive/10">
          <Map className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">
            Failed to load game boards
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Map className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold">Select Game Board</h3>
        <Sparkles className="h-4 w-4 text-yellow-500 ml-auto" />
      </div>

      <div className="space-y-2">
        {boards.map((board, index) => {
          const metadata = boardMetadata[board.name] || {
            description: "An exciting challenge awaits!",
            difficulty: "Unknown",
            color: "from-gray-500/20 to-slate-500/20",
            icon: "🗺️",
          };

          const isSelected = value === board.name;

          return (
            <motion.button
              key={board.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !disabled && onValueChange(board.name)}
              disabled={disabled}
              className={cn(
                "w-full text-left transition-all duration-200",
                "relative overflow-hidden rounded-lg border-2 p-4",
                "hover:shadow-lg hover:scale-[1.02]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                isSelected
                  ? "border-none bg-primary/5 shadow-md"
                  : "border-none bg-card hover:border-primary/50"
              )}
            >
              {/* Background gradient */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  metadata.color
                )}
              />

              {/* Content */}
              <div className="relative space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{metadata.icon}</span>
                    <div>
                      <h4 className="font-semibold text-base">{board.name}</h4>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          metadata.difficulty === "Easy" &&
                            "bg-green-500/20 text-green-700 dark:text-green-400",
                          metadata.difficulty === "Medium" &&
                            "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                          metadata.difficulty === "Hard" &&
                            "bg-red-500/20 text-red-700 dark:text-red-400"
                        )}
                      >
                        {metadata.difficulty}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </motion.div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {metadata.description}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selected-board"
                  className="absolute inset-0 border-2 border-accent rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};