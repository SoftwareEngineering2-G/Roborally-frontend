"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SAMPLE_CARDS, INITIAL_REGISTERS } from "./types";
import { getFilledRegistersCount, isProgramComplete } from "./utils";
import { useProgrammingPhase } from "./hooks";
import { ProgramCardComponent } from "./ProgramCard";
import { RegisterSlotComponent } from "./RegisterSlot";
import { ProgramPreview } from "./ProgramPreview";
import { Deck } from "./Deck";

export const RegistersProgram = () => {
  const { state, handlers } = useProgrammingPhase(
    SAMPLE_CARDS,
    INITIAL_REGISTERS
  );

  const filledCount = getFilledRegistersCount(state.registers);
  const programComplete = isProgramComplete(state.registers);

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Progress */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold neon-text">Programming Phase</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-surface-medium px-3 py-1 rounded border border-glass-border">
              Registers: {filledCount}/5
            </div>
            {programComplete && (
              <Button
                className="bg-gradient-primary hover:shadow-glow-teal animate-neon-pulse"
                onClick={handlers.handleUploadProgram}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Program
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Programming Area */}
          <div className="lg:col-span-3 space-y-6">
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
                    onCardRemove={() => handlers.handleCardRemove(register.id)}
                    selected={state.selectedRegister === register.id}
                    onClick={() => handlers.handleRegisterSelect(register.id)}
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

          {/* Side Panel - Preview and Deck */}
          <div className="lg:col-span-1 space-y-6">
            <ProgramPreview registers={state.registers} />
            <Deck
              remainingCards={state.hand.length}
              className="glass-panel p-4 rounded-lg border border-glass-border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
