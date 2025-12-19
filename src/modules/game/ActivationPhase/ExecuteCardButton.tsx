"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExecuteProgrammingCardMutation } from "@/redux/api/game/gameApi";
import type { ExecuteProgrammingCardRequest } from "@/redux/api/game/types";
import { useAppSelector } from "@/redux/hooks";

interface ExecuteCardButtonProps {
  gameId: string;
  username: string;
  cardName: string;
}

const MOVEMENT_CHOICES = [
  "Move 1",
  "Move 2",
  "Move 3",
  "Move Back",
  "Rotate Left",
  "Rotate Right",
  "U-Turn",
] as const;

/**
 * @author Satish 2025-11-24 10:19:43 +0100 44
 */
export const ExecuteCardButton = ({ gameId, username, cardName }: ExecuteCardButtonProps) => {
  const [executeCard, { isLoading }] = useExecuteProgrammingCardMutation();
  const { executedPlayers, currentGame } = useAppSelector((state) => state.game);

  const hasExecuted = executedPlayers.includes(username);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string>();
  const [selectedMovement, setSelectedMovement] = useState<string>(MOVEMENT_CHOICES[0]);

  const isSwapCard = cardName === "Swap Position";
  const isMovementChoiceCard = cardName === "Movement Choice";
  const isInteractiveCard = isSwapCard || isMovementChoiceCard;

  const swapTargets = useMemo(() => {
    if (!currentGame) return [];
    return currentGame.players.filter((p) => p.username !== username).map((p) => p.username);
  }, [currentGame, username]);

  const noSwapTargets = isSwapCard && swapTargets.length === 0;

/**
 * @author Satish 2025-11-24 10:19:43 +0100 64
 */
  const resetDialogState = () => {
    setDialogOpen(false);
    setSelectedTarget(undefined);
    setSelectedMovement(MOVEMENT_CHOICES[0]);
  };

  const submitExecution = async (
    interactiveInput?: ExecuteProgrammingCardRequest["interactiveInput"]
  ) => {
    try {
      await executeCard({
        gameId,
        username,
        cardName,
        interactiveInput,
      }).unwrap();
      resetDialogState();
    } catch (error) {
      console.error("Failed to execute card:", error);
      toast.error("Failed to execute card");
    }
  };

/**
 * @author Satish 2025-11-24 10:19:43 +0100 87
 */
  const handleExecute = () => {
    if (isInteractiveCard) {
      setDialogOpen(true);
      return;
    }
    void submitExecution();
  };

/**
 * @author Satish 2025-11-24 10:19:43 +0100 95
 */
  const handleDialogConfirm = () => {
    if (isSwapCard) {
      if (!selectedTarget) {
        toast.error("Select a player to swap positions with.");
        return;
      }
      void submitExecution({ targetPlayerUsername: selectedTarget });
      return;
    }

    if (isMovementChoiceCard) {
      void submitExecution({ selectedMovementCard: selectedMovement });
    }
  };

  if (hasExecuted) {
    return <div className="text-xs text-green-500 font-semibold">✓ Executed</div>;
  }

  return (
    <>
      <Button
        onClick={handleExecute}
        disabled={isLoading || noSwapTargets}
        size="sm"
        className="bg-neon-teal hover:bg-neon-teal/80 text-black font-semibold"
        title={noSwapTargets ? "No available players to swap with." : undefined}
      >
        <Play className="w-4 h-4 mr-1" />
        {isLoading ? "Executing..." : isInteractiveCard ? "Configure" : "Execute"}
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            resetDialogState();
          }
        }}
      >
        <DialogContent className="glass-panel border border-neon-teal/40 bg-[#0B1220]/95">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-neon-teal">
              {isSwapCard ? "Swap Position" : "Movement Choice"}
            </DialogTitle>
            <DialogDescription>
              {isSwapCard
                ? "Select another player to instantly swap places with."
                : "Pick the movement command you want to execute when this card resolves."}
            </DialogDescription>
          </DialogHeader>

          {isSwapCard && (
            <div className="space-y-2">
              <Label htmlFor="swap-target" className="text-sm text-chrome-light">
                Target player
              </Label>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger id="swap-target" className="w-full bg-background/40">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {swapTargets.map((player) => (
                    <SelectItem key={player} value={player}>
                      {player}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isMovementChoiceCard && (
            <div className="space-y-2">
              <Label htmlFor="movement-choice" className="text-sm text-chrome-light">
                Movement option
              </Label>
              <Select value={selectedMovement} onValueChange={setSelectedMovement}>
                <SelectTrigger id="movement-choice" className="w-full bg-background/40">
                  <SelectValue placeholder="Select movement" />
                </SelectTrigger>
                <SelectContent>
                  {MOVEMENT_CHOICES.map((move) => (
                    <SelectItem key={move} value={move}>
                      {move}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetDialogState}>
              Cancel
            </Button>
            <Button
              className="bg-neon-teal text-black hover:bg-neon-teal/80"
              onClick={handleDialogConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Executing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};