import { baseApi } from "../baseApi";
import type {
  Lobby,
  CreateLobbyRequest,
  CreateLobbyResponse,
  GetLobbyInfoRequest,
  GetLobbyInfoResponse,
  JoinLobbyRequest,
  StartGameRequest,
} from "./types";

export const lobbyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicLobbies: builder.query<Lobby[], void>({
      query: () => ({ url: "/game-lobbies", method: "GET" }),
      transformResponse: (response: any) => {
        return Array.isArray(response?.publicLobbies)
          ? response.publicLobbies.map((lobby: any) => ({
              gameId: lobby.gameId,
              gameRoomName: lobby.name,
              hostUsername: lobby.hostUsername,
              currentAmountOfPlayers: lobby.joinedUsers.length,
            }))
          : [];
      },
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
      invalidatesTags: ["Lobby"],
    }),

    getLobbyInfo: builder.query<GetLobbyInfoResponse, GetLobbyInfoRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}`,
        method: "GET",
        params: { username },
      }),
    }),

    startGame: builder.mutation<void, StartGameRequest>({
      query: ({ gameId, username }) => ({
        url: `/game-lobbies/${gameId}/start`,
        method: "POST",
        body: {
          username,
        },
      }),
    }),
  }),
});

export const {
  useGetPublicLobbiesQuery,
  useCreateLobbyMutation,
  useJoinLobbyMutation,
  useGetLobbyInfoQuery,
  useStartGameMutation,
} = lobbyApi;
