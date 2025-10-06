"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Game board dimensions
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 12;

// Cell types
export type CellType = 'empty';

export interface BoardCell {
  type: CellType;
  hasPlayer?: boolean;
  playerId?: string;
  playerColor?: string;
}

export interface Player {
  id: string;
  username: string;
  color: string;
  position: { x: number; y: number };
  health: number;
  checkpoints: number;
  direction: 'north' | 'south' | 'east' | 'west';
}

interface GameBoardProps {
  players: Player[];
  onCellClick?: (x: number, y: number) => void;
  boardData?: BoardCell[][];
}

const PlayerIcon = ({ direction }: { direction: string }) => {
  const getImageSrc = (dir: string) => {
    switch (dir) {
      case 'north': return '/assets/robots/robot-north.svg';
      case 'south': return '/assets/robots/robot-south.svg';
      case 'east': return '/assets/robots/robot-east.svg';
      case 'west': return '/assets/robots/robot-west.svg';
      default: return '/assets/robots/robot-north.svg';
    }
  };

  return (
    <Image
      src={getImageSrc(direction)}
      alt={`Robot facing ${direction}`}
      width={24}
      height={24}
      className="pointer-events-none"
    />
  );
};

const CellBackground = ({ 
  isHovered = false
}: { 
  isHovered?: boolean;
}) => {
  return (
    <Image
      src={isHovered ? '/assets/board/hover-cell-detailed.svg' : '/assets/board/empty-cell-detailed.svg'}
      alt="Board cell"
      width={48}
      height={48}
      className="absolute inset-0 w-full h-full object-cover"
      priority
    />
  );
};

export const GameBoard = ({ 
  players, 
  onCellClick, 
  boardData
}: GameBoardProps) => {
  // Initialize or use provided board data
  const [board, setBoard] = useState<BoardCell[][]>(() => {
    if (boardData) return boardData;
    
    // Create simple empty board
    const newBoard: BoardCell[][] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      newBoard[y] = [];
      for (let x = 0; x < BOARD_WIDTH; x++) {
        newBoard[y][x] = {
          type: 'empty'
        };
      }
    }
    return newBoard;
  });

  // Track hovered cell for visual feedback
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Update board with player positions
  useEffect(() => {
    setBoard(prevBoard => {
      const newBoard: BoardCell[][] = prevBoard.map(row => 
        row.map(cell => ({
          type: cell.type,
          hasPlayer: false,
          playerId: undefined,
          playerColor: undefined
        }))
      );

      players.forEach(player => {
        const { x, y } = player.position;
        if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
          newBoard[y][x] = {
            type: newBoard[y][x].type,
            hasPlayer: true,
            playerId: player.id,
            playerColor: player.color
          };
        }
      });

      return newBoard;
    });
  }, [players]);

  const handleCellClick = (x: number, y: number) => {
    if (onCellClick) {
      onCellClick(x, y);
    }
  };

  return (
    <Card className="w-fit mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          🏭 RoboRally Board 🏭
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="inline-block border-2 border-gray-800 bg-gray-900 p-2 rounded-lg shadow-2xl">
          {board.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                const currentPlayer = players.find(p => p.position.x === x && p.position.y === y);
                const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
                
                return (
                  <div 
                    key={`${x}-${y}`} 
                    className="w-12 h-12 relative cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10"
                    onClick={() => handleCellClick(x, y)}
                    onMouseEnter={() => setHoveredCell({ x, y })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`Position (${x},${y})`}
                  >
                    {/* Cell background */}
                    <CellBackground isHovered={isHovered} />
                    
                    {/* Player robot */}
                    {cell.hasPlayer && currentPlayer && (
                      <div className={`
                        absolute inset-1 ${currentPlayer.color} 
                        rounded-full border-2 border-white 
                        flex items-center justify-center 
                        text-white font-bold text-lg
                        shadow-lg z-20
                        animate-pulse
                      `}>
                        <PlayerIcon direction={currentPlayer.direction} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};