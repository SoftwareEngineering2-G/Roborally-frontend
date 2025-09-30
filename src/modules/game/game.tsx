"use client";

import { CardProgramming } from "./CardProgramming";
import { GameHostControls } from "./GameHostControls";

interface Props {
  gameId: string;
  isHost: boolean;
}

export default function Game({ gameId, isHost }: Props) {
  console.log("Is host:", isHost);
  
  return (
    <div className="container mx-auto p-4">
      <CardProgramming 
        hostControls={isHost ? <GameHostControls gameId={gameId} /> : undefined}
      />
    </div>
  );
}
