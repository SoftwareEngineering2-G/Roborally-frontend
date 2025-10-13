"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Space {
    name: string; // e.g. "EmptySpace", "SpawnPoint"
}

interface GameBoardData {
    name: string;
    spaces: Space[][];
}

interface GameBoardProps {
    gameBoard: GameBoardData;
    className?: string;
}

export const GameBoard = ({ gameBoard, className }: GameBoardProps) => {
    if (!gameBoard || !gameBoard.spaces) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No game board data.
            </div>
        );
    }

    const rows = gameBoard.spaces.length;
    const cols = gameBoard.spaces[0]?.length ?? 0;

    return (
        <motion.div
            className={`relative ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="glass-panel p-6 rounded-lg border border-glass-border">
                <div className="relative mx-auto" style={{ maxWidth: "800px" }}>
                    {/* Grid Container */}
                    <div
                        className="grid gap-1 bg-surface-dark p-2 rounded-lg border-2 border-neon-teal shadow-glow-teal"
                        style={{
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            aspectRatio: `${cols}/${rows}`,
                        }}
                    >
                        {gameBoard.spaces.map((row, y) =>
                            row.map((cell, x) => {
                                const imageSrc = `/spaces/${cell.name}.png`; // e.g. /tiles/EmptySpace.png

                                return (
                                    <motion.div
                                        id={`space-${x}-${y}`}
                                        key={`${x}-${y}`}
                                        className="relative border border-glass-border rounded-sm overflow-hidden"
                                        // whileHover={{ scale: 1.05 }}
                                        // whileTap={{ scale: 0.95 }}
                                        style={{ aspectRatio: "1" }}
                                    >
                                        <Image
                                            src={imageSrc}
                                            alt={cell.name}
                                            fill
                                            sizes="100%"
                                            className="object-cover"
                                            onError={(e) => {
                                                // fallback to EmptySpace if missing image
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/spaces/EmptySpace.png";
                                            }}
                                        />
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
