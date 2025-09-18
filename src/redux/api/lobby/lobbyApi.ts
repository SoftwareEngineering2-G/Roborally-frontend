import { baseApi } from "../baseApi";

export interface Player { id: string; username: string; avatar?: string }
export interface Room {
    id: string; name: string; isPrivate: boolean; roomKey?: string;
    maxPlayers: number; players: Player[]; gameStarted: boolean;
}

export const lobbyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // getLobbies: builder.query<Room[], void>({
        //     query: () => ({ url: "/lobby", method: "GET" }),
        //     providesTags: ["Lobby"],
        // }),
        createLobby: builder.mutation<
            { gameRoomId: string },
            { hostUserId: string; gameRoomName: string; isPrivate: boolean }
        >({
            query: (body) => ({
                url: "/game-lobbies",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Lobby"],
        }),

        joinLobby: builder.mutation<Room, { lobbyId: string; userId: string }>({
            query: ({ lobbyId, userId }) => ({

                url: `/lobby/${lobbyId}/join`, method: "POST", body: { userId },
            }),
            invalidatesTags: ["Lobby"],
        }),
        joinPrivateLobby: builder.mutation<Room, { roomKey: string; userId: string }>({
            query: ({ roomKey, userId }) => ({
                url: `/lobby/join`, method: "POST", body: { roomKey, userId },
            }),
            invalidatesTags: ["Lobby"],
        }),
    }),
});

export const {
   // useGetLobbiesQuery,
    useCreateLobbyMutation,
    useJoinLobbyMutation,
    useJoinPrivateLobbyMutation,
} = lobbyApi;
