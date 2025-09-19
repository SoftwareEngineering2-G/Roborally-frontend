"use client";

import { useState } from "react";
import { useCreateLobbyMutation } from "@/redux/api/lobby/lobbyApi";
import { showSuccessToast, showErrorToast } from "@/lib/toast-handler";

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
import { Switch } from "@/components/ui/switch";
import { Plus, Lock } from "lucide-react";

interface CreateRoomDialogProps {
  username: string;
  trigger?: React.ReactNode;
}

export const CreateRoomDialog = ({
  username,
  trigger,
}: CreateRoomDialogProps) => {
  const [createLobby, { isLoading: creating }] = useCreateLobbyMutation();

  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleCreateRoom = async () => {
    if (!username || !roomName.trim()) return;

    try {
      const response = await createLobby({
        hostUsername: username,
        gameRoomName: roomName.trim(),
        isPrivate,
      }).unwrap();

      showSuccessToast(
        "Room created!",
        isPrivate ? `Room key: ${response.gameRoomId}` : "Players can now join"
      );

      console.log(
        "Room created with id:",
        response.gameRoomId,
        "and room name:",
        roomName
      );

      // Reset form and close dialog
      setShowDialog(false);
      setRoomName("");
      setIsPrivate(false);
    } catch (err) {
      console.error("Error creating lobby:", err);
      showErrorToast("Failed to create room", "Something went wrong");
    }
  };

  const defaultTrigger = (
    <Button className="w-full bg-gradient-primary" disabled={creating}>
      <Plus className="w-4 h-4 mr-2" />
      Create Room
    </Button>
  );

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="glass-panel border-neon-teal/30">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Set up a new game room for your RoboRally adventure
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="bg-surface-dark border-neon-teal/30 focus:border-neon-teal focus:ring-neon-teal"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              id="private"
            />
            <Label
              htmlFor="private"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Private Room</span>
            </Label>
          </div>

          <Button
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || creating}
            className="w-full bg-gradient-secondary hover:glow-magenta"
          >
            {creating ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
