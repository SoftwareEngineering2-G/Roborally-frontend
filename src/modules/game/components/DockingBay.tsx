"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export interface DockingBayPlayer {
  id: string;
  username: string;
  color: string;
  isReady: boolean;
  dockingPosition: { x: number; y: number } | null;
}

interface DockingBayProps {
  players: DockingBayPlayer[];
  currentPlayer: string | null;
  onReadyToggle: () => void;
  onDockingPositionSelect: (x: number, y: number) => void;
}

// Docking bay is a smaller 4x2 grid
const DOCK_WIDTH = 4;
const DOCK_HEIGHT = 2;

const PlayerIcon = ({ direction }: { direction: string }) => {
  return (
    <Image
      src="/assets/robots/robot-north.svg"
      alt="Robot in dock"
      width={20}
      height={20}
      className="pointer-events-none"
    />
  );
};

const DockingCell = ({ 
  x, 
  y, 
  player, 
  isHovered,
  isCurrentPlayerSelecting,
  onClick,
  onMouseEnter,
  onMouseLeave 
}: {
  x: number;
  y: number;
  player?: DockingBayPlayer;
  isHovered: boolean;
  isCurrentPlayerSelecting: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <div
      className={`
        w-12 h-12 relative border border-gray-300 
        ${isCurrentPlayerSelecting ? 'cursor-pointer hover:bg-blue-100' : ''}
        ${isHovered && isCurrentPlayerSelecting ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'}
        ${player ? 'border-2' : ''}
        transition-all duration-200
      `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={`Docking position (${x},${y})`}
    >
      {/* Cell background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200"></div>
      </div>
      
      {/* Grid lines for that board game feel */}
      <div className="absolute inset-0 border-r border-b border-gray-200 opacity-30"></div>
      
      {/* Player robot if positioned here */}
      {player && (
        <div className={`
          absolute inset-1 ${player.color} 
          rounded-full border-2 border-white 
          flex items-center justify-center 
          shadow-lg z-10
        `}>
          <PlayerIcon direction="north" />
        </div>
      )}
      
      {/* Available slot indicator */}
      {!player && isCurrentPlayerSelecting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded-full opacity-50"></div>
        </div>
      )}
    </div>
  );
};

export const DockingBay = ({ 
  players, 
  currentPlayer, 
  onReadyToggle, 
  onDockingPositionSelect 
}: DockingBayProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  
  const currentPlayerData = players.find(p => p.username === currentPlayer);
  const isSelectingPosition = currentPlayerData && !currentPlayerData.dockingPosition;

  // Create docking grid with player positions
  const createDockingGrid = () => {
    const grid = [];
    for (let y = 0; y < DOCK_HEIGHT; y++) {
      const row = [];
      for (let x = 0; x < DOCK_WIDTH; x++) {
        const playerAtPosition = players.find(p => 
          p.dockingPosition?.x === x && p.dockingPosition?.y === y
        );
        row.push({ x, y, player: playerAtPosition });
      }
      grid.push(row);
    }
    return grid;
  };

  const dockingGrid = createDockingGrid();

  const handleCellClick = (x: number, y: number) => {
    if (!isSelectingPosition) return;
    
    // Check if position is already taken
    const isOccupied = players.some(p => 
      p.dockingPosition?.x === x && p.dockingPosition?.y === y
    );
    
    if (!isOccupied) {
      onDockingPositionSelect(x, y);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚀 Robot Docking Bay
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Position your robot in the docking bay. Robots will deploy to the main board when the game starts.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Docking Bay Grid */}
          <div className="bg-gray-900 p-3 rounded-lg shadow-lg border-2 border-gray-700">
            <div className="mb-2 text-center">
              <Badge variant="outline" className="text-xs">Docking Bay</Badge>
            </div>
            <div className="inline-block">
              {dockingGrid.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell) => (
                    <DockingCell
                      key={`${cell.x}-${cell.y}`}
                      x={cell.x}
                      y={cell.y}
                      player={cell.player}
                      isHovered={hoveredCell?.x === cell.x && hoveredCell?.y === cell.y}
                      isCurrentPlayerSelecting={!!isSelectingPosition}
                      onClick={() => handleCellClick(cell.x, cell.y)}
                      onMouseEnter={() => setHoveredCell({ x: cell.x, y: cell.y })}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Player Status List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Player Status:</h3>
            {players.map((player) => (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-2 rounded border ${
                  player.username === currentPlayer ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${player.color}`}></div>
                  <span className="text-sm font-medium">{player.username}</span>
                  {player.username === currentPlayer && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={player.dockingPosition ? "default" : "outline"}
                    className="text-xs"
                  >
                    {player.dockingPosition ? "🤖 Docked" : "📍 Positioning"}
                  </Badge>
                  <Badge 
                    variant={player.isReady ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {player.isReady ? "✅ Ready" : "⏳ Preparing"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Current Player Controls */}
          {currentPlayerData && (
            <div className="border-t pt-4">
              <div className="flex gap-3">
                <Button
                  onClick={onReadyToggle}
                  variant={currentPlayerData.isReady ? "destructive" : "default"}
                  disabled={!currentPlayerData.dockingPosition}
                  className="flex-1"
                >
                  {currentPlayerData.isReady ? "Cancel Ready" : "Ready for Deployment"}
                </Button>
              </div>
              
              {isSelectingPosition && (
                <p className="text-sm text-muted-foreground mt-2">
                  Click on an empty slot in the docking bay to position your robot
                </p>
              )}
              
              {!currentPlayerData.dockingPosition && (
                <p className="text-sm text-orange-600 mt-2">
                  ⚠️ You must position your robot in the docking bay before marking ready
                </p>
              )}
            </div>
          )}

          {/* Game Status */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span>Players Docked: {players.filter(p => p.dockingPosition).length}/{players.length}</span>
              <span>Ready for Launch: {players.filter(p => p.isReady).length}/{players.length}</span>
            </div>
            {players.every(p => p.isReady && p.dockingPosition) && (
              <div className="mt-2 text-center">
                <Badge className="bg-green-600">🚀 All Robots Ready - Deploying to Battle Arena!</Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};