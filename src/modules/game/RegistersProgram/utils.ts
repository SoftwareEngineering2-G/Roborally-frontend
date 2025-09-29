import type { ProgramCard } from "./types";

export const getCardTypeClasses = (type: ProgramCard["type"]) => {
  const typeMap = {
    move1: "bg-neon-teal/20 border-neon-teal shadow-glow-teal text-neon-teal",
    move2: "bg-neon-teal/20 border-neon-teal shadow-glow-teal text-neon-teal",
    move3: "bg-neon-teal/20 border-neon-teal shadow-glow-teal text-neon-teal",
    moveback: "bg-neon-lime/20 border-neon-lime text-neon-lime",
    powerup:
      "bg-neon-magenta/20 border-neon-magenta shadow-glow-magenta text-neon-magenta",
    rotateleft:
      "bg-neon-blue/20 border-neon-blue shadow-glow-blue text-neon-blue",
    rotateright:
      "bg-neon-blue/20 border-neon-blue shadow-glow-blue text-neon-blue",
    uturn:
      "bg-neon-magenta/20 border-neon-magenta shadow-glow-magenta text-neon-magenta",
  };
  return typeMap[type];
};

export const getFilledRegistersCount = (registers: Array<{ card: any }>) => {
  return registers.filter((reg) => reg.card !== null).length;
};

export const isProgramComplete = (registers: Array<{ card: any }>) => {
  return registers.every((reg) => reg.card !== null);
};
