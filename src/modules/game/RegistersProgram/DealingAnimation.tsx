"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DealingCard } from "./useCardDealing";

interface DealingCardComponentProps {
  dealingCard: DealingCard;
  onAnimationComplete: (cardId: string) => void;
}

export const DealingCardComponent = ({
  dealingCard,
  onAnimationComplete,
}: DealingCardComponentProps) => {
  const { startPosition, endPosition, delay, card, id } = dealingCard;

  return (
    <motion.div
      key={id}
      className="fixed z-50 pointer-events-none"
      initial={{
        x: startPosition.x - 32, // Offset by half width (64px / 2 = 32px)
        y: startPosition.y - 48, // Offset by half height (96px / 2 = 48px)
        scale: 0.3,
        rotate: -10,
        opacity: 1,
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
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for realistic motion
        scale: {
          duration: 0.4,
          ease: "easeOut",
        },
        rotate: {
          duration: 0.5,
          ease: "easeOut",
        },
      }}
      onAnimationComplete={() => onAnimationComplete(id)}
    >
      <div className="relative">
        {/* Card shadow for depth - Match exact card size */}
        <div
          className="absolute inset-0 bg-black/30 rounded-lg transform translate-x-1 translate-y-1 blur-sm"
          style={{ width: "64px", height: "96px" }}
        />

        {/* Actual card - Match exact placeholder size (w-16 h-24 = 64px x 96px) */}
        <div
          className="relative bg-surface-medium border-2 border-glass-border rounded-lg overflow-hidden shadow-xl"
          style={{ width: "64px", height: "96px" }}
        >
          {/* Card back during dealing - shows front after arriving */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 180 }}
            transition={{
              delay: delay / 1000 + 0.3, // Flip halfway through the journey
              duration: 0.2,
            }}
          />

          <motion.div
            className="absolute inset-0"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            transition={{
              delay: delay / 1000 + 0.3,
              duration: 0.2,
            }}
          >
            <img
              src={card.imagePath}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement!;
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-center px-1 bg-surface-dark text-muted-foreground">${card.type}</div>`;
              }}
            />
          </motion.div>

          {/* Glowing effect during animation */}
          <motion.div
            className="absolute inset-0 bg-neon-cyan/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              delay: delay / 1000,
              duration: 0.6,
              ease: "easeInOut",
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

export const DealingAnimationOverlay = ({
  dealingCards,
  onCardDealt,
}: DealingAnimationOverlayProps) => {
  console.log("DealingAnimationOverlay render:", { dealingCards });

  return (
    <AnimatePresence>
      {dealingCards.map((dealingCard) => (
        <DealingCardComponent
          key={dealingCard.id}
          dealingCard={dealingCard}
          onAnimationComplete={onCardDealt}
        />
      ))}
    </AnimatePresence>
  );
};
