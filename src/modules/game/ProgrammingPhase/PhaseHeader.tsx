"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type GamePhase = "programming" | "activation";

interface PhaseHeaderProps {
  currentPhase: GamePhase;
  filledCount: number;
  programComplete: boolean;
  onUploadProgram: () => void;
  hostControls?: React.ReactNode;
}

/**
 * @author Sachin Baral 2025-09-29 19:51:47 +0200 17
 */
export const PhaseHeader = ({
  currentPhase,
  filledCount,
  programComplete,
  onUploadProgram,
  hostControls,
}: PhaseHeaderProps) => {
  return (
    <motion.div
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-glass-border p-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.h1
            className="text-2xl font-bold neon-text"
            animate={{
              color: currentPhase === "programming" ? "#00d4ff" : "#ff00a0",
            }}
            transition={{ duration: 0.3 }}
          >
            {currentPhase === "programming" ? "Programming Phase" : "Activation Phase"}
          </motion.h1>

          {currentPhase === "programming" && (
            <motion.div
              className="text-sm bg-surface-medium px-3 py-1 rounded border border-glass-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              Registers: {filledCount}/5
            </motion.div>
          )}

          {/* Host Controls - Subtle integration */}
          {hostControls && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center"
            >
              {hostControls}
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentPhase === "programming" && programComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                className="bg-gradient-primary hover:shadow-glow-teal animate-neon-pulse"
                onClick={onUploadProgram}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Program
              </Button>
            </motion.div>
          )}

          {/*
            <Button
            onClick={onPhaseToggle}
            className={`
              relative overflow-hidden transition-all duration-300
              ${
              currentPhase === "programming"
                ? "bg-neon-magenta/20 border-neon-magenta text-neon-magenta hover:bg-neon-magenta/30"
                : "bg-neon-teal/20 border-neon-teal text-neon-teal hover:bg-neon-teal/30"
              }
            `}
            >
            {currentPhase === "programming" ? (
              <>
              <Play className="w-4 h-4 mr-2" />
              Start Activation
              <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programming
              <Settings className="w-4 h-4 ml-2" />
              </>
            )}
            </Button>
            */}
        </div>
      </div>
    </motion.div>
  );
};
