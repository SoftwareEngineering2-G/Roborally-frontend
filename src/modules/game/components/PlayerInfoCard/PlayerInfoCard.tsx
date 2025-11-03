"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface Player {
  username: string;
  robot: string;
  programmedCards?: string[];
}

interface PlayerInfoCardProps {
  player: Player;
  isCurrentPlayer?: boolean;
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

export const PlayerInfoCard = ({
  player,
  isCurrentPlayer = false,
}: PlayerInfoCardProps) => {
  const robotColor =
    robotColorMap[player.robot.toLowerCase() as keyof typeof robotColorMap] ||
    "bg-gray-500";
  const robotImage =
    robotImageMap[player.robot.toLowerCase()] || "/robots/red_robot.jpg"; // fallback to red

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`glass-panel border-glass-border transition-all duration-200 ${
          isCurrentPlayer
            ? "border-neon-teal shadow-glow-teal ring-2 ring-neon-teal/30"
            : "hover:border-glass-border-hover"
        }`}
      >
        <CardContent className="p-4 flex items-center gap-3">
          {/* Robot Avatar with Image */}
          <div className="relative w-12 h-12 border-2 border-glass-border rounded-full overflow-hidden bg-surface-dark">
            <Image
              src={robotImage}
              alt={`${player.robot} robot`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
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

            {/* Robot indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${robotColor}`} />
              <span className="text-xs text-muted-foreground capitalize">
                {player.robot} Robot
              </span>
            </div>

            {/* Lock-in status */}
            <div className="flex items-center gap-2 mt-2">
              {player.programmedCards && player.programmedCards.length === 5 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-neon-teal" />
                  <span className="text-xs text-neon-teal font-medium">
                    Locked In
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">
                    Programming...
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
