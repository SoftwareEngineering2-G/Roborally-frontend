"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ShuffleAnimationProps {
  isShuffling: boolean;
  discardPosition: { x: number; y: number };
  deckPosition: { x: number; y: number };
  cardCount: number;
  onComplete: () => void;
}

interface ShuffleCard {
  id: number;
  delay: number;
  rotation: number;
  arcHeight: number;
}

/**
 * ShuffleAnimation - A dramatic cyberpunk-themed animation showing cards
 * being shuffled from the discard pile back into the programming deck.
 * Features neon glows, particle effects, and smooth arc trajectories.
 */
/**
 * @author Truong Son NGO 2025-11-28 15:35:41 +0100 26
 */
export const ShuffleAnimation = ({
  isShuffling,
  discardPosition,
  deckPosition,
  cardCount,
  onComplete,
}: ShuffleAnimationProps) => {
  const [shuffleCards, setShuffleCards] = useState<ShuffleCard[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isShuffling && cardCount > 0) {
      // Generate shuffle cards with staggered delays and random variations
      const cards: ShuffleCard[] = [];
      const numCards = Math.min(cardCount, 8); // Limit visual cards for performance

      for (let i = 0; i < numCards; i++) {
        cards.push({
          id: i,
          delay: i * 0.2, // Stagger each card by 200ms
          rotation: Math.random() * 720 - 360, // Random rotation between -360 and 360
          arcHeight: 80 + Math.random() * 40, // Random arc height
        });
      }

      setShuffleCards(cards);
      setShowParticles(true);

      // Show flash effect when cards merge into deck
      const flashDelay = numCards * 200 + 800;
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 500);
      }, flashDelay);

      // Complete animation
      const totalTime = numCards * 200 + 1500;
      setTimeout(() => {
        setShuffleCards([]);
        setShowParticles(false);
        onComplete();
      }, totalTime);
    }
  }, [isShuffling, cardCount, onComplete]);

  if (!isShuffling) return null;

  // Calculate the midpoint for the arc
