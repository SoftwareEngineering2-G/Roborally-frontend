"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import { RegisterSlotComponent } from "./RegisterSlot";
import { ProgramCardComponent } from "./ProgramCard";
import { ProgramCard, ProgrammingPhaseState } from "./types";

export interface ProgrammingControlsRef {
  getPlaceholderElements: () => (HTMLElement | null)[];
}

interface ProgrammingControlsProps {
  state: ProgrammingPhaseState;
  handlers: {
    handleDrop: (registerId: number, card: ProgramCard) => void;
    handleCardRemove: (registerId: number) => void;
    handleRegisterSelect: (registerId: number) => void;
    handleCardSelect: (card: ProgramCard) => void;
    handleDragStart: (card: ProgramCard) => void;
    handleDragEnd: () => void;
    handleUploadProgram: () => void; // Lock in the programmed registers
  };
  showControls: boolean;
  onToggleControls: () => void;
  filledCount: number;
  programComplete: boolean;
  isSubmitting: boolean;
}

export const ProgrammingControls = forwardRef<
  ProgrammingControlsRef,
  ProgrammingControlsProps
>(function ProgrammingControls({ state, handlers, showControls, onToggleControls, filledCount, programComplete, isSubmitting }, ref) {
  // Create refs for all 9 slots (both cards and placeholders)
  const slotRefs = useRef<(HTMLElement | null)[]>(new Array(9).fill(null));

  // Expose method to get placeholder elements
  useImperativeHandle(
    ref,
    () => ({
      getPlaceholderElements: () => slotRefs.current,
    }),
    []
  );

  return (
    <>
      {/* Controls Visibility Toggle - Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
        className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50"
      >
        <Button
          onClick={onToggleControls}
          size="lg"
          className={`
            w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110
            ${
              showControls
                ? "bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 shadow-glow-cyan"
                : "bg-orange-500/20 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/30 shadow-glow-orange animate-pulse"
            }
            backdrop-blur-xl
          `}
          title={
            showControls
              ? "Hide Programming Controls - Get Clear Board View"
              : "Show Programming Controls - Access Registers & Hand"
          }
        >
          {showControls ? (
            <EyeOff className="w-6 h-6" />
          ) : (
            <Eye className="w-6 h-6" />
          )}
        </Button>

        {/* Helper text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute right-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap"
        >
          <div
            className={`
            text-xs px-3 py-2 rounded-lg backdrop-blur-xl border
            ${
              showControls
                ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan"
                : "bg-orange-500/10 border-orange-500/30 text-orange-500"
            }
          `}
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Programming Controls - Bottom */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              delay: showControls ? 0.3 : 0,
              duration: 0.5,
              ease: showControls ? "easeOut" : "easeIn",
            }}
            className="fixed bottom-4 left-4 right-4 z-40"
          >
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Registers - Floating at bottom */}
              <Card className="glass-panel p-4 backdrop-blur-xl bg-surface-dark/90 border-2 border-neon-teal/30 shadow-glow-teal">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neon-teal">
                    Program Registers
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {filledCount}/5 Ready
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  {state.registers.map((register) => (
                    <div key={register.id} className="relative">
                      <RegisterSlotComponent
                        register={register}
                        onCardDrop={(card) =>
                          handlers.handleDrop(register.id, card)
                        }
                        onCardRemove={() =>
                          handlers.handleCardRemove(register.id)
                        }
                        selected={state.selectedRegister === register.id}
                        onClick={() =>
                          handlers.handleRegisterSelect(register.id)
                        }
                        isDragTarget={state.isDragging}
                      />
                      {/* Fixed sequence number positioning */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-neon-teal bg-surface-dark/80 px-2 py-1 rounded border border-neon-teal/30">
                        {register.id}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Lock In Program Section */}
                {programComplete && (
                  <div className="mt-6 pt-4 border-t border-neon-teal/20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm font-medium text-neon-teal">
                          Program Complete!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ready to lock in your sequence
                        </p>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <Button
                          className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-semibold shadow-lg hover:shadow-amber-500/30 border border-amber-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          onClick={handlers.handleUploadProgram}
                          disabled={isSubmitting}
                          size="lg"
                        >
                          <div className="flex items-center gap-2">
                            <Lock className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                            <span>{isSubmitting ? 'Locking In...' : 'Lock In Program'}</span>
                          </div>
                          {/* Subtle glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 rounded-md blur-sm -z-10 animate-pulse" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Hand Cards - Floating panel */}
              <Card className="glass-panel p-4 backdrop-blur-xl bg-surface-dark/90 border-2 border-neon-magenta/30 shadow-glow-magenta">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neon-magenta">
                    Hand
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {state.hand.length} cards
                  </div>
                </div>
                <div className="grid grid-cols-9 gap-2 max-w-4xl mx-auto min-h-[6rem]">
                  {/* Render all 9 slots with identical container styling */}
                  {Array.from({ length: 9 }).map((_, index) => {
                    const card = state.hand[index];
                    return (
                      <div
                        key={card ? card.id : `slot-${index}`}
                        className="relative w-16 h-24 rounded-lg flex items-center justify-center"
                        data-slot-index={index}
                        data-has-card={!!card}
                      >
                        {card ? (
                          <div
                            ref={(el) => {
                              slotRefs.current[index] = el;
                            }}
                            className="w-16 h-24"
                          >
                            <ProgramCardComponent
                              card={card}
                              selected={state.selectedCard?.id === card.id}
                              onClick={() => handlers.handleCardSelect(card)}
                              onDragStart={() => handlers.handleDragStart(card)}
                              onDragEnd={handlers.handleDragEnd}
                              isDragging={state.isDragging}
                            />
                          </div>
                        ) : (
                          <div
                            ref={(el) => {
                              slotRefs.current[index] = el;
                            }}
                            className="w-16 h-24 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-surface-dark/20 backdrop-blur-sm flex items-center justify-center"
                            data-hand-placeholder
                          >
                            <div className="text-xs text-muted-foreground/40">
                              {index + 1}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle indicator when controls are hidden */}
      {!showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30"
        >
          <Card className="glass-panel p-2 backdrop-blur-xl bg-surface-dark/60 border border-glass-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>Programming controls hidden</span>
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
});
