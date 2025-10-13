"use client";
import { motion } from "framer-motion";
import type { GameBoard as GameBoardType } from "@/models/gameModels";
import Image from "next/image";

interface GameBoardProps {
  className?: string;
  gameBoardData: GameBoardType;
}

export const GameBoard = ({
  className = "",
  gameBoardData,
}: GameBoardProps) => {
  // Create a 10x10 grid - access the spaces array from the GameBoard type
  const gridSize = gameBoardData.spaces.length;
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => ({
    id: index,
    walls:
      gameBoardData.spaces[Math.floor(index / gridSize)][index % gridSize]
        .walls,
    name: gameBoardData.spaces[Math.floor(index / gridSize)][index % gridSize]
      .name,
  }));

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
            {cells.map((cell) => (
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

                <Image
                  src={`/spaces/${cell.name}.png`}
                  alt={cell.name}
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Board Labels */}
        </div>
      </div>
    </motion.div>
  );
};
