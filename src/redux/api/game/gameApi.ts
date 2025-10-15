import { baseApi } from "../baseApi";
import { GetCurrentGameStateRequest, GetCurrentGameStateResponse, StartCardDealingForAllRequest, StartActivationPhaseRequest, RevealNextRegisterRequest, RevealNextRegisterResponse, ExecuteProgrammingCardRequest, ExecuteProgrammingCardResponse } from "./types";

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

    revealNextRegister: builder.mutation<
      RevealNextRegisterResponse,
      RevealNextRegisterRequest
    >({
      query: ({ gameId, username }) => ({
        url: `/games/${gameId}/reveal-next-register`,
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

    executeProgrammingCard: builder.mutation<
      ExecuteProgrammingCardResponse,
      ExecuteProgrammingCardRequest
    >({
      query: ({ gameId, username, cardName }) => ({
        url: `/games/${gameId}/players/${username}/execute-card`,
        method: "POST",
        body: { cardName },
      }),
    }),
  }),
});

export const { 
  useStartCardDealingForAllMutation, 
  useStartActivationPhaseMutation,
  useRevealNextRegisterMutation,
  useGetCurrentGameStateQuery,
  useExecuteProgrammingCardMutation
} = gameApi;
