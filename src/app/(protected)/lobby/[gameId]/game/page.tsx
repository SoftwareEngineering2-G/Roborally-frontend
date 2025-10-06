"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameBoard, Player, DockingBay, DockingBayPlayer } from "@/modules/game/components";
import { useGetLobbyInfoQuery } from "@/redux/api/lobby/lobbyApi";
import { useLobbySignalR } from "@/hooks/signalr";
import { useSignalRContext } from "@/lib/signalr/SignalRProvider";
import {
  UserJoinedLobbyEvent,
  UserLeftLobbyEvent,
} from "@/types/signalr";

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [realtimePlayers, setRealtimePlayers] = useState<string[]>([]);
  
  // Game phase management
  const [gamePhase, setGamePhase] = useState<'docking' | 'playing'>('docking');
  const [dockingBayPlayers, setDockingBayPlayers] = useState<DockingBayPlayer[]>([]);

  // Get SignalR connection from context
  const signalRConnection = useSignalRContext();

  // Get current player from localStorage
  useEffect(() => {
    const username = localStorage.getItem("username");
    setCurrentPlayer(username);
  }, []);

  // Fetch initial lobby data to get player list
  const {
    data: lobbyData,
    error,
    isLoading,
    refetch,
  } = useGetLobbyInfoQuery(
    { gameId, username: currentPlayer || "" },
    { 
      skip: !currentPlayer,
      refetchOnMountOrArgChange: true, // Always refetch when component mounts
    }
  );

  // SignalR integration for real-time player updates
  const signalRLobby = useLobbySignalR(
    gameId,
    {
      onUserJoined: (event: UserJoinedLobbyEvent) => {
        console.log(`${event.username} joined the game`);
        setRealtimePlayers((prev) => {
          if (prev.includes(event.username)) return prev;
          const updated = [...prev, event.username];
          console.log("Updated realtime players (user joined):", updated);
          return updated;
        });
      },

      onUserLeft: (event: UserLeftLobbyEvent) => {
        console.log(`${event.username} left the game`);
        setRealtimePlayers((prev) => {
          const updated = prev.filter((username) => username !== event.username);
          console.log("Updated realtime players (user left):", updated);
          return updated;
        });
      },

      onPlayerReady: () => {
        // Not needed for game page
      },

      onGameStarted: () => {
        // Already in game, ignore
      },

      onLobbyUpdated: () => {
        // Refetch lobby data when lobby is updated
        console.log("Lobby updated, refetching data...");
        if (refetch) {
          refetch();
        }
      },
    },
    {
      username: currentPlayer || undefined,
      enabled: !!currentPlayer && signalRConnection.isConnected,
    }
  );

  // Convert lobby players to game players (initial load)
  useEffect(() => {
    if (lobbyData && lobbyData.joinedUsernames) {
      console.log("Loading initial players from lobby data:", lobbyData.joinedUsernames);
      setRealtimePlayers(lobbyData.joinedUsernames);
    }
  }, [lobbyData]);

  // Refetch lobby data when SignalR connection is established
  useEffect(() => {
    if (currentPlayer && signalRConnection.isConnected && refetch) {
      console.log("SignalR connected, refetching lobby data...");
      refetch();
    }
  }, [currentPlayer, signalRConnection.isConnected, refetch]);

  // Update game players when realtime players change
  useEffect(() => {
    console.log("Realtime players changed:", realtimePlayers);
    
    if (realtimePlayers.length > 0) {
      const gameColors = [
        "bg-blue-500",
        "bg-red-500", 
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500"
      ];

      // Create docking bay players for the docking phase
      const dockingPlayers: DockingBayPlayer[] = realtimePlayers.map((username, index) => ({
        id: `player_${index + 1}`,
        username: username,
        color: gameColors[index % gameColors.length],
        isReady: false,
        dockingPosition: null
      }));

      console.log("Setting docking bay players:", dockingPlayers);
      setDockingBayPlayers(dockingPlayers);

      // Only create game players if we're in playing phase
      if (gamePhase === 'playing') {
        // Use docking bay positions to determine starting positions on main board
        const gamePlayers: Player[] = dockingBayPlayers
          .filter(p => p.dockingPosition) // Only players who positioned in docking bay
          .map((dockingPlayer, index) => {
            // Map docking position to main board edge positions
            const edgePositions = [
              { x: 0, y: 5 }, { x: 0, y: 6 },  // Left edge
              { x: 11, y: 5 }, { x: 11, y: 6 }, // Right edge
              { x: 5, y: 0 }, { x: 6, y: 0 },  // Top edge
              { x: 5, y: 11 }, { x: 6, y: 11 } // Bottom edge
            ];
            
            return {
              id: dockingPlayer.id,
              username: dockingPlayer.username,
              color: dockingPlayer.color,
              position: edgePositions[index % edgePositions.length],
              health: 3,
              checkpoints: 0,
              direction: "east" as const
            };
          });

        console.log("Setting game players from docking bay:", gamePlayers);
        setPlayers(gamePlayers);
      }
    } else {
      console.log("No realtime players, clearing players");
      setDockingBayPlayers([]);
      setPlayers([]);
    }
  }, [realtimePlayers, gamePhase, dockingBayPlayers]);

  // Docking bay event handlers
  const handleReadyToggle = () => {
    if (!currentPlayer) return;
    
    setDockingBayPlayers(prev => 
      prev.map(p => 
        p.username === currentPlayer 
          ? { ...p, isReady: !p.isReady }
          : p
      )
    );
  };

  const handleDockingPositionSelect = (x: number, y: number) => {
    if (!currentPlayer) return;
    
    setDockingBayPlayers(prev =>
      prev.map(p =>
        p.username === currentPlayer
          ? { ...p, dockingPosition: { x, y } }
          : p
      )
    );
  };

  // Check if all players are ready to start the game
  useEffect(() => {
    if (dockingBayPlayers.length > 0 && 
        dockingBayPlayers.every(p => p.isReady && p.dockingPosition)) {
      console.log("All players ready, transitioning to playing phase");
      setGamePhase('playing');
    }
  }, [dockingBayPlayers]);

  // Loading state
  if (isLoading || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Game...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Game Error</h1>
          <p className="text-muted-foreground">Failed to load game data. Please try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🤖 RoboRally Battle Arena
        </h1>
        <p className="text-muted-foreground mt-2">
          Game ID: <code className="bg-muted px-2 py-1 rounded font-mono">{gameId}</code>
        </p>
        <Badge variant="outline" className="mt-2">
          {gamePhase === 'docking' ? '🚀 Robot Deployment Phase' : '🎮 Battle in Progress'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Game Board - Takes up most space */}
        <div className="xl:col-span-3">
          <GameBoard 
            players={players}
          />
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Show Docking Bay or Players List based on game phase */}
          {gamePhase === 'docking' ? (
            <DockingBay
              players={dockingBayPlayers}
              currentPlayer={currentPlayer}
              onReadyToggle={handleReadyToggle}
              onDockingPositionSelect={handleDockingPositionSelect}
            />
          ) : (
            /* Players List for playing phase */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Players ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-lg border-2 ${
                        player.username === currentPlayer
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${player.color}`}></div>
                          <span className="font-semibold">{player.username}</span>
                          {player.username === currentPlayer && (
                            <Badge variant="secondary" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ({player.position.x}, {player.position.y})
                        </div>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span>❤️ {player.health}</span>
                        <span>🏁 {player.checkpoints}</span>
                        <span>🧭 {player.direction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Info - Remove this in production */}
          <Card className="bg-gray-50 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">🐛 Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>Game Phase: {gamePhase}</div>
              <div>SignalR Connected: {signalRConnection.isConnected ? "✅" : "❌"}</div>
              <div>Current Player: {currentPlayer || "None"}</div>
              <div>Lobby Data: {lobbyData ? "✅" : "❌"}</div>
              <div>Realtime Players: [{realtimePlayers.join(", ")}]</div>
              <div>Docking Players: {dockingBayPlayers.length}</div>
              <div>Game Players: {players.length}</div>
              <div>Loading: {isLoading ? "Yes" : "No"}</div>
            </CardContent>
          </Card>

          {/* Players List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 Players ({players.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {players.map(player => (
                <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${player.color} rounded-full border-2 border-white shadow-sm`}></div>
                    <span className={`font-medium ${player.username === currentPlayer ? 'text-blue-600 font-bold' : ''}`}>
                      {player.username}
                      {player.username === currentPlayer && " (You)"}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">❤️ {player.health}</Badge>
                    <Badge variant="outline" className="text-xs">📍 {player.checkpoints}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Game Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Game Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Turn:</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phase:</span>
                  <Badge variant="secondary">Programming</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Next:</span>
                  <span className="text-muted-foreground">Execute moves</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Winner:</span>
                  <span className="text-muted-foreground">First to 3 checkpoints</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}