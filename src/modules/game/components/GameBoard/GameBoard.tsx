"use client";
import { motion } from "framer-motion";
import type { GameBoard as GameBoardType, GamePlayer, GameBoardCell, BoardElement } from "@/models/gameModels";
import Image from "next/image";
import Robot from "./Robot";
import { useMemo } from "react";

interface GameBoardProps {
  className?: string;
  gameBoardData: GameBoardType;
  players?: GamePlayer[]; // Add players prop
  currentUsername?: string;
}

const getSpaceImage = (space: GameBoardCell) => {
  if ( (space as BoardElement).direction ) {
    return `/boardElements/${space.name}-${(space as BoardElement).direction}.png`;
  }
  return `/spaces/${space.name}.png`;
}

export const GameBoard = ({
  className = "",
  gameBoardData,
  players = [],
  currentUsername,
}: GameBoardProps) => {
  const currentPlayer = useMemo(() => {
    return players.find(player => player.username === currentUsername);
  }, [players, currentUsername]);

  // Create a 10x10 grid - access the spaces array from the GameBoard type
  const gridSize = gameBoardData.spaces.length;
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    const correspondingCell = gameBoardData.spaces[y][x];
    return {
      id: index,
      ...correspondingCell,
      isCurrentPlayerPosition: currentPlayer
        ? currentPlayer.positionX === x && currentPlayer.positionY === y
        : false,
    };
  });

  // Helper function to find robots at a specific position
  const getRobotsAtPosition = (x: number, y: number): GamePlayer[] => {
    return players.filter(player => player.positionX === x && player.positionY === y);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-panel p-6 rounded-lg border border-glass-border">
        <div className="relative mx-auto" style={{ maxWidth: "600px" }}>
          {/* Grid Container */}
          <div
            className="grid gap-1 bg-surface-dark p-2 rounded-lg border-2 border-neon-teal shadow-glow-teal"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              aspectRatio: "1",
            }}
          >
            {cells.map((cell, index) => {
              const x = index % gridSize;
              const y = Math.floor(index / gridSize);
              const robotsAtPosition = getRobotsAtPosition(x, y);

              return (
                <div key={cell.id} className="relative">
                  <motion.div
                    key={cell.id}
                    className={`relative bg-surface-medium border rounded-sm transition-colors duration-200 cursor-pointer ${
                      cell.isCurrentPlayerPosition
                        ? "border-2 border-neon-lime" 
                        : "border-glass-border hover:bg-surface-light"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ aspectRatio: "1" }}
                  >
                    {/* Space background image */}
                    <Image
                      src={getSpaceImage(cell)}
                      alt={cell.name}
                      fill
                      sizes="100%"
                      className="object-cover rounded-sm"
                    />

                    {/* Robots at this position */}
                    {robotsAtPosition.length > 0 && (
                      <div className="absolute inset-0 z-10">
                        {robotsAtPosition.map((player, robotIndex) => 
                          <Robot
                            key={player.username}
                            robot={player.robot}
                            direction={player.direction}
                            robotIndex={robotIndex}
                            nbRobotsAtPosition={robotsAtPosition.length}
                          />
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Walls */}
                  {cell.walls.includes("East") && (
                    <span className="border absolute z-2 right-[-3px] translate-x-1/2 top-0.5 bottom-0.5 w-[7px] rounded-[4px] bg-[linear-gradient(135deg,hsl(var(--neon-teal)),hsl(var(--neon-blue)))] shadow-[0_0_16px_hsl(var(--neon-teal)_/_0.7)]" />
                  )}

                  {cell.walls.includes("South") && (
                    <span className="border absolute z-2 left-0.5 right-0.5 bottom-[-3px] translate-y-1/2 h-[7px] rounded-[4px] bg-[linear-gradient(135deg,hsl(var(--neon-teal)),hsl(var(--neon-blue)))] shadow-[0_0_16px_hsl(var(--neon-teal)_/_0.7)]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Board Labels */}
        </div>
      </div>
    </motion.div>
  );
};
