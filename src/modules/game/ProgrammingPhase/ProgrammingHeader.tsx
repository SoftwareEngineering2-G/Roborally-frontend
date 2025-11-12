"use client";

import { motion } from "framer-motion";

interface ProgrammingHeaderProps {
  filledCount: number;
  hostControls?: React.ReactNode;
  pauseButton?: React.ReactNode;
}

export const ProgrammingHeader = ({
  filledCount,
  hostControls,
  pauseButton,
}: ProgrammingHeaderProps) => {
  return (
    <motion.div
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-glass-border p-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.h1 className="text-2xl font-bold neon-text" style={{ color: "#00d4ff" }}>
            Programming Phase
          </motion.h1>

          <motion.div
            className="text-sm bg-surface-medium px-3 py-1 rounded border border-glass-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Registers: {filledCount}/5
          </motion.div>

          {/* Pause Button */}
          {pauseButton && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              {pauseButton}
            </motion.div>
          )}

          {/* Host Controls - Subtle integration */}
          {hostControls && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              {hostControls}
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">{/* Space for future header actions */}</div>
      </div>
    </motion.div>
  );
};
