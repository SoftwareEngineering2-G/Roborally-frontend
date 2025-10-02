"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

// API tile can be object { name: ... }, plain string, null, etc.
export type GameBoardSpace = Record<string, unknown> | string | null | undefined;

export interface GameBoardData {
    name: string;
    space: GameBoardSpace[][];
}

interface GameBoardProps {
    gameBoard?: GameBoardData | null;
    className?: string;
    showCoords?: boolean;
}

/** Extract a display name from various backend shapes (case-insensitive, resilient). */
function getSpaceName(tile: GameBoardSpace): string {
    if (typeof tile === "string") return tile;

    if (tile && typeof tile === "object") {
        const o = tile as Record<string, unknown>;

        // Try common keys case-insensitively, including $type from System.Text.Json polymorphism
        const keys = Object.keys(o);
        let candidate: unknown;

        // 1) exact "name"
        candidate = o["name"];
        if (typeof candidate === "string" && candidate.trim()) return candidate;

        // 2) common alternates (case-insensitive)
        const wanted = new Set(["name", "displayname", "type", "$type"]);
        for (const k of keys) {
            const lk = k.toLowerCase();
            if (wanted.has(lk)) {
                const v = o[k];
                if (typeof v === "string" && v.trim()) return v;
            }
        }

        // 3) last resort: first string value on the object
        for (const k of keys) {
            const v = o[k];
            if (typeof v === "string" && v.trim()) return v;
        }
    }

    return "EmptySpace";
}

/** Normalize names to stable keys, e.g. "Spawn Point_1" -> "spawnpoint". */
function normalize(name: string): string {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[\s_\-]+/g, "")
        .replace(/\d+/g, "");
}

/** Map a normalized name to an image path (extend as you add assets). */
function getTileImagePath(name: string): string {
    const key = normalize(name);

    const map: Record<string, string> = {
        emptyspace: "/spaces/EmptySpace.png",
        spawnpoint: "/spaces/SpawnPoint.png",
    };

    return map[key] ?? "/spaces/EmptySpace.png";
}

/** Clamp to the shortest row so ragged data won't crash the grid. */
function getGridSize(space: GameBoardSpace[][] | undefined | null) {
    const rows = space?.length ?? 0;
    if (!rows) return { rows: 0, cols: 0 };

    // Find minimum row length to ensure a rectangular grid.
    let cols = Number.MAX_SAFE_INTEGER;
    for (let r = 0; r < rows; r++) {
        const len = space![r]?.length ?? 0;
        if (len === 0) return { rows: 0, cols: 0 };
        cols = Math.min(cols, len);
    }
    if (cols === Number.MAX_SAFE_INTEGER) cols = 0;
    return { rows, cols };
}

export const GameBoard = ({ gameBoard, className = "", showCoords = false }: GameBoardProps) => {
    const { rows, cols } = useMemo(() => getGridSize(gameBoard?.space), [gameBoard]);

    if (!gameBoard) {
        return (
            <div className={`p-6 text-sm text-muted-foreground text-center ${className}`}>
                Loading board…
            </div>
        );
    }
    if (rows === 0 || cols === 0) {
        return (
            <div className={`p-6 text-red-400 text-center ${className}`}>
                Invalid board: no cells to render.
            </div>
        );
    }

    const boardStyle: React.CSSProperties = {
        width: "min(90vw, 80vh)",
        aspectRatio: `${cols} / ${rows}`,
    };

    const gridStyle: React.CSSProperties = {
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
    };

    return (
        <motion.div
            className={`relative ${className}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
        >
            <div className="glass-panel p-4 md:p-6 rounded-lg border border-glass-border">
                <h2 className="text-xl md:text-2xl font-bold neon-text mb-4 text-center">
                    {gameBoard.name || "RoboRally Board"}
                </h2>

                <div className="relative mx-auto">
                    <div
                        id="board-frame" // optional: an id for the outer frame
                        className="mx-auto bg-surface-dark p-1 md:p-2 rounded-lg border-2 border-neon-teal shadow-glow-teal"
                        style={boardStyle}
                    >
                        <div
                            id="board-grid" // optional: an id for the grid container
                            className="grid gap-[2px] md:gap-1 w-full h-full"
                            style={gridStyle}
                        >
                            {Array.from({ length: rows }).map((_, y) =>
                                Array.from({ length: cols }).map((__, x) => {
                                    const tile = gameBoard.space[y][x];
                                    const spaceName = getSpaceName(tile);
                                    const src = getTileImagePath(spaceName);

                                    return (
                                        <motion.div
                                            key={`${x}-${y}`}
                                            id={`cell-${x}-${y}`}          // 👈 unique DOM id per cell
                                            data-x={x}                     // 👈 extra metadata
                                            data-y={y}
                                            data-name={spaceName}
                                            className="relative rounded-[2px] md:rounded-sm overflow-hidden"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={src}
                                                alt={spaceName}
                                                className="w-full h-full object-cover select-none pointer-events-none"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = "/spaces/EmptySpace.png";
                                                }}
                                                loading="lazy"
                                                decoding="async"
                                                draggable={false}
                                            />

                                            {showCoords && (
                                                <div className="absolute inset-0 flex items-start justify-start p-1 text-[10px] md:text-xs bg-black/10 text-white/90">
                                                    {x},{y} • {spaceName}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default GameBoard;