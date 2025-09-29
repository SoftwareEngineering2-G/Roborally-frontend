"use client";

import { motion } from "framer-motion";

interface DragDropIndicatorProps {
  isDragging: boolean;
}

export const DragDropIndicator = ({ isDragging }: DragDropIndicatorProps) => {
  if (!isDragging) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-20"
    >
      {/* Enhanced highlighting for the register area */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Multiple glow layers for better visibility */}
            <div className="absolute inset-0 bg-neon-teal/20 border-2 border-dashed border-neon-teal/80 rounded-lg animate-pulse shadow-2xl shadow-neon-teal/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-teal/15 to-neon-magenta/10 rounded-lg animate-pulse" />

            {/* Enhanced drop message */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-surface-dark/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-neon-teal/50 shadow-lg">
                <div className="text-sm text-neon-teal font-bold animate-pulse">
                  ⚡ Drop Programming Card Here ⚡
                </div>
                <div className="text-xs text-neon-teal/70 text-center mt-1">
                  Release to add to register
                </div>
              </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-neon-teal rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
