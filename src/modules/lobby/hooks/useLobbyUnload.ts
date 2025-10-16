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
      e.preventDefault();
      const confirmed = window.confirm(
        "Are you sure you want to leave the lobby? You will be disconnected."
      );
      
      if (!confirmed) {
        return
      }

      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100"}/game-lobbies/${gameId}/leave`,
        JSON.stringify({ gameId, username })
      );

      return;
    };

    // Handler for popstate (browser back button)
    const handlePopState = async (e: PopStateEvent) => {
      const confirmed = window.confirm(
        "Are you sure you want to leave the lobby? You will be disconnected."
      );

      if (!confirmed) {
        // Ripristina la history per non andare indietro
        history.pushState(null, "", window.location.href);
        return;
      }

      try {
        await onLeave();
      } catch (error) {
        console.error("Error leaving lobby:", error);
      }
      
      router.back();    
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