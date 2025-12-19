"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, Users, Zap, Shield, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ElectricBorder from "@/components/ElectricBorder/electric-border";

interface GamePauseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRequester: boolean;
  requesterUsername: string;
  onRespond?: (approved: boolean) => void;
  responses?: Record<string, boolean>;
  totalPlayers?: number;
  isLoading?: boolean;
}

/**
 * @author Truong Son NGO 2025-11-12 15:33:18 +0100 26
 */
export const GamePauseDialog = ({
  open,
  onOpenChange,
  isRequester,
  requesterUsername,
  onRespond,
  responses = {},
  totalPlayers = 0,
  isLoading = false,
}: GamePauseDialogProps) => {
  const responseCount = Object.keys(responses).length;
  const expectedResponses = totalPlayers - 1; // Exclude requester

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-neon-teal/50 max-w-lg p-0 overflow-hidden bg-surface-dark/95">
        <ElectricBorder
          color="#7df9ff"
          speed={0.8}
          chaos={0.5}
          thickness={1.5}
          style={{ borderRadius: 12 }}
        >
          <div className="relative">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-neon-teal/20 via-neon-blue/20 to-neon-magenta/20 p-4 border-b border-neon-teal/30">
              <DialogHeader>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center glow-teal mb-3"
                >
                  {isRequester ? (
                    <Clock className="w-6 h-6 text-neon-teal animate-pulse" />
                  ) : (
                    <Swords className="w-6 h-6 text-neon-magenta" />
                  )}
                </motion.div>
                <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-neon-teal via-neon-blue to-neon-magenta bg-clip-text text-transparent">
                  {isRequester ? "⏸️ PAUSE INITIATED" : "🚨 PAUSE REQUEST"}
                </DialogTitle>
                <DialogDescription className="text-center text-chrome-light text-sm mt-1">
                  {isRequester ? (
                    <span>Awaiting pilot responses...</span>
                  ) : (
                    <>
                      Pilot{" "}
                      <span className="text-neon-magenta font-bold">
                        {requesterUsername}
                      </span>{" "}
                      requests tactical pause
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="p-4">
              {isRequester ? (
                <div className="space-y-4">
                  {/* Status Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-3 border-neon-blue/30 bg-surface-dark/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-neon-blue animate-pulse" />
                        <span className="text-sm font-semibold text-neon-teal">
                          Response Status
                        </span>
                      </div>
                      <motion.span
                        key={responseCount}
                        initial={{ scale: 1.5, color: "#7df9ff" }}
                        animate={{ scale: 1, color: "#e0e0e0" }}
                        className="text-lg font-bold"
                      >
                        {responseCount} / {expectedResponses}
                      </motion.span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-surface-dark rounded-full overflow-hidden border border-neon-teal/20">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-teal via-neon-blue to-neon-magenta"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(responseCount / expectedResponses) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      {/* Animated glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Response Grid */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-chrome-light uppercase tracking-wider flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Pilot Responses
                    </h3>
                    <div className="grid gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {Object.entries(responses).map(([username, approved], index) => (
                          <motion.div
                            key={username}
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.8 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                              glass-panel p-2 rounded-lg border 
                              ${approved 
                                ? "border-green-500/50 bg-green-500/10" 
                                : "border-red-500/50 bg-red-500/10"
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`
                                  w-1.5 h-1.5 rounded-full animate-pulse
                                  ${approved ? "bg-green-500" : "bg-red-500"}
                                `} />
                                <span className="text-sm font-medium text-foreground">
                                  {username}
                                </span>
                              </div>
                              {approved ? (
                                <div className="flex items-center gap-1.5 text-green-400">
                                  <Check className="h-4 w-4" />
                                  <span className="text-xs font-bold">APPROVED</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-red-400">
                                  <X className="h-4 w-4" />
                                  <span className="text-xs font-bold">DENIED</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Waiting message */}
                  {responseCount < expectedResponses && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-3 glass-panel border-neon-blue/20"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="inline-block"
                      >
                        <Zap className="h-5 w-5 text-neon-blue" />
                      </motion.div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Waiting for remaining pilots to respond...
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* Info Box */}
                  <div className="glass-panel p-3 border-neon-teal/30 bg-neon-teal/5">
                    <p className="text-center text-sm text-chrome-light">
                      This will pause the current game session.
                      <br />
                      <span className="text-neon-teal font-semibold">
                        You can resume the battle later!
                      </span>
                    </p>
                  </div>

                  {/* Vote Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <ElectricBorder
                      color="#22c55e"
                      speed={1}
                      chaos={0.5}
                      thickness={1.5}
                      style={{ borderRadius: 8 }}
                    >
                      <Button
                        onClick={() => onRespond?.(true)}
                        disabled={isLoading}
                        className="w-full h-12 bg-green-600/20 hover:bg-green-600/40 text-green-400 border-none text-sm font-bold transition-all"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        APPROVE
                      </Button>
                    </ElectricBorder>

                    <ElectricBorder
                      color="#ef4444"
                      speed={1}
                      chaos={0.5}
                      thickness={1.5}
                      style={{ borderRadius: 8 }}
                    >
                      <Button
                        onClick={() => onRespond?.(false)}
                        disabled={isLoading}
                        className="w-full h-12 bg-red-600/20 hover:bg-red-600/40 text-red-400 border-none text-sm font-bold transition-all"
                      >
                        <X className="h-4 w-4 mr-2" />
                        DENY
                      </Button>
                    </ElectricBorder>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </ElectricBorder>
      </DialogContent>
    </Dialog>
  );
};