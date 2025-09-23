import { useState } from "react";
import { useSignalREvent, useSignalRLobbyGroup } from "./useSignalR";
import {
  SignalRHookOptions,
  UserJoinedLobbyEvent,
  UserLeftLobbyEvent,
  PlayerReadyEvent,
  GameStartedEvent,
  LobbyUpdatedEvent,
} from "@/types/signalr";

/**
 * Hook for handling user joined events in a lobby
 */
export function useUserJoinedSignalREvent(
  gameId: string | null,
  onUserJoined: (event: UserJoinedLobbyEvent) => void,
  options: SignalRHookOptions = {}
) {
  // Join the lobby group
  const { isInGroup, groupError } = useSignalRLobbyGroup(gameId, options);

  // Subscribe to user joined events
  useSignalREvent("UserJoinedLobby", onUserJoined, {
    ...options,
    enabled: options.enabled !== false && isInGroup,
  });

  return {
    isInGroup,
    groupError,
  };
}

/**
 * Hook for handling user left events in a lobby
 */
export function useUserLeftSignalREvent(
  gameId: string | null,
  onUserLeft: (event: UserLeftLobbyEvent) => void,
  options: SignalRHookOptions = {}
) {
  const { isInGroup, groupError } = useSignalRLobbyGroup(gameId, options);

  useSignalREvent("UserLeftLobby", onUserLeft, {
    ...options,
    enabled: options.enabled !== false && isInGroup,
  });

  return {
    isInGroup,
    groupError,
  };
}

/**
 * Hook for handling player ready status changes
 */
export function usePlayerReadySignalREvent(
  gameId: string | null,
  onPlayerReady: (event: PlayerReadyEvent) => void,
  options: SignalRHookOptions = {}
) {
  const { isInGroup, groupError } = useSignalRLobbyGroup(gameId, options);

  useSignalREvent("PlayerReady", onPlayerReady, {
    ...options,
    enabled: options.enabled !== false && isInGroup,
  });

  return {
    isInGroup,
    groupError,
  };
}

/**
 * Hook for handling game started events
 */
export function useGameStartedSignalREvent(
  gameId: string | null,
  onGameStarted: (event: GameStartedEvent) => void,
  options: SignalRHookOptions = {}
) {
  const { isInGroup, groupError } = useSignalRLobbyGroup(gameId, options);

  useSignalREvent("GameStarted", onGameStarted, {
    ...options,
    enabled: options.enabled !== false && isInGroup,
  });

  return {
    isInGroup,
    groupError,
  };
}

/**
 * Hook for handling general lobby updates
 */
export function useLobbyUpdatedSignalREvent(
  gameId: string | null,
  onLobbyUpdated: (event: LobbyUpdatedEvent) => void,
  options: SignalRHookOptions = {}
) {
  const { isInGroup, groupError } = useSignalRLobbyGroup(gameId, options);

  useSignalREvent("LobbyUpdated", onLobbyUpdated, {
    ...options,
    enabled: options.enabled !== false && isInGroup,
  });

  return {
    isInGroup,
    groupError,
  };
}

/**
 * Comprehensive hook that provides all lobby SignalR functionality
 */
export function useLobbySignalR(
  gameId: string | null,
  callbacks: {
    onUserJoined?: (event: UserJoinedLobbyEvent) => void;
    onUserLeft?: (event: UserLeftLobbyEvent) => void;
    onPlayerReady?: (event: PlayerReadyEvent) => void;
    onGameStarted?: (event: GameStartedEvent) => void;
    onLobbyUpdated?: (event: LobbyUpdatedEvent) => void;
  },
  options: SignalRHookOptions = {}
) {
  const [sendError, setSendError] = useState<Error | null>(null);

  // Join the lobby group
  const { isInGroup, groupError } = useSignalRLobbyGroup(gameId, options);

  // Subscribe to all events
  if (callbacks.onUserJoined) {
    useSignalREvent("UserJoinedLobby", callbacks.onUserJoined, {
      ...options,
      enabled: options.enabled !== false && isInGroup,
    });
  }

  if (callbacks.onUserLeft) {
    useSignalREvent("UserLeftLobby", callbacks.onUserLeft, {
      ...options,
      enabled: options.enabled !== false && isInGroup,
    });
  }

  if (callbacks.onPlayerReady) {
    useSignalREvent("PlayerReady", callbacks.onPlayerReady, {
      ...options,
      enabled: options.enabled !== false && isInGroup,
    });
  }

  if (callbacks.onGameStarted) {
    useSignalREvent("GameStarted", callbacks.onGameStarted, {
      ...options,
      enabled: options.enabled !== false && isInGroup,
    });
  }

  if (callbacks.onLobbyUpdated) {
    useSignalREvent("LobbyUpdated", callbacks.onLobbyUpdated, {
      ...options,
      enabled: options.enabled !== false && isInGroup,
    });
  }

  return {
    // Connection state
    isInGroup,
    groupError,
    sendError,

    // Error management
    clearSendError: () => setSendError(null),
  };
}

/**
 * Simple hook for just the user joined event (as requested)
 */
export function useUserJoinedEvent(
  gameId: string | null,
  onUserJoined: (event: UserJoinedLobbyEvent) => void
) {
  return useUserJoinedSignalREvent(gameId, onUserJoined);
}
