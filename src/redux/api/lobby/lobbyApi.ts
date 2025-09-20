import { baseApi } from "../baseApi";

export interface Player {
  id: string;
  username: string;
  avatar?: string;
}

interface CreateLobbyRequest {
  hostUsername: string;
  gameRoomName: string;
  isPrivate: boolean;
}

interface CreateLobbyResponse {
  gameRoomId: string;
}

interface JoinLobbyRequest {
  gameId: string;
  username: string;
}

interface GetLobbyInfoRequest {
  gameId: string;
  username: string;
}

interface GetLobbyInfoResponse {
  gameId: string;
  lobbyname: string;
  joinedUsernames: string[];
  hostUsername: string;
}

export const lobbyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useCreateLobbyMutation,
  useJoinLobbyMutation,
  useGetLobbyInfoQuery,
} = lobbyApi;
