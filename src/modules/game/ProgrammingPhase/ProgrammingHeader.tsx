"use client";

import { motion } from "framer-motion";

import { AudioControls } from "@/modules/audio/components/AudioControls";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProgrammingHeaderProps {
  filledCount: number;
  hostControls?: React.ReactNode;
  pauseButton?: React.ReactNode;
  currentRound?: number;
}

export const ProgrammingHeader = ({
  filledCount,
  hostControls,
  pauseButton,
  currentRound,
}: ProgrammingHeaderProps) => {
  const router = useRouter();

  return (
    <motion.div
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-glass-border p-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="sm"
            className="border-neon-teal/50 text-neon-teal hover:bg-neon-teal/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <motion.h1 className="text-2xl font-bold neon-text" style={{ color: "#00d4ff" }}>
            Programming Phase
          </motion.h1>

          {/* Round indicator */}
          {currentRound && (
            <motion.div
              className="text-xs font-semibold text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded border border-neon-cyan/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Round {currentRound}
            </motion.div>
          )}

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

        <div className="flex items-center gap-3">
          <AudioControls />
        </div>
      </div>
    </motion.div>
  );
};

