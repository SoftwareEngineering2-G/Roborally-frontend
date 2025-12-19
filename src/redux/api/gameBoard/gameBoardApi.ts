import { baseApi } from "../baseApi";
import type { GameBoard } from "./types";

export const gameBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableBoards: builder.query<GameBoard[], void>({
      query: () => ({ url: "/game-boards", method: "GET" }),
      providesTags: ["GameBoard"],
    }),
  }),
});

export const { useGetAvailableBoardsQuery } = gameBoardApi;