import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { RegisterSlot, ProgramCard } from "./types";
import { getCardTypeClasses } from "./utils";

interface RegisterSlotProps {
  register: RegisterSlot;
  onCardDrop: (card: ProgramCard) => void;
  onCardRemove: () => void;
  selected: boolean;
  onClick: () => void;
  isDragTarget?: boolean;
  isLocked?: boolean;
}

export const RegisterSlotComponent = ({
  register,
  onCardDrop,
  onCardRemove,
  selected,
  onClick,
  isDragTarget = false,
  isLocked = false,
}: RegisterSlotProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData("application/json");
    if (cardData) {
      const card = JSON.parse(cardData) as ProgramCard;
      onCardDrop(card);
    }
  };

  const handleClick = () => {
    if (register.card) {
      onCardRemove();
    } else {
      onClick();
    }
  };
  return (
    <div
      className={cn(
        "relative w-20 h-28 rounded-lg border-2 transition-all duration-normal cursor-pointer overflow-hidden",
        "bg-surface-dark/50 backdrop-blur-sm",
        selected
          ? "border-neon-teal shadow-glow-teal"
          : "border-glass-border hover:border-neon-teal/50",
        register.card && getCardTypeClasses(register.card.type),
        isDragTarget &&
          "border-neon-cyan border-dashed animate-pulse shadow-glow-cyan bg-neon-cyan/20 scale-105"
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Card Content */}
      {register.card && (
        <div className="absolute inset-0 animate-slide-up">
          <Image
            src={register.card.imagePath}
            alt={register.card.name}
            fill
            className="object-cover rounded-md"
            onError={(e) => {
              // Fallback to text display if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />

          {/* Fallback text display */}
          <div className="hidden absolute inset-2 flex-col items-center justify-center text-center">
            <div className="text-xs font-bold">{register.card.name}</div>
          </div>
        </div>
      )}

      {/* Empty Slot Placeholder */}
      {!register.card && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-xs">
          Empty
        </div>
      )}

      {/* Drop indicator with enhanced visibility */}
      {selected && (
        <>
          <div className="absolute inset-0 border-2 border-dashed border-neon-teal/70 rounded-lg animate-neon-pulse" />
          <div className="absolute inset-0 bg-neon-teal/15 rounded-lg animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neon-teal text-xs font-bold">
            DROP
          </div>
        </>
      )}

      {/* Enhanced drag target indicator */}
      {isDragTarget && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/30 to-neon-magenta/20 rounded-lg" />
          <div className="absolute inset-0 border-2 border-dashed border-neon-cyan/80 rounded-lg animate-bounce" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-neon-cyan text-xs font-bold animate-pulse">
              ⚡ DROP HERE ⚡
            </div>
          </div>
        </>
      )}

      {/* Locked indicator overlay */}
      {isLocked && register.card && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border-2 border-green-500/40 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500/30 backdrop-blur-sm rounded-full p-1.5 border border-green-400/50">
              <svg
                className="w-4 h-4 text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
