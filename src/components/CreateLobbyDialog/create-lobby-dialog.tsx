"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 27
 */
export const CreateLobbyDialog = ({
  username,
  trigger,
}: CreateRoomDialogProps) => {
  const router = useRouter();
  const [createLobby, { isLoading: creating, isSuccess, data }] =
    useCreateLobbyMutation();

  const [lobbyName, setLobbyName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Handle successful lobby creation with proper Next.js routing
  useEffect(() => {
    if (isSuccess && data?.gameRoomId) {
      // Reset form and close dialog
      setShowDialog(false);
      setLobbyName("");
      setIsPrivate(false);

      // Navigate using Next.js router
      router.push(`/lobby/${data.gameRoomId}`);

      showSuccessToast("Lobby created!", "Redirecting to your new lobby...");
    }
  }, [isSuccess, data, router]);

  const handleCreateLobby = async () => {
    if (!username || !lobbyName.trim()) return;

    try {
      await createLobby({
        hostUsername: username,
        gameRoomName: lobbyName.trim(),
        isPrivate,
      });
    } catch (err) {
      console.error("Error creating lobby:", err);
      showErrorToast("Failed to create lobby", "Something went wrong");
    }
  };

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 69
 */
  const defaultTrigger = (
    <Button className="w-full bg-gradient-primary" disabled={creating}>
      <Plus className="w-4 h-4 mr-2" />
      Create Lobby
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
            <Label htmlFor="lobbyName">Lobby Name</Label>
            <Input
              id="lobbyName"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              placeholder="Enter lobby name"
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
              <span>Private Lobby</span>
            </Label>
          </div>

          <Button
            onClick={handleCreateLobby}
            disabled={!lobbyName.trim() || creating}
            className="w-full bg-gradient-secondary hover:glow-magenta"
          >
            {creating ? "Creating..." : "Create Lobby"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};