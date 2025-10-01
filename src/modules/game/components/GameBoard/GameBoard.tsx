"use client";

import { motion } from "framer-motion";

interface GameBoardProps {
  className?: string;
}

export const GameBoard = ({ className = "" }: GameBoardProps) => {
  // Create a 10x10 grid
  const gridSize = 10;
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => ({
    id: index,
    x: index % gridSize,
    y: Math.floor(index / gridSize),
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
                {/* Grid Coordinates (optional, for debugging) */}
                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground opacity-50">
                  {cell.x},{cell.y}
                </div>

                {/* Special cells for visual interest */}
                {(cell.x === 0 ||
                  cell.x === gridSize - 1 ||
                  cell.y === 0 ||
                  cell.y === gridSize - 1) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/20 to-transparent rounded-sm" />
                )}

                {/* Center spawn point */}
                {cell.x === Math.floor(gridSize / 2) &&
                  cell.y === Math.floor(gridSize / 2) && (
                    <div className="absolute inset-0 bg-gradient-primary rounded-sm animate-neon-pulse opacity-30" />
                  )}
              </motion.div>
            ))}
          </div>

          {/* Board Labels */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm text-neon-teal px-2">
            {Array.from({ length: gridSize }, (_, i) => (
              <span key={i} className="w-8 text-center font-mono">
                {i}
              </span>
            ))}
          </div>

          <div className="absolute top-0 bottom-0 -left-8 flex flex-col justify-between text-sm text-neon-teal py-2">
            {Array.from({ length: gridSize }, (_, i) => (
              <span
                key={i}
                className="h-8 flex items-center justify-center font-mono"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
