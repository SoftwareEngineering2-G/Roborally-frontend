"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { RegisterSlotComponent } from "./RegisterSlot";
import { ProgramCardComponent } from "./ProgramCard";
import { ProgramCard, RegisterSlot, ProgrammingPhaseState } from "./types";

interface ProgrammingControlsProps {
  state: ProgrammingPhaseState;
  handlers: {
    handleDrop: (registerId: number, card: ProgramCard) => void;
    handleCardRemove: (registerId: number) => void;
    handleRegisterSelect: (registerId: number) => void;
    handleCardSelect: (card: ProgramCard) => void;
    handleDragStart: (card: ProgramCard) => void;
    handleDragEnd: () => void;
  };
  showControls: boolean;
  onToggleControls: () => void;
  filledCount: number;
}

export const ProgrammingControls = forwardRef<
  HTMLDivElement,
  ProgrammingControlsProps
>(({ state, handlers, showControls, onToggleControls, filledCount }, ref) => {
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
                <div
                  ref={ref}
                  className="grid grid-cols-9 gap-2 max-w-4xl mx-auto"
                >
                  {state.hand.map((card) => (
                    <ProgramCardComponent
                      key={card.id}
                      card={card}
                      selected={state.selectedCard?.id === card.id}
                      onClick={() => handlers.handleCardSelect(card)}
                      onDragStart={() => handlers.handleDragStart(card)}
                      onDragEnd={handlers.handleDragEnd}
                      isDragging={state.isDragging}
                    />
                  ))}
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
