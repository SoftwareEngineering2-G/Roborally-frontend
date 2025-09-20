"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useJoinLobbyMutation } from "@/redux/api/lobby/lobbyApi";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Key } from "lucide-react";

// UUID validation schema
const formSchema = z.object({
  gameId: z.string().uuid("Invalid game ID format").trim(),
});

type FormData = z.infer<typeof formSchema>;

interface JoinLobbyDialogProps {
  username: string;
  trigger?: React.ReactNode;
}

export const JoinLobbyDialog = ({
  username,
  trigger,
}: JoinLobbyDialogProps) => {
  const router = useRouter();
  const [joinLobby, { isLoading, isSuccess }] = useJoinLobbyMutation();

  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await joinLobby({
        gameId: data.gameId,
        username,
      });
    } catch {
      showErrorToast("Invalid room key", "Room not found or is full");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowDialog(false);
      router.push(`/lobby/${form.getValues("gameId")}`);
      form.reset();
    }
  }, [isSuccess, router, form]);

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
            Enter the game ID to join a private room
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-chrome-light font-medium">
                    Game ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter game ID (UUID format)"
                      className="bg-surface-dark border-neon-magenta/30 focus:border-neon-magenta focus:ring-neon-magenta text-foreground placeholder:text-metallic"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-secondary hover:glow-magenta"
            >
              {isLoading ? "Joining..." : "Join Room"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
