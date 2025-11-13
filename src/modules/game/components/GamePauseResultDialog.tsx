"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trophy, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ElectricBorder from "@/components/ElectricBorder/electric-border";

interface GamePauseResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: boolean;
  requestedBy: string;
  playerResponses: Record<string, boolean>;
  onContinue: () => void;
}

export const GamePauseResultDialog = ({
  open,
  onOpenChange,
  result,
  playerResponses,
  onContinue,
}: GamePauseResultDialogProps) => {
  const totalVotes = Object.keys(playerResponses).length;
  const approvedVotes = Object.values(playerResponses).filter(Boolean).length;
  const deniedVotes = totalVotes - approvedVotes;
  const approvalPercentage = totalVotes > 0 ? Math.round((approvedVotes / totalVotes) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-neon-teal/50 max-w-lg p-0 overflow-hidden bg-surface-dark/95">
        <ElectricBorder
          color={result ? "#22c55e" : "#ef4444"}
          speed={1}
          chaos={1}
          thickness={2}
          style={{ borderRadius: 12 }}
        >
          <div className="relative">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${
                  result 
                    ? "from-green-500 via-emerald-500 to-teal-500" 
                    : "from-red-500 via-orange-500 to-yellow-500"
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>

            {/* Header */}
            <div className="relative p-4 border-b border-chrome/30">
              <DialogHeader>
                <motion.div
                  initial={{ scale: 0, rotate: result ? -180 : 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                  className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-3"
                  style={{
                    boxShadow: result 
                      ? "0 0 30px rgba(34, 197, 94, 0.6)" 
                      : "0 0 30px rgba(239, 68, 68, 0.6)",
                  }}
                >
                  {result ? (
                    <Trophy className="w-8 h-8 text-green-400" />
                  ) : (
                    <Skull className="w-8 h-8 text-red-400" />
                  )}
                </motion.div>

                <DialogTitle className="text-2xl font-bold text-center">
                  {result ? (
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                    >
                      🎯 PAUSE APPROVED
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
                    >
                      ⚔️ PAUSE DENIED
                    </motion.span>
                  )}
                </DialogTitle>

                <DialogDescription className="text-center text-chrome-light text-sm mt-2">
                  {result ? (
                    <span>
                      Majority vote passed!{" "}
                      <span className="text-green-400 font-bold">
                        The battle will be paused.
                      </span>
                    </span>
                  ) : (
                    <span>
                      Majority vote failed.{" "}
                      <span className="text-red-400 font-bold">
                        The battle continues!
                      </span>
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="relative p-4 space-y-4">
              {/* Voting Stats - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                {/* Progress Bar */}
                <div className="relative h-10 bg-surface-dark rounded-full overflow-hidden border border-chrome/30">
                  {/* Approved section */}
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-end pr-4"
                    initial={{ width: 0 }}
                    animate={{ width: `${approvalPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {approvedVotes > 0 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white font-bold text-sm"
                      >
                        {approvedVotes} ✓
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Denied section */}
                  <motion.div
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-600 to-red-400 flex items-center justify-start pl-4"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - approvalPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {deniedVotes > 0 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white font-bold text-sm"
                      >
                        {deniedVotes} ✗
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Center line */}
                  <div className="absolute left-1/2 top-0 h-full w-px bg-chrome/50" />
                </div>

                {/* Vote breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel p-2 border-green-500/30 bg-green-500/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-bold text-xs">Approved</span>
                      </div>
                      <div className="text-lg font-bold text-green-400">
                        {approvedVotes}
                      </div>
                    </div>
                  </div>
                  <div className="glass-panel p-2 border-red-500/30 bg-red-500/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-red-400">
                        <XCircle className="h-4 w-4" />
                        <span className="font-bold text-xs">Denied</span>
                      </div>
                      <div className="text-lg font-bold text-red-400">
                        {deniedVotes}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ElectricBorder
                  color={result ? "#22c55e" : "#7df9ff"}
                  speed={1}
                  chaos={0.8}
                  thickness={2}
                  style={{ borderRadius: 8 }}
                >
                  <Button
                    onClick={onContinue}
                    className={`
                      w-full h-11 text-sm font-bold border-none
                      ${result 
                        ? "bg-green-600/30 hover:bg-green-600/50 text-green-400" 
                        : "bg-neon-teal/30 hover:bg-neon-teal/50 text-neon-teal"
                      }
                    `}
                  >
                    {result ? "🏠 RETURN TO HOME" : "⚔️ CONTINUE BATTLE"}
                  </Button>
                </ElectricBorder>
              </motion.div>
            </div>
          </div>
        </ElectricBorder>
      </DialogContent>
    </Dialog>
  );
};
