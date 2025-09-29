"use client";

import { RegistersProgram } from "./RegistersProgram/registers-program";

interface Props {
  gameId: string;
}

export default function Game({ gameId }: Props) {
  return (
    <div>
      <RegistersProgram />
    </div>
  );
}
