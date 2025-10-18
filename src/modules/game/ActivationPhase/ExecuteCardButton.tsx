"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useExecuteProgrammingCardMutation } from "@/redux/api/game/gameApi";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

interface ExecuteCardButtonProps {
  gameId: string;
  username: string;
  cardName: string;
  registerIndex: number;
}

export const ExecuteCardButton = ({ 
  gameId, 
  username, 
  cardName,
  // registerIndex 
}: ExecuteCardButtonProps) => {
  const [executeCard, { isLoading }] = useExecuteProgrammingCardMutation();
  
  // Check if this player has already executed in the current round
  const executedPlayers = useAppSelector(state => state.game.executedPlayers);
  const hasExecuted = executedPlayers.includes(username);

  const handleExecute = async () => {
    try {
      await executeCard({
        gameId,
        username,
        cardName,
      }).unwrap();
      
    } catch (error) {
      console.error("Failed to execute card:", error);
      toast.error("Failed to execute card");
    }
  };

  if (hasExecuted) {
    return (
      <div className="text-xs text-green-500 font-semibold">
        ✓ Executed
      </div>
    );
  }

  return (
    <Button
      onClick={handleExecute}
      disabled={isLoading}
      size="sm"
      className="bg-neon-teal hover:bg-neon-teal/80 text-black font-semibold"
    >
      <Play className="w-4 h-4 mr-1" />
      {isLoading ? "Executing..." : "Execute"}
    </Button>
  );
};
