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
import { useLobbySignalREffects } from "@/redux/lobby/signalREffects";
import {
  selectLobbyState,
  selectLobbyPlayers,
  selectIsHost,
  selectAllPlayersReady,
  selectCanStartGame,
  setCurrentPlayerReady,
  clearLobbyState,
  LobbyState,
} from "@/redux/lobby/lobbySlice";
import { RootState, AppDispatch } from "@/redux/store";
import { LobbyHeader, PlayersGrid, GameControls, GameInfo } from "./components";

interface User {
  id: string;
  username: string;
}
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

  useLobbySignalREffects({
    gameId,
    username: username || undefined,
    enabled: !!username && lobbyState.isInitialized && !error,
    onGameStarted: (gameId: string) => {
      router.push(`/game/${gameId}`);
    },
  });

  if (isLoading || !username) return <LobbyLoadingSkeleton />;
  if (error && "status" in error && (error as any).status === 403) {
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

  const handleToggleReady = async () => {
    // TODO: No toggle ready implemented yet
  };

  const handleStartGame = async () => {
    // TODO: No start game implemented yet
    if (!username || !isHost || isStartingGame || !lobbyData) return;
    await startGame({ gameId: lobbyData.gameId, username });
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(lobbyData.gameId);
    toast.success("Room key copied!");
  };

  return (
    <div className="min-h-screen bg-background">
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
              onToggleReady={handleToggleReady}
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
