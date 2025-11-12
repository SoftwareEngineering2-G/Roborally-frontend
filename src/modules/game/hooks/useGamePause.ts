"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { 
  useRequestGamePauseMutation, 
  useRespondToGamePauseMutation 
} from "@/redux/api/game/gameApi";
import { useSignalRContext } from "@/providers/SignalRProvider";
import { toast } from "sonner";
import type {
  GamePauseRequestedEvent,
  GamePauseResponseEvent,
  GamePauseResultEvent,
} from "@/types/signalr";

interface UseGamePauseOptions {
  gameId: string;
  username: string;
}

export const useGamePause = ({ gameId, username }: UseGamePauseOptions) => {
  const router = useRouter();
  const { game: signalR } = useSignalRContext();

  const [requestGamePause, { isLoading: isRequestingPause }] = useRequestGamePauseMutation();
  const [respondToGamePause, { isLoading: isResponding }] = useRespondToGamePauseMutation();

  // Local UI state - không lưu trong Redux nữa
  const [pauseRequest, setPauseRequest] = useState<{
    isActive: boolean;
    requester: string;
    responses: Record<string, boolean>;
  } | null>(null);
  
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [pauseResult, setPauseResult] = useState<{
    result: boolean;
    requestedBy: string;
    playerResponses: Record<string, boolean>;
  } | null>(null);

  const currentGame = useAppSelector((state) => state.game.currentGame);

  const isRequester = pauseRequest?.requester === username;
  const totalPlayers = currentGame?.players.length || 0;

  // Handle request pause
  const handleRequestPause = async () => {
    try {
      await requestGamePause({ gameId, username }).unwrap();
      setPauseRequest({
        isActive: true,
        requester: username,
        responses: {},
      });
      setShowRequestDialog(true);
      toast.info("Pause request sent to all players");
    } catch (error) {
      console.error("Failed to request pause:", error);
      toast.error("Failed to send pause request");
    }
  };

  // Handle respond to pause
  const handleRespondToPause = async (approved: boolean) => {
    try {
      await respondToGamePause({ gameId, username, approved }).unwrap();
      setShowRequestDialog(false);
      
      toast.success(approved ? "You approved the pause" : "You denied the pause");
    } catch (error) {
      console.error("Failed to respond to pause:", error);
      toast.error("Failed to send your response");
    }
  };

  // Handle result dialog continue
  const handleContinue = () => {
    setShowResultDialog(false);
    setPauseResult(null);
    setPauseRequest(null);

    if (pauseResult?.result) {
      // Navigate to home
      router.push("/");
    }
  };

  // Handle cancel request (requester only)
  const handleCancelRequest = () => {
    setShowRequestDialog(false);
    setPauseRequest(null);
    // TODO: Optionally call API to cancel the request
  };

  // Listen for SignalR events
  useEffect(() => {
    if (!signalR.isConnected) return;

    // Pause request received
    const handleGamePauseRequested = (...args: unknown[]) => {
      const data = args[0] as GamePauseRequestedEvent;

      if (data.gameId !== gameId) return;

      // If not the requester, show dialog
      if (data.requesterUsername !== username) {
        setPauseRequest({
          isActive: true,
          requester: data.requesterUsername,
          responses: {},
        });
        setShowRequestDialog(true);
        toast.info(`${data.requesterUsername} has requested to pause the game`);
      }
    };

    // Player response received (for requester to see)
    const handleGamePauseResponse = (...args: unknown[]) => {
      const data = args[0] as GamePauseResponseEvent;

      if (data.gameId !== gameId) return;

      setPauseRequest((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          responses: {
            ...prev.responses,
            [data.username]: data.approved,
          },
        };
      });
    };

    // Final result received
    const handleGamePauseResult = (...args: unknown[]) => {
      const data = args[0] as GamePauseResultEvent;

      if (data.gameId !== gameId) return;

      // Close request dialog
      setShowRequestDialog(false);

      // Show result dialog
      setPauseResult({
        result: data.result,
        requestedBy: data.requestedBy,
        playerResponses: data.playerResponses,
      });
      setShowResultDialog(true);

      // Show toast
      if (data.result) {
        toast.success("Game paused! Returning to home...");
      } else {
        toast.error("Pause request denied. Game continues.");
      }
    };

    signalR.on("GamePauseRequested", handleGamePauseRequested);
    signalR.on("GamePauseResponse", handleGamePauseResponse);
    signalR.on("GamePauseResult", handleGamePauseResult);

    return () => {
      signalR.off("GamePauseRequested");
      signalR.off("GamePauseResponse");
      signalR.off("GamePauseResult");
    };
  }, [signalR.isConnected, gameId, username, signalR]);

  return {
    // Actions
    handleRequestPause,
    handleRespondToPause,
    handleContinue,
    handleCancelRequest,

    // State
    showRequestDialog,
    setShowRequestDialog,
    showResultDialog,
    pauseResult,
    pauseRequest,
    isRequester,
    totalPlayers,

    // Loading states
    isRequestingPause,
    isResponding,
  };
};
