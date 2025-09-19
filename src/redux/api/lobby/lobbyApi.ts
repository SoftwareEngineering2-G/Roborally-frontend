import { baseApi } from "../baseApi";

export interface Player {
  id: string;
  username: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  roomKey?: string;
  maxPlayers: number;
  players: Player[];
  gameStarted: boolean;
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

interface JoinPrivateLobbyRequest {
  roomKey: string;
  username: string;
}

export const lobbyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getLobbies: builder.query<Room[], void>({
    //     query: () => ({ url: "/lobby", method: "GET" }),
    //     providesTags: ["Lobby"],
    // }),
    createLobby: builder.mutation<CreateLobbyResponse, CreateLobbyRequest>({
      query: (body) => ({
        url: "/game-lobbies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lobby"],
    }),

    joinLobby: builder.mutation<Room, JoinLobbyRequest>({
      query: ({ gameId, username }) => ({
        url: `/lobby/${gameId}/join`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: ["Lobby"],
    }),
  }),
});

export const {
  // useGetLobbiesQuery,
  useCreateLobbyMutation,
  useJoinLobbyMutation,
} = lobbyApi;
