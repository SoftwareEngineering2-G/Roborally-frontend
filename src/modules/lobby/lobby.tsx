"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useGetLobbyInfoQuery,
  useStartGameMutation,
  useLeaveLobbyMutation,
  useContinueGameMutation,
} from "@/redux/api/lobby/lobbyApi";
import { LobbyLoadingSkeleton, LobbyErrorState } from "@/components/lobby/lobby-skeleton";
import { baseApi } from "@/redux/api/baseApi";
import {
  selectLobbyState,
  selectLobbyPlayers,
  selectIsHost,
  selectAllPlayersReady,
  selectCanStartGame,
  selectMissingRequiredPlayers,
  selectIsPausedGame,
  clearLobbyState,
  type LobbyState,
  selectGamePausedBoardName,
} from "@/redux/lobby/lobbySlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { LobbyHeader, PlayersGrid, GameControls, GameInfo } from "./components";
import { useLobbySignalR } from "./hooks/useLobbySignalR";
import { useAudio } from "@/modules/audio/AudioContext";

interface Props {
  gameId: string;
}

export const Lobby = ({ gameId }: Props) => {
  console.log("[Lobby] Rendered with gameId:", gameId);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState<string | null>(null);
  const [isNavigatingToGame, setIsNavigatingToGame] = useState(false);

  console.log("[Lobby] Current username state:", username);

  const lobbyState: LobbyState = useSelector((state: RootState) => selectLobbyState(state));
  const players = useSelector((state: RootState) => selectLobbyPlayers(state));
  const isHost = useSelector((state: RootState) =>
    username ? selectIsHost(state, username) : false
  );
  const hostUsername = useSelector((state: RootState) => state.lobby.hostUsername);
  const allPlayersReady = useSelector((state: RootState) => selectAllPlayersReady(state));
  const canStart = useSelector((state: RootState) =>
    username ? selectCanStartGame(state, username) : false
  );
  const missingPlayers = useSelector((state: RootState) => selectMissingRequiredPlayers(state));
  const isPausedGame = useSelector((state: RootState) => selectIsPausedGame(state));
  const gamePausedBoardName = useSelector((state: RootState) => selectGamePausedBoardName(state));

  const [selectedBoard, setSelectedBoard] = useState<string>(
    isPausedGame && gamePausedBoardName ? gamePausedBoardName : "Starter Course"
  );

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  const { playBGM, stopBGM } = useAudio();

  useEffect(() => {
    const startLobbyMusic = async () => {
      try {
        await playBGM("lobby");
      } catch {
        console.warn("Failed to autoplay lobby music. User interaction may be required.");
      }
    };
    
    startLobbyMusic();
    
    return () => {
      stopBGM();
    };
  }, [playBGM, stopBGM]);

  useEffect(() => {
    return () => {
      dispatch(clearLobbyState());
    };
  }, [dispatch]);

  const {
    data: lobbyData,
    error,
    isLoading,
    refetch,
  } = useGetLobbyInfoQuery(
    { gameId, username: username || "" },
    {
      skip: !username || !gameId,
      refetchOnMountOrArgChange: true,
    }
  );

  const [startGame, { isLoading: isStartingGame }] = useStartGameMutation();
  const [continueGame, { isLoading: isContinuingGame }] = useContinueGameMutation();
  const [leaveLobby] = useLeaveLobbyMutation();

  // Simple SignalR connection - Redux dispatching is handled in the hook
  const signalR = useLobbySignalR(gameId);

  const handleLeaveLobby = async () => {
    if (!username) return;

    try {
      await leaveLobby({ gameId, username: username || "" }).unwrap();
    } catch (error) {
      console.error("Failed to leave lobby:", error);
    } finally {
      dispatch(clearLobbyState());
    }
  };

  // Handle game started navigation
  useEffect(() => {
    if (!signalR.isConnected) return;

    signalR.on("GameStarted", () => {
      setIsNavigatingToGame(true);
      dispatch(baseApi.util.invalidateTags([{ type: "Game", id: gameId }]));
      router.push(`/game/${gameId}`);
    });

    signalR.on("GameContinued", () => {
      setIsNavigatingToGame(true);
      dispatch(baseApi.util.invalidateTags([{ type: "Game", id: gameId }]));
      router.push(`/game/${gameId}`);
    });

    return () => {
      signalR.off("GameStarted");
      signalR.off("GameContinued");
    };
  }, [signalR, router, gameId, dispatch]);

  if (isLoading || !username) return <LobbyLoadingSkeleton />;

  // Don't show error if we're navigating to game (player already left lobby)
  if (isNavigatingToGame) return <LobbyLoadingSkeleton />;

  if (error && "status" in error && (error as { status: number }).status === 403) {
    return <LobbyErrorState message="Access denied." onRetry={() => router.push("/")} />;
  }
  if (error) return <LobbyErrorState message="Connection failed." onRetry={() => refetch?.()} />;
  if (!lobbyData || !username)
    return <LobbyErrorState message="Lobby not found." onRetry={() => router.push("/")} />;

  const handleStartGame = async () => {
    if (!username || !isHost || isStartingGame || !lobbyData || !selectedBoard) return;

    try {
      // Only use REST API - backend will broadcast GameStarted event via SignalR
      await startGame({ gameId: lobbyData.gameId, username, gameBoardName: selectedBoard });
      setIsNavigatingToGame(true);
      toast.success(`Starting game with ${selectedBoard}!`);
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start game");
    }
  };

  const handleContinueGame = async () => {
    if (!username || !isHost || isContinuingGame || !lobbyData) return;

    try {
      // Only use REST API - backend will broadcast GameContinued event via SignalR
      await continueGame({ gameId: lobbyData.gameId, username }).unwrap();
      setIsNavigatingToGame(true);
      toast.success("Continuing game...");
    } catch (error) {
      console.error("Failed to continue game:", error);
      toast.error("Failed to continue game");
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
                {signalR.isConnecting ? "Connecting to lobby..." : "Not connected to lobby"}
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
        isPausedGame={isPausedGame}
        onLeaveLobby={handleLeaveLobby}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PlayersGrid
              players={players}
              maxPlayers={6}
              hostUsername={hostUsername || ""}
              currentPlayerReady={lobbyState.currentPlayerReady}
              requiredPlayers={lobbyState.requiredPlayers}
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
              selectedBoard={selectedBoard}
              onBoardChange={setSelectedBoard}
              isPausedGame={isPausedGame}
              missingPlayers={missingPlayers}
              onStartGame={handleStartGame}
              onContinueGame={handleContinueGame}
              onCopyGameId={copyGameId}
            />
            <GameInfo maxPlayers={6} />
          </div>
        </div>
      </div>
    </div>
  );
};
