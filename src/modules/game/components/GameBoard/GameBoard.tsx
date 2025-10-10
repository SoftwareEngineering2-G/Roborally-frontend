"use client";

import type { Direction } from "@/types/game";
import { motion } from "framer-motion";
import { mockGameBoardWithWalls } from "./mock";

interface GameBoardProps {
    className?: string;
}

const gameBoardSpaces = mockGameBoardWithWalls;

export const GameBoard = ({ className = "" }: GameBoardProps) => {
    // Create a 10x10 grid
    const gridSize = gameBoardSpaces.length;
    const cells = Array.from({ length: gridSize * gridSize }, (_, index) => ({
        id: index,
        x: index % gridSize,
        y: Math.floor(index / gridSize),
        walls: gameBoardSpaces[Math.floor(index / gridSize)][index % gridSize].Walls as Direction[],
    }));

    const axisLabels = Array.from({ length: gridSize }, (_, idx) => idx);
    
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

                                {/* Walls */}
                                {cell.walls.includes("East") && (
                                    <span
                                        className="pointer-events-none absolute right-[-3px] translate-x-1/2 top-0.5 bottom-0.5 w-[5px] rounded-[4px] bg-[linear-gradient(135deg,hsl(var(--neon-teal)),hsl(var(--neon-blue)))] shadow-[0_0_16px_hsl(var(--neon-teal)_/_0.7)]"
                                    />
                                )}

                                {cell.walls.includes("South") && (
                                    <span className="pointer-events-none absolute left-0.5 right-0.5 bottom-[-3px] translate-y-1/2 h-[4px] rounded-[4px] bg-[linear-gradient(135deg,hsl(var(--neon-teal)),hsl(var(--neon-blue)))] shadow-[0_0_16px_hsl(var(--neon-teal)_/_0.7)]" />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Board Labels */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm text-neon-teal px-2">
                        {axisLabels.map((label) => (
                            <span key={`column-${label}`} className="w-8 text-center font-mono">
                                {label}
                            </span>
                        ))}
                    </div>

                    <div className="absolute top-0 bottom-0 -left-8 flex flex-col justify-between text-sm text-neon-teal py-2">
                        {axisLabels.map((label) => (
                            <span
                                key={`row-${label}`}
                                className="h-8 flex items-center justify-center font-mono"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
