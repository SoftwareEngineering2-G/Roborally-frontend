import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { lobbyApi } from "../api/lobby/lobbyApi";

// Types for lobby state
export interface LobbyPlayer {
  username: string;
  isReady: boolean;
  isHost: boolean;
}

export interface LobbyState {
  // Core lobby data
  gameId: string | null;
  lobbyName: string | null;
  hostUsername: string | null;

  // Players state
  players: LobbyPlayer[];
  currentPlayerReady: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Connection state
  isInitialized: boolean;
}

const initialState: LobbyState = {
  gameId: null,
  lobbyName: null,
  hostUsername: null,
  players: [],
  currentPlayerReady: true, // Default to ready as per original component
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    // SignalR event handlers
    userJoinedLobby: (state, action: PayloadAction<{ username: string }>) => {
      const { username } = action.payload;

      // Avoid duplicates
      if (!state.players.some((p) => p.username === username)) {
        state.players.push({
          username,
          isReady: true, // Default new players to ready
          isHost: false,
        });
      }
    },

    userLeftLobby: (state, action: PayloadAction<{ username: string }>) => {
      const { username } = action.payload;
      state.players = state.players.filter((p) => p.username !== username);
    },

    playerReadyChanged: (
      state,
      action: PayloadAction<{ username: string; isReady: boolean }>
    ) => {
      const { username, isReady } = action.payload;
      const player = state.players.find((p) => p.username === username);
      if (player) {
        player.isReady = isReady;
      }
    },

    // Local state changes (from UI interactions)
    setCurrentPlayerReady: (state, action: PayloadAction<boolean>) => {
      state.currentPlayerReady = action.payload;
    },

    clearLobbyState: () => {
      return initialState;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle RTK Query lifecycle
    builder
      .addMatcher(lobbyApi.endpoints.getLobbyInfo.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        lobbyApi.endpoints.getLobbyInfo.matchFulfilled,
        (state, action) => {
          const lobbyData = action.payload;

          // Initialize lobby state from API data
          state.gameId = lobbyData.gameId;
          state.lobbyName = lobbyData.lobbyname;
          state.hostUsername = lobbyData.hostUsername;

          // Initialize players from API data
          state.players = lobbyData.joinedUsernames.map((username) => ({
            username,
            isReady: true, // Default everyone to ready
            isHost: username === lobbyData.hostUsername,
          }));

          state.isLoading = false;
          state.isInitialized = true;
        }
      )
      .addMatcher(
        lobbyApi.endpoints.getLobbyInfo.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || "Failed to fetch lobby data";
        }
      );
  },
});

export const {
  userJoinedLobby,
  userLeftLobby,
  playerReadyChanged,
  setCurrentPlayerReady,
  clearLobbyState,
  setError,
  clearError,
} = lobbySlice.actions;

export default lobbySlice.reducer;

// Selectors
export const selectLobbyState = (state: { lobby: LobbyState }) => state.lobby;
export const selectLobbyPlayers = (state: { lobby: LobbyState }) =>
  state.lobby.players;
export const selectCurrentPlayer = (
  state: { lobby: LobbyState },
  username: string
) => state.lobby.players.find((p) => p.username === username);
export const selectIsHost = (state: { lobby: LobbyState }, username: string) =>
  state.lobby.hostUsername === username;
export const selectAllPlayersReady = (state: { lobby: LobbyState }) =>
  state.lobby.players.every((p) => p.isReady);
export const selectCanStartGame = (
  state: { lobby: LobbyState },
  username: string
) => {
  const isHost = state.lobby.hostUsername === username;
  const allReady = state.lobby.players.every((p) => p.isReady);
  const minPlayers = state.lobby.players.length >= 2;
  return isHost && allReady && minPlayers;
};
