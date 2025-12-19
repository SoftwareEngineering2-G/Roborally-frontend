"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DiscardingCard } from "./useCardDiscarding";

interface DiscardingCardComponentProps {
  discardingCard: DiscardingCard;
  onAnimationComplete: (cardId: string) => void;
}

/**
 * @author Sachin Baral 2025-11-04 21:25:08 +0100 12
 */
export const DiscardingCardComponent = ({
  discardingCard,
  onAnimationComplete,
}: DiscardingCardComponentProps) => {
  const { startPosition, endPosition, delay, card, id } = discardingCard;

  return (
    <motion.div
      key={id}
      className="fixed pointer-events-none"
      style={{ zIndex: 9999 }}
      initial={{
        x: startPosition.x - 32,
        y: startPosition.y - 48,
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        x: endPosition.x - 32,
        y: endPosition.y - 48,
        scale: 0.3,
        rotate: 15,
        opacity: 0.5,
      }}
      transition={{
        delay: delay / 1000,
        duration: 0.6,
        ease: [0.32, 0, 0.67, 0], // easeInCubic - faster at the start
      }}
      onAnimationComplete={() => {
        onAnimationComplete(id);
      }}
    >
      {/* Card with shadow layers */}
      <div className="relative">
        {/* Far shadow for depth */}
        <div
          className="absolute bg-black/20 rounded-lg blur-md"
          style={{
            width: "64px",
            height: "96px",
            transform: "translate(6px, 6px)",
          }}
        />

        {/* Close shadow for definition */}
        <div
          className="absolute bg-black/40 rounded-lg blur-sm"
          style={{
            width: "64px",
            height: "96px",
            transform: "translate(2px, 2px)",
          }}
        />

        {/* Main card */}
        <div
          className="relative rounded-lg overflow-hidden border-2 border-glass-border shadow-2xl"
          style={{
            width: "64px",
            height: "96px",
            background: "linear-gradient(145deg, #1a1a2e, #16213e)",
          }}
        >
          {/* Card image */}
          <Image
            src={card.imagePath}
            alt={card.name}
            fill
            sizes="(max-width: 768px) 100vw, 16vw"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className =
                "w-full h-full bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center text-white font-bold text-xs p-2 border border-orange-400/30";
              fallback.innerHTML = `
                <div class="text-center">
                  <div class="text-xs opacity-75">${card.type}</div>
                  <div class="text-yellow-300 text-[10px] mt-1">⚡</div>
                </div>
              `;
              target.parentElement!.appendChild(fallback);
            }}
          />

          {/* Red tint overlay for discard effect */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(45deg, rgba(255, 100, 0, 0.2), rgba(255, 50, 50, 0.2))",
              boxShadow: "inset 0 0 20px rgba(255, 100, 0, 0.3)",
            }}
          />

          {/* Border highlight */}
          <div
            className="absolute inset-0 rounded-lg border border-orange-500/40"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface DiscardAnimationOverlayProps {
  discardingCards: DiscardingCard[];
  onCardDiscarded: (cardId: string) => void;
}

/**
 * @author Sachin Baral 2025-11-04 21:25:08 +0100 129
 */
export const DiscardAnimationOverlay = ({
  discardingCards,
  onCardDiscarded,
}: DiscardAnimationOverlayProps) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {discardingCards.map((discardingCard) => (
          <DiscardingCardComponent
            key={discardingCard.id}
            discardingCard={discardingCard}
            onAnimationComplete={onCardDiscarded}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};