"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
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
  isDealing,
  onDrawCards,
  onResetDeck,
}: DeckAreaProps) => {
  const deckRef = useRef<HTMLDivElement>(null);

  if (!showControls) return null;

  const handleDrawClick = () => {
    console.log("Draw button clicked!", {
      deckRef: deckRef.current,
      isDealing,
      deckCount,
    });
    if (deckRef.current && !isDealing && deckCount >= 9) {
      onDrawCards(deckRef.current);
    }
  };

  const handleResetClick = () => {
    console.log("Reset button clicked!", { onResetDeck, isDealing });
    if (onResetDeck && !isDealing) {
      onResetDeck();
    }
  };

  console.log("DeckArea render:", {
    showControls,
    deckCount,
    isDealing,
    canDraw: deckCount >= 9,
  });

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
            {/* Draw Button Overlay - Made more prominent */}
            {!isDealing && deckCount >= 9 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-neon-cyan/5 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleDrawClick}
                  size="sm"
                  variant="ghost"
                  className="w-full h-full bg-neon-cyan/20 hover:bg-neon-cyan/40 border-2 border-neon-cyan/50 hover:border-neon-cyan/70 text-neon-cyan p-0 rounded-md transition-all duration-200 shadow-lg"
                  title="Draw 9 cards"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
            {/* Always show draw button for testing - remove this later */}
            {!isDealing && deckCount < 9 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() =>
                    console.log("Force draw test - deck count:", deckCount)
                  }
                  size="sm"
                  variant="ghost"
                  className="w-full h-full bg-blue-500/20 hover:bg-blue-500/40 border-2 border-blue-500/50 hover:border-blue-500/70 text-blue-500 p-0 rounded-md transition-all duration-200"
                  title={`Can't draw - only ${deckCount} cards left`}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
            {/* Reset Button when deck is low */}
            {!isDealing && deckCount < 9 && onResetDeck && (
              <motion.div
                className="absolute -bottom-6 left-0 right-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleResetClick}
                  size="sm"
                  variant="ghost"
                  className="bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 hover:border-orange-500/70 text-orange-500 px-2 py-1 rounded-md transition-all duration-200"
                  title="Reset deck"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
            {/* Dealing indicator */}
            {isDealing && (
              <motion.div
                className="absolute inset-0 bg-neon-cyan/20 border border-neon-cyan/50 rounded-md flex items-center justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-xs text-neon-cyan font-semibold">
                  Dealing...
                </div>
              </motion.div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{deckCount}</div>

          {/* External Draw Button for Testing */}
          {!isDealing && (
            <Button
              onClick={handleDrawClick}
              size="sm"
              className="mt-2 w-full bg-neon-cyan/20 hover:bg-neon-cyan/40 border border-neon-cyan/50 text-neon-cyan text-xs"
              disabled={deckCount < 9}
              title={
                deckCount >= 9
                  ? "Draw 9 cards"
                  : `Need ${9 - deckCount} more cards`
              }
            >
              <Download className="w-3 h-3 mr-1" />
            </Button>
          )}
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
