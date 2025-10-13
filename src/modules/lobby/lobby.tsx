"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useGetLobbyInfoQuery,
  useStartGameMutation,
} from "@/redux/api/lobby/lobbyApi";
import {
  LobbyLoadingSkeleton,
  LobbyErrorState,
} from "@/components/lobby/lobby-skeleton";
import {
  selectLobbyState,
  selectLobbyPlayers,
  selectIsHost,
  selectAllPlayersReady,
  selectCanStartGame,
  clearLobbyState,
  LobbyState,
} from "@/redux/lobby/lobbySlice";
import { RootState, AppDispatch } from "@/redux/store";
import { LobbyHeader, PlayersGrid, GameControls, GameInfo } from "./components";
import { useLobbySignalR } from "./hooks/useLobbySignalR";

interface Props {
  gameId: string;
}

export const Lobby = ({ gameId }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState<string | null>(null);

  const lobbyState: LobbyState = useSelector((state: RootState) =>
    selectLobbyState(state)
  );
  const players = useSelector((state: RootState) => selectLobbyPlayers(state));
  const isHost = useSelector((state: RootState) =>
    username ? selectIsHost(state, username) : false
  );
  const allPlayersReady = useSelector((state: RootState) =>
    selectAllPlayersReady(state)
  );
  const canStart = useSelector((state: RootState) =>
    username ? selectCanStartGame(state, username) : false
  );

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  useEffect(() => {
    return () => {
      dispatch(clearLobbyState());
    };
  }, [dispatch, gameId]);

  const {
    data: lobbyData,
    error,
    isLoading,
    refetch,
  } = useGetLobbyInfoQuery(
    { gameId, username: username || "" },
    { skip: !username }
  );

  const [startGame, { isLoading: isStartingGame }] = useStartGameMutation();

  // Simple SignalR connection - Redux dispatching is handled in the hook
  const signalR = useLobbySignalR(gameId);

  // Handle game started navigation
  useEffect(() => {
    if (!signalR.isConnected) return;

    signalR.on("GameStarted", () => {
      router.push(`/game/${gameId}`);
    });

    return () => {
      signalR.off("GameStarted");
    };
  }, [signalR, router, gameId]);

  if (isLoading || !username) return <LobbyLoadingSkeleton />;
  if (error && "status" in error && (error as { status: number }).status === 403) {
    return (
      <LobbyErrorState
        message="Access denied."
        onRetry={() => router.push("/")}
      />
    );
  }
  if (error)
    return (
      <LobbyErrorState
        message="Connection failed."
        onRetry={() => refetch?.()}
      />
    );
  if (!lobbyData || !username)
    return (
      <LobbyErrorState
        message="Lobby not found."
        onRetry={() => router.push("/")}
      />
    );

  const handleStartGame = async () => {
    if (!username || !isHost || isStartingGame || !lobbyData) return;

    try {
      // Only use REST API - backend will broadcast GameStarted event via SignalR
      await startGame({ gameId: lobbyData.gameId, username, gameBoardName: "Board With Walls" });
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start game");
    }
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(lobbyData.gameId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple SignalR Connection Status */}
      {!signalR.isConnected && (
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {signalR.isConnecting
                  ? "Connecting to lobby..."
                  : "Not connected to lobby"}
                {signalR.error && ` - Error: ${signalR.error}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <LobbyHeader
        lobbyName={lobbyData.lobbyname}
        gameId={lobbyData.gameId}
        playerCount={players.length}
        maxPlayers={6}
        isPrivate={true}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PlayersGrid
              players={players}
              maxPlayers={6}
              hostUsername={lobbyData.hostUsername}
              currentPlayerReady={lobbyState.currentPlayerReady}
            />
          </div>
          <div className="space-y-6">
            <GameControls
              isHost={isHost}
              currentPlayerReady={lobbyState.currentPlayerReady}
              players={players}
              canStart={canStart}
              allPlayersReady={allPlayersReady}
              isPrivate={true}
              gameId={lobbyData.gameId}
              onStartGame={handleStartGame}
              onCopyGameId={copyGameId}
            />
            <GameInfo maxPlayers={6} />
          </div>
        </div>
      </div>
    </div>
  );
};
