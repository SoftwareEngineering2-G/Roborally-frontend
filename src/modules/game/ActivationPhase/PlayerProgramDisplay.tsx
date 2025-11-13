"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCardFromBackendString } from "../ProgrammingPhase/types";
import { cn } from "@/lib/utils";
import { ExecuteCardButton } from "./ExecuteCardButton";

interface Player {
  username: string;
  robot: string;
  revealedCardsInOrder: string[]; // Cards revealed during activation phase
  currentCheckpoint: number;
}

const robotColorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  gray: "bg-gray-500",
  white: "bg-gray-100",
};

const robotImageMap: Record<string, string> = {
  red: "/robots/red_robot.jpg",
  blue: "/robots/blue_robot.jpg",
  green: "/robots/green_robot.jpg",
  yellow: "/robots/yellow_robot.jpg",
  orange: "/robots/orange_robot.jpg",
  white: "/robots/white_robot.jpg",
};

interface PlayerProgramDisplayProps {
  player: Player;
  isCurrentPlayer?: boolean;
  revealedUpTo?: number; // Which register index is revealed (0-4), undefined means none
  isCurrentTurn?: boolean; // Is it this player's turn to execute?
  gameId?: string; // Game ID for execute button
}

export const PlayerProgramDisplay = ({
  player,
  isCurrentPlayer = false,
  revealedUpTo = -1,
  isCurrentTurn = false,
  gameId = "",
}: PlayerProgramDisplayProps) => {
  const robotColor =
    robotColorMap[player.robot.toLowerCase() as keyof typeof robotColorMap] ||
    "bg-gray-500";
  const robotImage =
    robotImageMap[player.robot.toLowerCase()] || "/robots/red_robot.jpg"; // fallback to red

  // Convert revealed card names to ProgramCard objects
  // During activation phase, we display the revealed cards for all players
  const revealedCards = player.revealedCardsInOrder.map((cardName, index) =>
    createCardFromBackendString(cardName, `${player.username}-${index}`)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card
        className={cn(
          "glass-panel border-glass-border transition-all duration-200",
          isCurrentPlayer
            ? "border-neon-teal shadow-glow-teal ring-2 ring-neon-teal/30"
            : "border-glass-border-hover"
        )}
      >
        <CardContent className="p-4">
          {/* Player Header */}
          <div className="flex items-center gap-3 mb-3">
            {/* Robot Avatar with Image */}
            <div className="relative w-12 h-12 border-2 border-glass-border rounded-full overflow-hidden bg-surface-dark">
              <Image
                src={robotImage}
                alt={`${player.robot} robot`}
                fill
                className="object-cover mix-blend-lighten brightness-110 contrast-125"
                sizes="48px"
                style={{ backgroundColor: "transparent" }}
              />
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {player.username}
                </span>
                {isCurrentPlayer && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-neon-teal/10 border-neon-teal/30 text-neon-teal"
                  >
                    You
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${robotColor}`} />
                <span className="text-xs text-muted-foreground capitalize">
                  {player.robot} Robot
                </span>
              </div>
            </div>
          </div>

          {/* Program Cards - 5 Register Slots */}
          <div className="space-y-2">
            {/* Checkpoint Counter */}
            <div className="flex items-center justify-between mb-2 p-2 rounded-md bg-surface-dark/50 border border-glass-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Checkpoint passed : 
                </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neon-teal">
                  {player.currentCheckpoint}
                </span>
              </div>
            </div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Programmed Cards
            </h4>
            <div className="flex gap-2 justify-start">
              {[0, 1, 2, 3, 4].map((registerIndex) => {
                const card = revealedCards[registerIndex];
                const hasCard = card !== undefined;
                const isRevealed = registerIndex <= revealedUpTo;

                return (
                  <div
                    key={registerIndex}
                    className={cn(
                      "relative w-12 h-16 rounded border-2 transition-all",
                      hasCard
                        ? isRevealed
                          ? "border-neon-teal bg-surface-medium/80"
                          : "border-neon-teal/50 bg-surface-medium/80"
                        : "border-glass-border bg-surface-dark/50 border-dashed"
                    )}
                    style={{ perspective: "1000px" }}
                  >
                    {hasCard ? (
                      <>
                        {/* Card Flip Container */}
                        <motion.div
                          className="absolute inset-0"
                          initial={false}
                          animate={{ rotateY: isRevealed ? 180 : 0 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                          }}
                          style={{
                            transformStyle: "preserve-3d",
                          }}
                        >
                          {/* Card Back */}
                          <div
                            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded"
                            style={{
                              backfaceVisibility: "hidden",
                            }}
                          >
                            <Image
                              src="/card_back.png"
                              alt="Card Back"
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>

                          {/* Card Front (Revealed) */}
                          <div
                            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded"
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          >
                            <Image
                              src={card.imagePath}
                              alt={card.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        </motion.div>

                        {/* Register Number Badge */}
                        <div
                          className={cn(
                            "absolute -top-1 -left-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold z-10 transition-colors duration-300",
                            isRevealed
                              ? "bg-neon-teal text-black"
                              : "bg-gray-500 text-white"
                          )}
                        >
                          {registerIndex + 1}
                        </div>
                      </>
                    ) : (
                      /* Empty Register Indicator */
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground/50">
                          {registerIndex + 1}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Execute Button - Show only for current turn player if they are the current user */}
            {isCurrentTurn &&
              isCurrentPlayer &&
              revealedUpTo >= 0 &&
              revealedCards[revealedUpTo] && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-neon-teal font-semibold animate-pulse">
                    Your turn!
                  </span>
                  <ExecuteCardButton
                    gameId={gameId}
                    username={player.username}
                    cardName={revealedCards[revealedUpTo].name}
                    registerIndex={revealedUpTo}
                  />
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
