"use client";

import { Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GamePauseButtonProps {
  onRequestPause: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const GamePauseButton = ({
  onRequestPause,
  disabled = false,
  isLoading = false,
}: GamePauseButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onRequestPause}
            disabled={disabled || isLoading}
            className="glass-panel border-neon-teal/30 hover:border-neon-teal hover:glow-teal transition-all"
          >
            <Pause className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? "Requesting..." : "Pause Game"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Request to pause the game. All players must vote.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
