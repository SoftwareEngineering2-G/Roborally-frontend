"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJoinLobbyMutation } from "@/redux/api/lobby/lobbyApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCurrentRoom } from "@/redux/game/gameSlice";
import { showErrorToast } from "@/lib/toast-handler";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";

interface JoinLobbyDialogProps {
  username: string;
  trigger?: React.ReactNode;
}

export const JoinLobbyDialog = ({
  username,
  trigger,
}: JoinLobbyDialogProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [joinLobby] = useJoinLobbyMutation();

  const [privateKey, setPrivateKey] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinPrivateRoom = async () => {
    if (!username || privateKey.trim().length !== 6) return;

    try {
      const room = await joinLobby({
        gameId: privateKey.trim().toUpperCase(),
        username,
      }).unwrap();

      dispatch(setCurrentRoom(room));
      setShowDialog(false);
      setPrivateKey("");
      router.push(`/room/${room.id}`);
    } catch {
      showErrorToast("Invalid room key", "Room not found or is full");
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Key className="w-4 h-4 mr-2" />
      Join Private Room
    </Button>
  );

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="glass-panel border-neon-magenta/30">
        <DialogHeader>
          <DialogTitle>Join Private Room</DialogTitle>
          <DialogDescription>
            Enter the 6-character room key to join a private game
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Label htmlFor="privateKey">Room Key</Label>
          <Input
            id="privateKey"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            maxLength={6}
            className="uppercase"
            placeholder="ABC123"
          />
          <Button
            onClick={handleJoinPrivateRoom}
            disabled={privateKey.trim().length !== 6}
            className="w-full"
          >
            Join Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
