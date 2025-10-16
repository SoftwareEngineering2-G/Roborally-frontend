"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseLobbyUnloadProps {
  gameId: string;
  username: string | null;
  onLeave: () => Promise<void>;
}

export const useLobbyUnload = ({
  gameId,
  username,
  onLeave,
}: UseLobbyUnloadProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!gameId || !username) return;

    // Handler for beforeunload (browser close, refresh, URL change)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100"}/game-lobbies/${gameId}/leave`,
        JSON.stringify({ gameId, username })
      );
    };

    // Handler for popstate (browser back button)
    const handlePopState = async (e: PopStateEvent) => {
      try {
        await onLeave();
      } catch (error) {
        console.error("Failed to leave lobby:", error);
      }
    };

    // Add listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [gameId, username, onLeave, router]);
};