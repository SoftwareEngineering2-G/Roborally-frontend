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
      {/* Highlighting the register area */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-teal/10 border-2 border-dashed border-neon-teal/50 rounded-lg animate-pulse" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-neon-teal bg-surface-dark px-3 py-1 rounded">
              Drop card here
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
