"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DealingCard } from "./useCardDealing";

interface DealingCardComponentProps {
  dealingCard: DealingCard;
  onAnimationComplete: (cardId: string) => void;
}

export const DealingCardComponentSimple = ({
  dealingCard,
  onAnimationComplete,
}: DealingCardComponentProps) => {
  const { startPosition, endPosition, delay, card, id } = dealingCard;

  return (
    <motion.div
      key={id}
      className="fixed pointer-events-none"
      style={{ zIndex: 9999 }} // Inline style for guaranteed high z-index
      initial={{
        x: startPosition.x - 32, // Offset by half width (64px / 2 = 32px)
        y: startPosition.y - 48, // Offset by half height (96px / 2 = 48px)
        scale: 0.2,
        rotate: -20,
        opacity: 0.8,
      }}
      animate={{
        x: endPosition.x - 32, // Offset by half width to align top-left
        y: endPosition.y - 48, // Offset by half height to align top-left
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      transition={{
        delay: delay / 1000,
        duration: 1.0, // Slightly longer for more dramatic effect
        ease: [0.23, 1, 0.32, 1], // Improved easing curve (easeOutExpo)
      }}
      onAnimationComplete={() => {
        onAnimationComplete(id);
      }}
    >
      {/* Enhanced card with multiple shadow layers - Match exact card size */}
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

        {/* Main card with enhanced styling - Match exact placeholder size (w-16 h-24 = 64px x 96px) */}
        <div
          className="relative rounded-lg overflow-hidden border-2 border-glass-border shadow-2xl"
          style={{
            width: "64px",
            height: "96px",
            background: "linear-gradient(145deg, #1a1a2e, #16213e)",
          }}
        >
          {/* Card image with enhanced fallback */}
          <img
            src={card.imagePath}
            alt={card.name}
            className="w-full h-full object-cover"
            onLoad={() => {}}
            onError={(e) => {
              console.log(
                "Card image failed, using enhanced fallback:",
                card.imagePath
              );
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              // Create enhanced fallback content
              const fallback = document.createElement("div");
              fallback.className =
                "w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs p-2 border border-blue-400/30";
              fallback.innerHTML = `
                <div class="text-center">
                  <div class="text-xs opacity-75">${card.type}</div>
                  <div class="text-yellow-300 text-[10px] mt-1">⚡</div>
                </div>
              `;
              target.parentElement!.appendChild(fallback);
            }}
          />

          {/* Enhanced glow effect with animation */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))",
              boxShadow: "inset 0 0 20px rgba(0, 255, 255, 0.2)",
            }}
          />

          {/* Subtle border highlight */}
          <div
            className="absolute inset-0 rounded-lg border border-neon-cyan/30"
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

interface DealingAnimationOverlayProps {
  dealingCards: DealingCard[];
  onCardDealt: (cardId: string) => void;
}

export const DealingAnimationOverlaySimple = ({
  dealingCards,
  onCardDealt,
}: DealingAnimationOverlayProps) => {
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
        {dealingCards.map((dealingCard) => (
          <DealingCardComponentSimple
            key={dealingCard.id}
            dealingCard={dealingCard}
            onAnimationComplete={onCardDealt}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
