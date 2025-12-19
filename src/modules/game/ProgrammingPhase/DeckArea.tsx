"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Deck } from "./Deck";

interface DeckAreaProps {
  showControls: boolean;
  deckCount: number;
  discardCount: number;
  isDealing: boolean;
  isShuffling?: boolean;
}

/**
 * @author Sachin Baral 2025-09-30 22:13:00 +0200 16
 */
export const DeckArea = ({
  showControls,
  deckCount,
  discardCount,
  isShuffling = false,
}: DeckAreaProps) => {
  const deckRef = useRef<HTMLDivElement>(null);

  if (!showControls) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{
        delay: showControls ? 0.4 : 0.1,
        duration: 0.5,
        ease: showControls ? "easeOut" : "easeIn",
      }}
      className="fixed top-20 right-4 z-30 space-y-3"
    >
      {/* Programming Pile */}
      <Card
        className={`glass-panel p-3 backdrop-blur-xl bg-surface-dark/80 border border-glass-border w-20 transition-all duration-300 ${
          isShuffling ? "shadow-glow-teal animate-neon-pulse" : ""
        }`}
      >
        <div className="text-center">
          <div className="text-xs text-neon-cyan mb-1">Draw</div>
          <div ref={deckRef} className="relative" data-deck-element>
            <Deck remainingCards={deckCount} className="" size="small" type="programming" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{deckCount}</div>
        </div>
      </Card>

      {/* Discard Pile */}
      <Card
        className={`glass-panel p-3 backdrop-blur-xl bg-surface-dark/80 border border-glass-border w-20 transition-all duration-300 ${
          isShuffling ? "shadow-glow-magenta animate-neon-pulse" : ""
        }`}
      >
        <div className="text-center">
          <div className="text-xs text-orange-400 mb-1">Discard</div>
          <div data-discard-pile>
            <Deck remainingCards={discardCount} className="" size="small" type="discard" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{discardCount}</div>
        </div>
      </Card>
    </motion.div>
  );
};
