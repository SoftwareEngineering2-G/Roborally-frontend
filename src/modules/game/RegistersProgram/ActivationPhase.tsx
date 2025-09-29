"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { GameBoard } from "@/components/GameBoard";
import { RegisterSlot } from "./types";

interface ActivationPhaseProps {
  registers: RegisterSlot[];
}

export const ActivationPhase = ({ registers }: ActivationPhaseProps) => {
  return (
    <motion.div
      key="activation"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-full p-4"
    >
      {/* Board takes center stage */}
      <GameBoard className="max-w-4xl w-full" />

      {/* Compact registers display at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-6 max-w-2xl w-full"
      >
        <Card className="p-4 glass-panel">
          <h3 className="text-lg font-semibold mb-3 text-neon-teal text-center">
            Current Program
          </h3>
          <div className="flex gap-2 justify-center">
            {registers.map((register) => (
              <div key={register.id} className="relative">
                <div className="w-12 h-16 bg-surface-medium border border-glass-border rounded-md flex items-center justify-center">
                  {register.card ? (
                    <img
                      src={register.card.imagePath}
                      alt={register.card.type}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling!.textContent =
                          register.card!.type;
                      }}
                    />
                  ) : null}
                  <span className="text-xs text-center px-1 hidden">
                    {register.card?.type || "Empty"}
                  </span>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground bg-surface-dark px-1 rounded">
                  {register.id}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
