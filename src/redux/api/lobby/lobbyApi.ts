import { baseApi } from "../baseApi";
import type {
  Lobby,
  CreateLobbyRequest,
  CreateLobbyResponse,
  GetLobbyInfoRequest,
  GetLobbyInfoResponse,
  JoinLobbyRequest,
  LeaveLobbyRequest,
  StartGameRequest,
  ContinueGameRequest,
} from "./types";

export const lobbyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicLobbies: builder.query<Lobby[], void>({
      query: () => ({ url: "/game-lobbies", method: "GET" }),
      providesTags: ["Lobby"],
    }),

    createLobby: builder.mutation<CreateLobbyResponse, CreateLobbyRequest>({
      query: (body) => ({
        url: "/game-lobbies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lobby"],
    }),

    joinLobby: builder.mutation<void, JoinLobbyRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}/join`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: (_result, _error, { gameId }) => ["Lobby", { type: "Lobby", id: gameId }],
    }),

    leaveLobby: builder.mutation<void, LeaveLobbyRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}/leave`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: (_result, _error, { gameId }) => ["Lobby", { type: "Lobby", id: gameId }],
    }),

    getLobbyInfo: builder.query<GetLobbyInfoResponse, GetLobbyInfoRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}`,
        method: "GET",
        params: { username },
      }),
      providesTags: (_result, _error, { gameId }) => [{ type: "Lobby", id: gameId }],
    }),

    startGame: builder.mutation<void, StartGameRequest>({
      query: ({ gameId, username, gameBoardName }) => ({
        url: `/game-lobbies/${gameId}/start`,
        method: "POST",
        body: {
          username,
          gameBoardName,
        },
      }),
      invalidatesTags: (_result, _error, { gameId }) => [
        "Lobby",
        "Game",
        { type: "Lobby", id: gameId },
        { type: "Game", id: gameId },
      ],
    }),

    joinContinueGameLobby: builder.mutation<void, JoinLobbyRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}/join-continue`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: (_result, _error, { gameId }) => ["Lobby", { type: "Lobby", id: gameId }],
    }),

    continueGame: builder.mutation<void, ContinueGameRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}/continue`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: (_result, _error, { gameId }) => [
        "Lobby",
        "Game",
        { type: "Lobby", id: gameId },
        { type: "Game", id: gameId },
      ],
    }),
  }),
});

export const {
  useGetPublicLobbiesQuery,
  useCreateLobbyMutation,
  useJoinLobbyMutation,
  useLeaveLobbyMutation,
  useGetLobbyInfoQuery,
  useStartGameMutation,
  useContinueGameMutation,
  useJoinContinueGameLobbyMutation,
} = lobbyApi;