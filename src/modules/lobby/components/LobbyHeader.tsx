"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, ArrowLeft, Users } from "lucide-react";

interface LobbyHeaderProps {
  lobbyName: string;
  gameId: string;
  playerCount: number;
  maxPlayers: number;
  isPrivate: boolean;
}

export const LobbyHeader = ({
  lobbyName,
  gameId,
  playerCount,
  maxPlayers,
  isPrivate,
}: LobbyHeaderProps) => {
  const router = useRouter();

  const copyRoomKey = () => {
    navigator.clipboard.writeText(gameId);
    toast.success("Room key copied!", {
      description: "Share this key with friends to join",
    });
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-primary">{lobbyName}</h1>
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
      </div>
    </header>
  );
};
