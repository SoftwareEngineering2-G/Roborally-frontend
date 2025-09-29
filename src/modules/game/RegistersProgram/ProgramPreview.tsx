import React from "react";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { RegisterSlot } from "./types";
import { getCardTypeClasses } from "./utils";

interface ProgramPreviewProps {
  registers: RegisterSlot[];
}

export const ProgramPreview = ({ registers }: ProgramPreviewProps) => {
  return (
    <Card className="p-4 glass-panel sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-4 h-4 text-neon-blue" />
        <h3 className="text-lg font-semibold text-neon-blue">
          Program Preview
        </h3>
      </div>

      <div className="space-y-2">
        {registers.map((register) => (
          <div key={register.id} className="flex items-center gap-2 text-sm">
            <span className="w-6 h-6 rounded-full bg-surface-dark border border-glass-border flex items-center justify-center text-xs">
              {register.id}
            </span>
            {register.card ? (
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  getCardTypeClasses(register.card.type)
                )}
              >
                {register.card.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Empty</span>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-glass-border text-xs text-muted-foreground">
        <p className="mb-2">💡 Instructions:</p>
        <ul className="space-y-1">
          <li>• Tap card → tap register</li>
          <li>• Or drag & drop cards</li>
          <li>• Tap register to remove card</li>
          <li>• Fill all 5 registers to upload</li>
        </ul>
      </div>
    </Card>
  );
};
