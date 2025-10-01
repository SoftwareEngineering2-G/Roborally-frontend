"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface Player {
  username: string;
  robot: string;
  hasLockedIn?: boolean;
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
};

export const PlayerInfoCard = ({ 
  player, 
  isCurrentPlayer = false
}: PlayerInfoCardProps) => {
  const robotColor = robotColorMap[player.robot as keyof typeof robotColorMap] || "bg-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`glass-panel border-glass-border transition-all duration-200 ${
        isCurrentPlayer 
          ? "border-neon-teal shadow-glow-teal ring-2 ring-neon-teal/30" 
          : "hover:border-glass-border-hover"
      }`}>
        <CardContent className="p-4 flex items-center gap-3">
          {/* Robot Avatar */}
          <Avatar className="w-12 h-12 border-2 border-glass-border">
            <AvatarFallback className={`${robotColor} text-white font-bold`}>
              {player.robot.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

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
              {player.hasLockedIn ? (
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