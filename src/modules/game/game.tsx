"use client";

import { RegistersProgram } from "./RegistersProgram/registers-program";
import { GameHostControls } from "./GameHostControls";

interface Props {
  gameId: string;
  isHost: boolean;
}

export default function Game({ gameId, isHost }: Props) {
  return (
    <div className="container mx-auto p-4">
      {isHost && <GameHostControls gameId={gameId} />}
      <RegistersProgram />
    </div>
  );
}
