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

  console.log("Rendering SIMPLE dealing card:", {
    id,
    startPosition,
    endPosition,
    delay,
  });

  return (
    <motion.div
      key={id}
      className="fixed pointer-events-none"
      style={{ zIndex: 9999 }} // Very high z-index
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        scale: 0.3,
        rotate: -15,
        opacity: 1,
      }}
      animate={{
        x: endPosition.x,
        y: endPosition.y,
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      transition={{
        delay: delay / 1000,
        duration: 0.8, // Realistic timing
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth curve
      }}
      onAnimationComplete={() => {
        console.log("Animation completed for card:", id);
        onAnimationComplete(id);
      }}
    >
      {/* Realistic card with shadow and effects */}
      <div className="relative">
        {/* Drop shadow */}
        <div
          className="absolute bg-black/30 rounded-lg blur-sm"
          style={{
            width: "80px",
            height: "112px",
            transform: "translate(3px, 3px)",
          }}
        />

        {/* Card */}
        <div
          className="relative bg-surface-medium border-2 border-glass-border rounded-lg overflow-hidden"
          style={{ width: "80px", height: "112px" }}
        >
          {/* Try card image first */}
          <img
            src={card.imagePath}
            alt={card.name}
            className="w-full h-full object-cover"
            onLoad={() => console.log("Card image loaded:", card.imagePath)}
            onError={(e) => {
              console.log("Card image failed, using fallback:", card.imagePath);
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              // Create fallback content
              const fallback = document.createElement("div");
              fallback.className =
                "w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs p-2";
              fallback.innerHTML = `<div class="text-center"><div>${card.type}</div></div>`;
              target.parentElement!.appendChild(fallback);
            }}
          />

          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-neon-cyan/10 rounded-lg opacity-80" />
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
  console.log("DealingAnimationOverlaySimple render:", { dealingCards });

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
