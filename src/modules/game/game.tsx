"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardProgramming } from "./CardProgramming";
import { GameHostControls } from "./GameHostControls";

interface Props {
  gameId: string;
  isHost: boolean;
}

export default function Game({ gameId, isHost }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/signin");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  console.log("Is host:", isHost);
  
  // Don't render until we have username
  if (!username) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <CardProgramming 
        gameId={gameId}
        username={username}
        hostControls={isHost ? <GameHostControls gameId={gameId} /> : undefined}
      />
    </div>
  );
}
