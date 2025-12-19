"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, ArrowLeft, Users, Pause } from "lucide-react";
import { AudioControls } from "@/modules/audio/components/AudioControls";

interface LobbyHeaderProps {
  lobbyName: string;
  gameId: string;
  playerCount: number;
  maxPlayers: number;
  isPrivate: boolean;
  isPausedGame?: boolean;
  onLeaveLobby?: () => Promise<void>;
}

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 20
 */
export const LobbyHeader = ({
  lobbyName,
  gameId,
  playerCount,
  maxPlayers,
  isPrivate,
  isPausedGame = false,
  onLeaveLobby,
}: LobbyHeaderProps) => {
  const router = useRouter();

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 31
 */
  const copyRoomKey = () => {
    navigator.clipboard.writeText(gameId);
    toast.success("Room key copied!", {
      description: "Share this key with friends to join",
    });
  };

  const handleBackToHome = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave the lobby? You will be disconnected."
    );
    if (confirmed) {
      try {
        if (onLeaveLobby) {
          await onLeaveLobby();
        }
      } catch (error) {
        console.error("Error leaving lobby:", error);
      } finally {
        router.push("/");
      }
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-primary">{lobbyName}</h1>
          {isPausedGame && (
            <Badge
              variant="secondary"
              className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
            >
              <Pause className="w-3 h-3 mr-1" />
              Resuming
            </Badge>
          )}
          {isPrivate && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={copyRoomKey}
            >
              <Copy className="w-3 h-3 mr-1" />
              {gameId}
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary">
          <Users className="w-3 h-3 mr-1" />
          {playerCount}/{maxPlayers}
        </Badge>
        <div className="ml-4">
          <AudioControls />
        </div>
      </div>
    </header>
  );
};