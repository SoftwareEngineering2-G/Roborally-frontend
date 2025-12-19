import { baseApi } from "../baseApi";
import type { GetLeaderboardRequest, GetLeaderboardResponse } from "./types";

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<GetLeaderboardResponse, GetLeaderboardRequest>({
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: "/leaderboard",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;