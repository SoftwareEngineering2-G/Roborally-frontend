"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetLobbyInfoQuery } from "@/redux/api/lobby/lobbyApi";
import {
  LobbyLoadingSkeleton,
  LobbyErrorState,
} from "@/components/lobby/lobby-skeleton";
import { useLobbySignalR, useSignalRConnection } from "@/hooks/signalr";
import {
  UserJoinedLobbyEvent,
  UserLeftLobbyEvent,
  PlayerReadyEvent,
  GameStartedEvent,
  LobbyUpdatedEvent,
} from "@/types/signalr";
import { LobbyHeader, PlayersGrid, GameControls, GameInfo } from "./components";

// Data types
interface Player {
  id: string;
  username: string;
  isReady: boolean;
}

interface User {
  id: string;
  username: string;
}

interface Props {
  gameId: string;
}

export const Lobby = ({ gameId }: Props) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [currentPlayerReady, setCurrentPlayerReady] = useState(true); // Default to ready
  const [realtimePlayers, setRealtimePlayers] = useState<Player[]>([]);

  // SignalR connection status
  const signalRConnection = useSignalRConnection();

  // Get username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  // Fetch lobby data
  const {
    data: lobbyData,
    error,
    isLoading,
    refetch,
  } = useGetLobbyInfoQuery(
    { gameId, username: username || "" },
    { skip: !username }
  );

  // SignalR lobby integration - only join if lobby data fetch was successful
  const signalRLobby = useLobbySignalR(
    gameId,
    {
      onUserJoined: (event: UserJoinedLobbyEvent) => {
        toast.success(`${event.username} joined the battle arena!`, {
          description: "A new robot has entered the lobby",
        });

        // Add new player directly to the realtime players list
        setRealtimePlayers((prev) => {
          // Avoid duplicates
          if (prev.some((p) => p.username === event.username)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: event.username,
              username: event.username,
              isReady: true, // Default new players to ready
            },
          ];
        });
      },

      onUserLeft: (event: UserLeftLobbyEvent) => {
        toast.info(`${event.username} left the arena`, {
          description: "A robot has disconnected from the lobby",
        });

        // Remove player directly from the realtime players list
        setRealtimePlayers((prev) =>
          prev.filter((player) => player.username !== event.username)
        );
      },

      onPlayerReady: (event: PlayerReadyEvent) => {
        const readyText = event.isReady ? "ready" : "not ready";
        toast(`${event.username} is ${readyText}`, {
          description: event.isReady
            ? "Robot systems online"
            : "Robot going offline",
        });

        // Update specific player's ready state
        setRealtimePlayers((prev) =>
          prev.map((player) =>
            player.username === event.username
              ? { ...player, isReady: event.isReady }
              : player
          )
        );
      },

      onGameStarted: (event: GameStartedEvent) => {
        toast.success("Battle commencing!", {
          description: `Game started by ${event.startedBy}`,
        });

        // Navigate to game after a short delay
        setTimeout(() => {
          router.push(`/lobby/${gameId}/game`);
        }, 2000);
      },

      onLobbyUpdated: (event: LobbyUpdatedEvent) => {
        // Handle general lobby updates
        refetch();
      },
    },
    {
      username: username || undefined,
      enabled:
        !!username && signalRConnection.isConnected && !!lobbyData && !error,
    }
  );

  // Transform API data to component format
  const user: User | null = username
    ? {
        id: username, // Using username as ID since API doesn't provide separate IDs
        username: username,
      }
    : null;

  // Transform players from API data, preferring real-time data
  const players: Player[] =
    realtimePlayers.length > 0
      ? realtimePlayers // Use real-time data from SignalR
      : lobbyData // Fallback to API data
      ? lobbyData.joinedUsernames.map((name) => ({
          id: name, // Using username as ID
          username: name,
          isReady: true, // Default everyone to ready as requested
        }))
      : [];

  // Sync real-time players with initial API data
  useEffect(() => {
    if (lobbyData && realtimePlayers.length === 0) {
      const initialPlayers = lobbyData.joinedUsernames.map((name) => ({
        id: name,
        username: name,
        isReady: true, // Default everyone to ready
      }));
      setRealtimePlayers(initialPlayers);
    }
  }, [lobbyData, realtimePlayers.length]);

  // Handle 403 error (access denied)
  useEffect(() => {
    if (error && "status" in error && error.status === 403) {
      // Don't redirect immediately, show error state first
      return;
    }

    if (!user) {
      return; // Already handled in the username effect
    }

    // TODO: Add game started check when API provides this data
    // if (lobbyData?.gameStarted) {
    //   router.push(`/lobby/${lobbyData.gameId}/game`);
    // }
  }, [user, router, error]);

  // Show loading state
  if (isLoading || !username) {
    return <LobbyLoadingSkeleton />;
  }

  // Handle 403 error
  if (error && "status" in error && error.status === 403) {
    return (
      <LobbyErrorState
        message="Your robot doesn't have clearance for this battle arena. This lobby may be private or you might not be authorized to join."
        onRetry={() => {
          router.push("/"); // Redirect to home
        }}
      />
    );
  }

  // Handle other errors
  if (error) {
    return (
      <LobbyErrorState
        message="Failed to connect to the robot command center. The arena servers might be down."
        onRetry={() => refetch()}
      />
    );
  }

  // If no lobby data, show error
  if (!lobbyData || !user) {
    return (
      <LobbyErrorState
        message="Battle arena not found. It may have been destroyed or moved to another sector."
        onRetry={() => router.push("/")}
      />
    );
  }

  const handleToggleReady = async () => {
    if (!user || !lobbyData) return;

    const newReadyState = !currentPlayerReady;
    setCurrentPlayerReady(newReadyState);

    // Send ready state via SignalR if connected
    if (signalRConnection.isConnected && signalRLobby) {
      try {
        await signalRLobby.setPlayerReady(newReadyState);
      } catch (error) {
        // If SignalR fails, revert the local state
        setCurrentPlayerReady(!newReadyState);
        toast.error("Failed to update ready status", {
          description: "Connection issue with the battle arena",
        });
        return;
      }
    }

    toast(newReadyState ? "Ready to play!" : "Ready status removed", {
      description: newReadyState
        ? "Waiting for other players and host to start"
        : "You are no longer ready to start the game",
    });
  };

  const handleStartGame = async () => {
    if (!lobbyData || !user || lobbyData.hostUsername !== user.username) return;

    const allPlayersReady = players.every(
      (p) =>
        (p.id === user.id ? currentPlayerReady : p.isReady) ||
        p.id === lobbyData.hostUsername
    );
    const minPlayers = players.length >= 2;

    if (!minPlayers) {
      toast.error("Not enough players", {
        description: "At least 2 players are required to start the game",
      });
      return;
    }

    if (!allPlayersReady) {
      toast.error("Players not ready", {
        description: "All players must be ready before starting",
      });
      return;
    }

    // Send start game via SignalR if connected
    if (signalRConnection.isConnected && signalRLobby) {
      try {
        await signalRLobby.startGame();
        toast.success("Game Starting!", {
          description: "Initializing RoboRally battle...",
        });
        return; // SignalR will handle navigation via the event
      } catch (error) {
        toast.error("Failed to start game", {
          description: "Connection issue with the battle arena",
        });
        return;
      }
    }

    // Fallback to simulated game start if SignalR not available
    toast.success("Game Starting!", {
      description: "Initializing RoboRally battle...",
    });

    // Simulate game start
    setTimeout(() => {
      router.push(`/lobby/${lobbyData.gameId}/game`);
    }, 2000);
  };

  const copyRoomKey = () => {
    // Hardcoded room key since API doesn't provide it yet
    const roomKey = "RALLY2024";
    navigator.clipboard.writeText(roomKey);
    toast.success("Room key copied!", {
      description: "Share this key with friends to join",
    });
  };

  // Component state calculations
  const isHost = lobbyData?.hostUsername === user?.username;
  const currentPlayer = players.find((p) => p.id === user?.id);
  const allPlayersReady = players.every(
    (p) =>
      (p.id === user?.id ? currentPlayerReady : p.isReady) ||
      p.id === lobbyData?.hostUsername
  );
  const canStart = players.length >= 2 && allPlayersReady && isHost;

  // Hardcoded values for UI elements not available in API yet
  const maxPlayers = 6;
  const isPrivate = true; // Hardcoded for now
  const lobbyKey = "RALLY2024"; // Hardcoded for now

  return (
    <div className="min-h-screen bg-background">
      <LobbyHeader
        lobbyName={lobbyData.lobbyname}
        gameId={lobbyData.gameId}
        playerCount={players.length}
        maxPlayers={maxPlayers}
        isPrivate={isPrivate}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Players List */}
          <div className="lg:col-span-2">
            <PlayersGrid
              players={players}
              maxPlayers={maxPlayers}
              hostUsername={lobbyData.hostUsername}
              currentUserId={user.id}
              currentPlayerReady={currentPlayerReady}
            />
          </div>

          {/* Game Controls */}
          <div className="space-y-6">
            <GameControls
              isHost={isHost}
              currentPlayerReady={currentPlayerReady}
              players={players}
              canStart={canStart}
              allPlayersReady={allPlayersReady}
              isPrivate={isPrivate}
              gameId={lobbyData.gameId}
              onToggleReady={handleToggleReady}
              onStartGame={handleStartGame}
              onCopyRoomKey={copyRoomKey}
            />

            {/* Game Info */}
            <GameInfo maxPlayers={maxPlayers} />
          </div>
        </div>
      </div>
    </div>
  );
};
