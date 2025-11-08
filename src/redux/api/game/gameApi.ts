import { baseApi } from "../baseApi";
import type {
  GetCurrentGameStateRequest,
  GetCurrentGameStateResponse,
  StartCardDealingForAllRequest,
  StartActivationPhaseRequest,
  RevealNextRegisterRequest,
  ExecuteProgrammingCardRequest,
  ExecuteProgrammingCardResponse,
  GetAllGamesRequest,
  GetAllGamesResponse,
  ActivateNextBoardElementRequest,
  RequestGamePauseRequest,
  RespondToGamePauseRequest,
  GetPausedGamesRequest,
  GetPausedGameResponse,
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
    startCardDealingForAll: builder.mutation<void, StartCardDealingForAllRequest>({
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

    revealNextRegister: builder.mutation<void, RevealNextRegisterRequest>({
      query: ({ gameId, username }) => ({
        url: `/games/${gameId}/reveal-next-register`,
        method: "POST",
        body: { username },
      }),
    }),

    getCurrentGameState: builder.query<GetCurrentGameStateResponse, GetCurrentGameStateRequest>({
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

    activateNextBoardElement: builder.mutation<void, ActivateNextBoardElementRequest>({
      query: ({ gameId }) => ({
        url: `/games/${gameId}/activate-next-board-element`,
        method: "POST",
        body: { gameId },
      }),
    }),
    requestGamePause: builder.mutation<void, RequestGamePauseRequest>({
      query: ({ gameId, username }) => ({
        url: `/games/${gameId}/pause/request`,
        method: "POST",
        body: { username },
      }),
    }),

    respondToGamePause: builder.mutation<void, RespondToGamePauseRequest>({
      query: ({ gameId, username, approved }) => ({
        url: `/games/${gameId}/pause/respond`,
        method: "POST",
        body: { username, approved },
      }),
    }),

    getPausedGames: builder.query<GetPausedGameResponse[], GetPausedGamesRequest>({
      query: ({ username }) => ({
        url: "/games/paused",
        method: "GET",
        params: { username },
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
  useActivateNextBoardElementMutation,
  useRequestGamePauseMutation,
  useRespondToGamePauseMutation,
  useGetPausedGamesQuery,
} = gameApi;
