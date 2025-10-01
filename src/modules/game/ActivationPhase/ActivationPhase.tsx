"use client";

import { motion } from "framer-motion";
import { GameBoard } from "../components/GameBoard";

export const ActivationPhase = () => {
  return (
    <motion.div
      key="activation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-full"
    >
      {/* Side-by-side layout: Board on left, Content on right */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex">
        {/* Left side - Game Board */}
        <div className="flex-1 flex items-center justify-center p-4">
          <GameBoard className="max-w-2xl w-full" />
        </div>
        
        {/* Right side - Activation Content */}
        <div className="w-80 p-6 bg-surface-dark/30 border-l border-glass-border">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-neon-teal mb-4">
                Activation Phase
              </h1>
              <p className="text-muted-foreground">
                Robot activation coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};