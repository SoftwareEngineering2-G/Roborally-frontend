"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Settings, Play, ArrowRight, ArrowLeft } from "lucide-react";
import { GameBoard } from "@/components/GameBoard";
import { SAMPLE_CARDS, INITIAL_REGISTERS } from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { ProgramCardComponent } from "./ProgramCard";
import { RegisterSlotComponent } from "./RegisterSlot";
import { Deck } from "./Deck";

type GamePhase = "programming" | "activation";

export const RegistersProgram = () => {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("programming");
  const { state, handlers } = useProgrammingPhase(
    SAMPLE_CARDS,
    INITIAL_REGISTERS
  );

  const filledCount = getFilledRegistersCount(state.registers);
  const programComplete = isProgramComplete(state.registers);

  const togglePhase = () => {
    setCurrentPhase((prev) =>
      prev === "programming" ? "activation" : "programming"
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Phase Toggle Header */}
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
              {currentPhase === "programming"
                ? "Programming Phase"
                : "Activation Phase"}
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
                  onClick={handlers.handleUploadProgram}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Program
                </Button>
              </motion.div>
            )}

            <Button
              onClick={togglePhase}
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
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative p-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentPhase === "activation" ? (
              // Activation Phase - Board Focus
              <motion.div
                key="activation"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Board takes center stage */}
                <div className="flex justify-center">
                  <GameBoard className="max-w-3xl w-full" />
                </div>

                {/* Compact registers display for reference */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="max-w-2xl mx-auto"
                >
                  <Card className="p-4 glass-panel">
                    <h3 className="text-lg font-semibold mb-3 text-neon-teal text-center">
                      Current Program
                    </h3>
                    <div className="flex gap-2 justify-center">
                      {state.registers.map((register) => (
                        <div key={register.id} className="relative">
                          <div className="w-12 h-16 bg-surface-medium border border-glass-border rounded-md flex items-center justify-center">
                            {register.card ? (
                              <img
                                src={register.card.imagePath}
                                alt={register.card.type}
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling!.textContent =
                                    register.card!.type;
                                }}
                              />
                            ) : null}
                            <span className="text-xs text-center px-1 hidden">
                              {register.card?.type || "Empty"}
                            </span>
                          </div>
                          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                            {register.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              // Programming Phase - Programming Tools Focus
              <motion.div
                key="programming"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Programming Tools */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Registers Area */}
                    <Card className="p-6 glass-panel">
                      <h2 className="text-xl font-semibold mb-4 text-neon-teal">
                        Registers
                      </h2>
                      <div className="flex gap-3 justify-center">
                        {state.registers.map((register) => (
                          <RegisterSlotComponent
                            key={register.id}
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
                          />
                        ))}
                      </div>
                    </Card>

                    {/* Hand Area */}
                    <Card className="p-6 glass-panel">
                      <h2 className="text-xl font-semibold mb-4 text-neon-magenta">
                        Hand
                      </h2>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
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

                  {/* Side Panel - Board Preview & Deck */}
                  <div className="xl:col-span-1 space-y-6">
                    {/* Smaller board preview */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <GameBoard className="opacity-60 scale-75 origin-top" />
                    </motion.div>

                    {/* Deck */}
                    <Deck
                      remainingCards={state.hand.length}
                      className="glass-panel p-4 rounded-lg border border-glass-border"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
