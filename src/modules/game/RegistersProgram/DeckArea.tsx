"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Deck } from "./Deck";

interface DeckAreaProps {
  showControls: boolean;
  handSize: number;
}

export const DeckArea = ({ showControls, handSize }: DeckAreaProps) => {
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
      <Card className="glass-panel p-3 backdrop-blur-xl bg-surface-dark/80 border border-glass-border w-20">
        <div className="text-center">
          <div className="text-xs text-neon-cyan mb-1">Draw</div>
          <Deck
            remainingCards={20}
            className=""
            size="small"
            type="programming"
          />
          <div className="text-xs text-muted-foreground mt-1">20</div>
        </div>
      </Card>

      {/* Discard Pile */}
      <Card className="glass-panel p-3 backdrop-blur-xl bg-surface-dark/80 border border-glass-border w-20">
        <div className="text-center">
          <div className="text-xs text-orange-400 mb-1">Discard</div>
          <Deck
            remainingCards={handSize > 5 ? handSize - 5 : 0}
            className=""
            size="small"
            type="discard"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {handSize > 5 ? handSize - 5 : 0}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
