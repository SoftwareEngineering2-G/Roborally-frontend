"use client";

import { Card } from "@/components/ui/card";
import { ProgramCard } from "./types";

interface DeckProps {
  remainingCards: number;
  className?: string;
}

export function Deck({ remainingCards, className = "" }: DeckProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Deck Title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-cyan-300 glow-text">DECK</h3>
        <p className="text-sm text-cyan-400">
          {remainingCards} cards remaining
        </p>
      </div>

      {/* Visual Deck Stack */}
      <div className="relative w-24 h-32 mx-auto">
        {/* Create a visual stack of cards */}
        {[...Array(Math.min(5, Math.max(1, remainingCards)))].map(
          (_, index) => (
            <Card
              key={index}
              className={`
              absolute w-full h-full
              bg-gradient-to-br from-gray-800 to-gray-900
              border-2 border-cyan-400/30
              transform transition-all duration-300
              shadow-lg shadow-cyan-400/20
              ${index === 0 ? "z-10" : ""}
            `}
              style={{
                transform: `translateY(-${index * 2}px) translateX(${
                  index * 1
                }px)`,
                opacity: 1 - index * 0.1,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {/* Card Back Design */}
                <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 flex items-center justify-center">
                  <div className="text-xs text-cyan-300 font-mono transform rotate-45">
                    RR
                  </div>
                </div>
              </div>
            </Card>
          )
        )}

        {/* Empty deck indicator */}
        {remainingCards === 0 && (
          <Card className="w-full h-full bg-gray-900/50 border-2 border-red-400/30 border-dashed flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-400 text-xs font-mono">EMPTY</div>
            </div>
          </Card>
        )}
      </div>

      {/* Deck Info */}
      <div className="mt-4 text-center">
        <div className="text-xs text-cyan-400/70 font-mono">PROGRAM CARDS</div>
      </div>
    </div>
  );
}
