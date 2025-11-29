import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProgramCard } from "./types";
import { getCardTypeClasses } from "./utils";
import { useAudio } from "@/modules/audio/AudioContext";

interface ProgramCardProps {
  card: ProgramCard;
  selected: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export const ProgramCardComponent = ({
  card,
  selected,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: ProgramCardProps) => {
  const { playSFX } = useAudio();
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    onDragStart();
  };

  return (
    <div
      className={cn(
        "relative w-16 h-24 rounded-lg border-2 transition-all duration-normal cursor-pointer overflow-hidden",
        "bg-surface-medium/80 backdrop-blur-sm card-hover",
        selected ? "ring-2 ring-neon-teal scale-105" : "",
        getCardTypeClasses(card.type),
        "hover:scale-105 hover:z-10",
        isDragging ? "opacity-50" : ""
      )}
      onClick={() => {
        playSFX("ui_click");
        onClick();
      }}
      onMouseEnter={() => {
        playSFX("ui_hover");
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Card Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={card.imagePath}
          alt={card.name}
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
          <div className="text-xs font-bold">{card.name}</div>
        </div>
      </div>

      {/* Card overlay for better UX feedback */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-200",
          selected ? "bg-neon-teal/20" : "hover:bg-white/10"
        )}
      />

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-teal rounded-full animate-neon-pulse z-10" />
      )}
    </div>
  );
};
