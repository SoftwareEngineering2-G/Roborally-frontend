import { baseApi } from "../baseApi";
import {
  GetCurrentGameStateRequest,
  GetCurrentGameStateResponse,
  StartCardDealingForAllRequest,
  StartActivationPhaseRequest,
  RevealNextRegisterRequest,
  RevealNextRegisterResponse,
  ExecuteProgrammingCardRequest,
  ExecuteProgrammingCardResponse,
  GetAllGamesRequest,
  GetAllGamesResponse,
} from "./types";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Game History endpoints
    getAllGames: builder.query<GetAllGamesResponse[], GetAllGamesRequest>({
      query: ({ username, isPrivate, isFinished, from, to, searchTag }) => {
        const params: Record<string, string> = {};

        if (isPrivate !== undefined) params.isPrivate = String(isPrivate);
        if (isFinished !== undefined) params.isFinished = String(isFinished);
        if (from) params.from = from;
        if (to) params.to = to;
        if (searchTag) params.searchTag = searchTag;

        return {
          url: `/users/${username}/games`,
          method: "GET",
          params,
        };
      },
    }),

    // Game actions endpoints
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

    startActivationPhase: builder.mutation<void, StartActivationPhaseRequest>({
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

    getCurrentGameState: builder.query<
      GetCurrentGameStateResponse,
      GetCurrentGameStateRequest
    >({
      query: ({ gameId, username }) => ({
        url: `/games/${gameId}/current-state`,
        method: "GET",
        params: { username },
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
  // Game history hooks
  useGetAllGamesQuery,
  useLazyGetAllGamesQuery,
  // Game actions hooks
  useStartCardDealingForAllMutation,
  useStartActivationPhaseMutation,
  useRevealNextRegisterMutation,
  useGetCurrentGameStateQuery,
  useExecuteProgrammingCardMutation,
} = gameApi;
