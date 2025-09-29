"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Deck } from "./Deck";

interface DeckAreaProps {
  showControls: boolean;
  handSize: number;
  deckCount: number;
  isDealing: boolean;
  onDrawCards: (deckElement: HTMLElement) => void;
  onResetDeck?: () => void;
}

export const DeckArea = ({
  showControls,
  handSize,
  deckCount,
  onDrawCards,
}: DeckAreaProps) => {
  const deckRef = useRef<HTMLDivElement>(null);

  if (!showControls) return null;

  const handleDrawClick = () => {
    console.log("Simple draw button clicked!", { deckRef: deckRef.current });
    if (deckRef.current) {
      onDrawCards(deckRef.current);
    }
  };

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
          <div ref={deckRef} className="relative">
            <Deck
              remainingCards={deckCount}
              className=""
              size="small"
              type="programming"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{deckCount}</div>

          {/* Simple Draw Button - Always Visible */}
          <Button
            onClick={handleDrawClick}
            size="sm"
            className="mt-2 w-full bg-neon-cyan/20 hover:bg-neon-cyan/40 border border-neon-cyan/50 text-neon-cyan text-xs"
            title="Draw 9 cards"
          >
            <Download className="w-3 h-3 mr-1" />
            Draw
          </Button>
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
