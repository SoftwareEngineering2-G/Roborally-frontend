import { baseApi } from "../baseApi";
import { StartCardDealingForAllRequest } from "./types";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startCardDealingForAll: builder.mutation<
      void,
      StartCardDealingForAllRequest
    >({
      query: ({ gameId, username }) => ({
        url: `/games/${gameId}/deal-decks-to-all`,
        method: "POST",
        body: { username },
      }),
    }),
  }),
});

export const { useStartCardDealingForAllMutation } = gameApi;
