import { baseApi } from "../baseApi";

export interface Player {
    id: string;
    username: string;
    avatar?: string;
}
export interface Room {
    gameId: string;
    gameRoomName: string;
    isPrivate: boolean;
    roomKey?: string;
    maxPlayers: number;
    joinedUsers: Player[];
    gameStarted: boolean;
    createdAt: string;
    hostUsername: string;
}

export const lobbyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicLobbies: builder.query<
            {
                publicLobbies: Room[];
            },
            void
        >({
            query: () => ({ url: "/game-lobbies", method: "GET" }),
            providesTags: ["Lobby"],
        }),

        createLobby: builder.mutation<
            { gameRoomId: string },
            { hostUsername: string; gameRoomName: string; isPrivate: boolean }
        >({
            query: (body) => ({
                url: "/game-lobbies",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Lobby"],
        }),

        joinLobby: builder.mutation<
            {
                message: string;
                success: boolean;
            },
            { lobbyId: string; username: string }
        >({
            query: ({ lobbyId, username }) => ({
                url: `/game-lobbies/${lobbyId}/join`,
                method: "POST",
                body: { username },
            }),
            invalidatesTags: ["Lobby"],
        }),

        joinPrivateLobby: builder.mutation<Room, { roomKey: string; userId: string }>({
            query: ({ roomKey, userId }) => ({
                url: "/lobby/join",
                method: "POST",
                body: { roomKey, userId },
            }),
            invalidatesTags: ["Lobby"],
        }),
    }),
});

export const {
    useGetPublicLobbiesQuery,
    useCreateLobbyMutation,
    useJoinLobbyMutation,
    useJoinPrivateLobbyMutation,
} = lobbyApi;
