import { baseApi } from "../baseApi";
import { GetCurrentGameStateRequest, GetCurrentGameStateResponse, StartCardDealingForAllRequest, StartActivationPhaseRequest } from "./types";

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

    startActivationPhase: builder.mutation<
      void,
      StartActivationPhaseRequest
    >({
      query: ({ gameId, username }) => ({
        url: `/games/${gameId}/start-activation-phase`,
        method: "POST",
        body: { username },
      }),
    }),

    getCurrentGameState: builder.query<GetCurrentGameStateResponse, GetCurrentGameStateRequest>({
      query: ({ gameId }) => ({
        url: `/games/${gameId}/current-state`,
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useStartCardDealingForAllMutation, 
  useStartActivationPhaseMutation,
  useGetCurrentGameStateQuery 
} = gameApi;
