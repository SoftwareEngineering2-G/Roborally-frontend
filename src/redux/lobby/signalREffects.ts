import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useLobbySignalR, useSignalRConnection } from "@/hooks/signalr";
import { userJoinedLobby, userLeftLobby } from "@/redux/lobby/lobbySlice";
import {
  UserJoinedLobbyEvent,
  UserLeftLobbyEvent,
  GameStartedEvent,
} from "@/types/signalr";
import { AppDispatch } from "@/redux/store";

interface LobbySignalREffectsOptions {
  gameId: string | null;
  username?: string;
  enabled?: boolean;
  onGameStarted?: (gameId: string) => void; // For navigation callback
}

/**
 * This hook connects SignalR events to Redux actions
 * It acts as a bridge between SignalR and the Redux store
 * Components don't need to know about SignalR - they just subscribe to Redux state
 */
export function useLobbySignalREffects({
  gameId,
  username,
  enabled = true,
  onGameStarted,
}: LobbySignalREffectsOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const signalRConnection = useSignalRConnection();

  // Set up SignalR listeners that dispatch Redux actions
  const signalRLobby = useLobbySignalR(
    gameId,
    {
      onUserJoined: (event: UserJoinedLobbyEvent) => {
        // Dispatch Redux action
        dispatch(userJoinedLobby({ username: event.username }));

        // Show toast notification
        toast.success(`${event.username} joined the battle arena!`, {
          description: "A new robot has entered the lobby",
        });
      },

      onUserLeft: (event: UserLeftLobbyEvent) => {
        // Dispatch Redux action
        dispatch(userLeftLobby({ username: event.username }));

        // Show toast notification
        toast.info(`${event.username} left the arena`, {
          description: "A robot has disconnected from the lobby",
        });
      },

      onGameStarted: (event: GameStartedEvent) => {
        toast.success("Battle commencing!", {
          description: `Game has started. Good luck!`,
        });

        // Call navigation callback if provided
        if (onGameStarted && gameId) {
          setTimeout(() => {
            onGameStarted(gameId);
          }, 2000);
        }
      },
    },
    {
      username,
      enabled: enabled && !!username && signalRConnection.isConnected,
    }
  );

  return {
    // Connection state
    isConnected: signalRConnection.isConnected,
    isInGroup: signalRLobby?.isInGroup,
    groupError: signalRLobby?.groupError,
    sendError: signalRLobby?.sendError,
  };
}
