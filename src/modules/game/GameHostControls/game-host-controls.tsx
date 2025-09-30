"use client";

import { Button } from "@/components/ui/button";
import { useStartCardDealingForAllMutation } from "@/redux/api/game/gameApi";
import { useState } from "react";
import { Crown, Play } from "lucide-react";

interface GameHostControlsProps {
  gameId: string;
}

export const GameHostControls = ({ gameId }: GameHostControlsProps) => {
  const [startCardDealing, { isLoading }] = useStartCardDealingForAllMutation();
  const [username] = useState("host"); // TODO: Get from auth context later

  const handleStartCardDealing = async () => {
    try {
      await startCardDealing({ gameId, username }).unwrap();
      // TODO: Add success toast notification
    } catch (error) {
      // TODO: Add error toast notification
      console.error("Failed to start card dealing:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
        <Crown className="w-3 h-3" />
        <span>Host</span>
      </div>
      <Button
        onClick={handleStartCardDealing}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="h-7 text-xs bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50"
      >
        <Play className="w-3 h-3 mr-1" />
        {isLoading ? "Starting..." : "Deal Cards"}
      </Button>
    </div>
  );
};
