import { useEffect, useState, useCallback, useRef } from "react";
import { signalRConnection } from "@/lib/signalr/connection";
import {
  SignalRConnectionState,
  SignalRHookOptions,
  EventHandler,
  ErrorHandler,
} from "@/types/signalr";

/**
 * Core hook for managing SignalR connection state
 */
export function useSignalRConnection() {
  const [connectionState, setConnectionState] =
    useState<SignalRConnectionState>(signalRConnection.getConnectionState());
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe to connection state changes
    const unsubscribeState =
      signalRConnection.onStateChange(setConnectionState);

    // Subscribe to errors
    const unsubscribeError = signalRConnection.onError((err) => {
      setError(err);
      console.error("SignalR Error:", err);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeState();
      unsubscribeError();
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      setError(null);
      await signalRConnection.start();
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await signalRConnection.stop();
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  return {
    connectionState,
    isConnected: connectionState === SignalRConnectionState.Connected,
    isConnecting: connectionState === SignalRConnectionState.Connecting,
    isReconnecting: connectionState === SignalRConnectionState.Reconnecting,
    error,
    connect,
    disconnect,
    clearError: () => setError(null),
  };
}

/**
 * Generic hook for subscribing to SignalR events
 */
export function useSignalREvent<T = any>(
  eventName: string,
  handler: EventHandler<T>,
  options: SignalRHookOptions = {}
) {
  const { enabled = true } = options;
  const handlerRef = useRef(handler);

  // Keep handler reference current
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const wrappedHandler = (data: T) => {
      handlerRef.current(data);
    };

    try {
      signalRConnection.on(eventName, wrappedHandler);
    } catch (error) {
      console.error(`Failed to subscribe to event ${eventName}:`, error);
    }

    return () => {
      try {
        signalRConnection.off(eventName, wrappedHandler);
      } catch (error) {
        console.error(`Failed to unsubscribe from event ${eventName}:`, error);
      }
    };
  }, [eventName, enabled]);
}

/**
 * Hook for managing lobby group membership
 */
export function useSignalRLobbyGroup(
  gameId: string | null,
  options: SignalRHookOptions = {}
) {
  const { enabled = true } = options;
  const [isInGroup, setIsInGroup] = useState(false);
  const [groupError, setGroupError] = useState<Error | null>(null);

  const connection = useSignalRConnection();

  const joinGroup = useCallback(
    async (groupId: string) => {
      if (!connection.isConnected) {
        throw new Error("SignalR not connected");
      }

      try {
        await signalRConnection.joinLobby(groupId);
        setIsInGroup(true);
        setGroupError(null);
      } catch (error) {
        setGroupError(error as Error);
        throw error;
      }
    },
    [connection.isConnected]
  );

  const leaveGroup = useCallback(async (groupId: string) => {
    try {
      await signalRConnection.leaveLobby(groupId);
      setIsInGroup(false);
      setGroupError(null);
    } catch (error) {
      setGroupError(error as Error);
      // Don't throw on leave, as it's often called during cleanup
    }
  }, []);

  // Auto join/leave based on gameId
  useEffect(() => {
    if (!enabled || !gameId || !connection.isConnected) {
      return;
    }

    let mounted = true;

    const handleJoin = async () => {
      try {
        await joinGroup(gameId);
      } catch (error) {
        if (mounted) {
          console.error(`Failed to join lobby group ${gameId}:`, error);
        }
      }
    };

    handleJoin();

    return () => {
      mounted = false;
      if (gameId) {
        leaveGroup(gameId);
      }
    };
  }, [gameId, connection.isConnected, enabled, joinGroup, leaveGroup]);

  return {
    isInGroup,
    groupError,
    joinGroup,
    leaveGroup,
    clearGroupError: () => setGroupError(null),
  };
}