/**
 * @author Truong Son NGO 2025-11-28 15:35:41 +0100 75
 */
  const midX = (discardPosition.x + deckPosition.x) / 2;
  const midY = Math.min(discardPosition.y, deckPosition.y) - 100;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {/* Background overlay with subtle darkening */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
      />

      {/* Particle trail effect */}
      <AnimatePresence>
        {showParticles &&
          [...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-shuffle-${i}-${Date.now()}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  i % 2 === 0 ? "hsl(180, 100%, 50%)" : "hsl(320, 100%, 60%)"
                }, transparent)`,
                boxShadow:
                  i % 2 === 0
                    ? "0 0 10px hsl(180, 100%, 50%), 0 0 20px hsl(180, 100%, 50%)"
                    : "0 0 10px hsl(320, 100%, 60%), 0 0 20px hsl(320, 100%, 60%)",
              }}
              initial={{
                x: discardPosition.x + Math.random() * 40 - 20,
                y: discardPosition.y + Math.random() * 40 - 20,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: [
                  discardPosition.x + Math.random() * 40 - 20,
                  midX + Math.random() * 60 - 30,
                  deckPosition.x + Math.random() * 40 - 20,
                ],
                y: [discardPosition.y, midY - Math.random() * 40, deckPosition.y],
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.6,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Shuffle cards animation */}
      <AnimatePresence>
        {shuffleCards.map((card) => (
          <motion.div
            key={`shuffle-card-${card.id}`}
            className="absolute"
            style={{ zIndex: 10001 + card.id }}
            initial={{
              x: discardPosition.x - 24,
              y: discardPosition.y - 36,
              scale: 0.8,
              rotate: 15,
              opacity: 0.9,
            }}
            animate={{
              x: [discardPosition.x - 24, midX - 24, deckPosition.x - 24],
              y: [discardPosition.y - 36, midY - card.arcHeight, deckPosition.y - 36],
              scale: [0.8, 1.1, 0.9],
              rotate: [15, card.rotation / 2, -10],
              opacity: [0.9, 1, 0.7],
            }}
            transition={{
              delay: card.delay,
              duration: 1.0,
              ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
            }}
          >
            {/* Card back with cyberpunk design - 3/4 size: 48x72px */}
            <div className="relative w-12 h-[72px]">
              {/* Card shadow */}
              <div
                className="absolute inset-0 rounded-lg bg-black/50 blur-md"
                style={{ transform: "translate(3px, 3px)" }}
              />

              {/* Gradient border wrapper */}
              <div
                className="absolute inset-0 rounded-lg p-[2px]"
                style={{
                  background: "linear-gradient(135deg, hsl(180, 100%, 50%), hsl(320, 100%, 60%))",
                }}
              >
                {/* Main card */}
                <div
                  className="w-full h-full rounded-md overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
                  }}
                >
                  {/* Circuit pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-30 rounded-md"
                    style={{
                      backgroundImage: `
                        linear-gradient(90deg, hsl(180, 100%, 50%, 0.1) 1px, transparent 1px),
                        linear-gradient(hsl(180, 100%, 50%, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: "6px 6px",
                    }}
                  />

                  {/* Center emblem */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle, hsl(180, 100%, 50%, 0.3), transparent)",
                        boxShadow:
                          "0 0 15px hsl(180, 100%, 50%, 0.5), inset 0 0 8px hsl(180, 100%, 50%, 0.3)",
                      }}
                    >
                      <span className="text-lg">⚡</span>
                    </div>
                  </div>

                  {/* Animated glow border */}
                  <motion.div
                    className="absolute inset-0 rounded-md"
                    style={{
                      boxShadow:
                        "inset 0 0 15px hsl(180, 100%, 50%, 0.5), 0 0 12px hsl(180, 100%, 50%, 0.3)",
                    }}
                    animate={{
                      boxShadow: [
                        "inset 0 0 15px hsl(180, 100%, 50%, 0.5), 0 0 12px hsl(180, 100%, 50%, 0.3)",
                        "inset 0 0 25px hsl(320, 100%, 60%, 0.5), 0 0 20px hsl(320, 100%, 60%, 0.3)",
                        "inset 0 0 15px hsl(180, 100%, 50%, 0.5), 0 0 12px hsl(180, 100%, 50%, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Flash effect when cards merge */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="absolute"
            style={{
              left: deckPosition.x - 60,
              top: deckPosition.y - 80,
              width: 120,
              height: 160,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle, hsl(180, 100%, 60%, 0.8), hsl(180, 100%, 50%, 0.3), transparent)",
                boxShadow: "0 0 60px hsl(180, 100%, 50%), 0 0 100px hsl(180, 100%, 50%, 0.5)",
              }}
            />

            {/* Secondary magenta glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle, hsl(320, 100%, 60%, 0.6), transparent)",
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.3, 1.5],
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shuffle text indicator */}
      <AnimatePresence>
        {isShuffling && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="px-6 py-3 rounded-lg font-bold text-lg tracking-wider"
              style={{
                background:
                  "linear-gradient(135deg, hsl(220, 25%, 10%, 0.95), hsl(220, 20%, 15%, 0.95))",
                border: "2px solid hsl(180, 100%, 50%, 0.5)",
                boxShadow:
                  "0 0 30px hsl(180, 100%, 50%, 0.3), inset 0 0 20px hsl(180, 100%, 50%, 0.1)",
                color: "hsl(180, 100%, 70%)",
                textShadow: "0 0 10px hsl(180, 100%, 50%), 0 0 20px hsl(180, 100%, 50%, 0.5)",
              }}
            >
              <motion.span
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                🔄 SHUFFLING DECK
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ShuffleAnimationOverlayProps {
  isShuffling: boolean;
  onComplete: () => void;
}

/**
 * ShuffleAnimationOverlay - A wrapper that finds the deck elements and
 * triggers the shuffle animation with proper positioning.
 */
/**
 * @author Truong Son NGO 2025-11-28 15:35:41 +0100 334
 */
export const ShuffleAnimationOverlay = ({
  isShuffling,
  onComplete,
}: ShuffleAnimationOverlayProps) => {
  const [positions, setPositions] = useState<{
    discard: { x: number; y: number };
    deck: { x: number; y: number };
  } | null>(null);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    if (isShuffling) {
      // Find the deck elements and calculate positions
      const discardPile = document.querySelector("[data-discard-pile]") as HTMLElement;
      const deckElement = document.querySelector("[data-deck-element]") as HTMLElement;

      if (discardPile && deckElement) {
        const discardRect = discardPile.getBoundingClientRect();
        const deckRect = deckElement.getBoundingClientRect();

        setPositions({
          discard: {
            x: discardRect.left + discardRect.width / 2,
            y: discardRect.top + discardRect.height / 2,
          },
          deck: {
            x: deckRect.left + deckRect.width / 2,
            y: deckRect.top + deckRect.height / 2,
          },
        });

        // Try to get card count from the discard pile display
        const discardCountElement =
          discardPile.parentElement?.querySelector(".text-muted-foreground");
        const count = discardCountElement
          ? Number.parseInt(discardCountElement.textContent || "4", 10)
          : 4;
        setCardCount(Math.max(count, 4)); // At least 4 cards for visual effect
      } else {
        // Fallback positions if elements not found
        setPositions({
          discard: { x: window.innerWidth - 60, y: 200 },
          deck: { x: window.innerWidth - 60, y: 120 },
        });
        setCardCount(4);
      }
    }
  }, [isShuffling]);

  if (!isShuffling || !positions) return null;

  return (
    <ShuffleAnimation
      isShuffling={isShuffling}
      discardPosition={positions.discard}
      deckPosition={positions.deck}
      cardCount={cardCount}
      onComplete={onComplete}
    />
  );
};