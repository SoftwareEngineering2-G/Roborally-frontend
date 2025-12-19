import type { ProgramCard } from "./types";

/**
 * @author Sachin Baral 2025-09-29 18:45:54 +0200 3
 */
export const getCardTypeClasses = (type: ProgramCard["type"]) => {
  const typeMap = {
    "Move 1": "bg-neon-teal/20 border-neon-teal shadow-glow-teal text-neon-teal",
    "Move 2": "bg-neon-teal/20 border-neon-teal shadow-glow-teal text-neon-teal",
    "Move 3": "bg-neon-teal/20 border-neon-teal shadow-glow-teal text-neon-teal",
    "Move Back": "bg-neon-lime/20 border-neon-lime text-neon-lime",
    "Rotate Left": "bg-neon-blue/20 border-neon-blue shadow-glow-blue text-neon-blue",
    "Rotate Right": "bg-neon-blue/20 border-neon-blue shadow-glow-blue text-neon-blue",
    "U-Turn": "bg-neon-magenta/20 border-neon-magenta shadow-glow-magenta text-neon-magenta",
    Again: "bg-neon-yellow/20 border-neon-yellow shadow-glow-yellow text-neon-yellow",
    "Swap Position": "bg-neon-purple/20 border-neon-purple shadow-glow-purple text-neon-purple",
    "Movement Choice": "bg-neon-purple/20 border-neon-purple shadow-glow-purple text-neon-purple",
  };
  return typeMap[type];
};

/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 25
 */
export const getFilledRegistersCount = (registers: Array<{ card: ProgramCard | null }>) => {
  return registers.filter((reg) => reg.card !== null).length;
};

/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 29
 */
export const isProgramComplete = (registers: Array<{ card: ProgramCard | null }>) => {
  return registers.every((reg) => reg.card !== null);
};
