"use client";
import { motion } from "framer-motion";
import type {
  GameBoard as GameBoardType,
  GamePlayer,
  Direction,
} from "@/models/gameModels";
import Image from "next/image";
import { getSpaceImageURI } from "./spaceImageFactory";

interface GameBoardProps {
  className?: string;
  gameBoardData: GameBoardType;
  players?: GamePlayer[]; // Add players prop
}

// Map robot colors to image paths
const robotImageMap: Record<string, string> = {
  red: "/robots/red_robot_board.png",
  blue: "/robots/blue_robot_board.png",
  green: "/robots/green_robot_board.png",
  yellow: "/robots/yellow_robot_board.png",
  orange: "/robots/orange_robot_board.png",
  white: "/robots/white_robot_board.png",
  purple: "/robots/purple_robot_board.png",
  pink: "/robots/pink_robot_board.png",
  gray: "/robots/gray_robot_board.png",
};

// Map direction to rotation degrees
const directionRotationMap: Record<Direction, number> = {
  North: 0,
  East: 90,
  South: 180,
  West: 270,
};

export const GameBoard = ({
  className = "",
  gameBoardData,
  players = [],
}: GameBoardProps) => {
  // Get dynamic board dimensions from the spaces array
  const boardHeight = gameBoardData.spaces.length; // Number of rows
  const boardWidth = gameBoardData.spaces[0]?.length || 0; // Number of columns

  console.log("Board Dimensions:", boardWidth, "x", boardHeight);

  // Create cells array based on actual board dimensions
  const cells = Array.from({ length: boardHeight * boardWidth }, (_, index) => {
    const row = Math.floor(index / boardWidth);
    const col = index % boardWidth;
    return {
      id: index,
      walls: gameBoardData.spaces[row][col].walls,
      name: gameBoardData.spaces[row][col].name,
      row,
      col,
      direction: gameBoardData.spaces[row][col].direction,
    };
  });

  // Helper function to find robots at a specific position
  const getRobotsAtPosition = (x: number, y: number): GamePlayer[] => {
    return players.filter(
      (player) => player.positionX === x && player.positionY === y
    );
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-panel rounded-lg border border-glass-border w-full h-full flex items-center justify-center relative">
        {/* Grid Container */}
        <div
          className="grid gap-1 bg-surface-dark p-1 rounded-lg border-2 border-neon-teal shadow-glow-teal"
          style={{
            gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
            aspectRatio: `${boardWidth} / ${boardHeight}`,
            height: "calc(100vh - 6rem)", // Reduced from 12rem since we're using less padding
            width: "auto", // Let width be calculated from aspect ratio
            maxWidth: "100%", // Ensure it doesn't overflow the container width
          }}
        >
          {cells.map((cell, index) => {
            const x = index % boardWidth;
            const y = Math.floor(index / boardWidth);
            const robotsAtPosition = getRobotsAtPosition(x, y);

            return (
              <motion.div
                key={cell.id}
                className="relative bg-surface-medium border border-glass-border rounded-sm hover:bg-surface-light transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ aspectRatio: "1" }}
              >
                {/* Walls */}
                {cell.walls.includes("East") && (
                  <span className="pointer-events-none absolute right-[-3px] translate-x-1/2 top-0.5 bottom-0.5 w-[5px] rounded-[4px] bg-[linear-gradient(135deg,hsl(var(--neon-teal)),hsl(var(--neon-blue)))] shadow-[0_0_16px_hsl(var(--neon-teal)_/_0.7)]" />
                )}

                {cell.walls.includes("South") && (
                  <span className="pointer-events-none absolute left-0.5 right-0.5 bottom-[-3px] translate-y-1/2 h-[4px] rounded-[4px] bg-[linear-gradient(135deg,hsl(var(--neon-teal)),hsl(var(--neon-blue)))] shadow-[0_0_16px_hsl(var(--neon-teal)_/_0.7)]" />
                )}

                {/* Space background image */}
                <Image
                  src={getSpaceImageURI(cell.name, cell.direction)}
                  alt={cell.name}
                  fill
                  sizes="100%"
                  className="object-cover"
                />

                {/* Robots at this position */}
                {robotsAtPosition.length > 0 && (
                  <div className="absolute inset-0 z-10">
                    {robotsAtPosition.map((player, robotIndex) => {
                      const robotImage =
                        robotImageMap[player.robot.toLowerCase()] ||
                        robotImageMap.red;
                      const rotation = directionRotationMap[player.direction];

                      return (
                        <motion.div
                          key={player.username}
                          className="absolute inset-0"
                          initial={{ scale: 0, rotate: rotation }}
                          animate={{ scale: 1, rotate: rotation }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: robotIndex * 0.1,
                          }}
                          style={{
                            // If multiple robots, offset them slightly
                            left:
                              robotsAtPosition.length > 1
                                ? `${robotIndex * 10}%`
                                : 0,
                            top:
                              robotsAtPosition.length > 1
                                ? `${robotIndex * 10}%`
                                : 0,
                            width: robotsAtPosition.length > 1 ? "90%" : "100%",
                            height:
                              robotsAtPosition.length > 1 ? "90%" : "100%",
                          }}
                        >
                          <Image
                            src={robotImage}
                            alt={`${player.robot} robot - ${player.username}`}
                            fill
                            sizes="100px"
                            className="object-contain"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Board Labels */}
      </div>
    </motion.div>
  );
};
