import { baseApi } from "../baseApi";
import { RegisterProgrammedRequest } from "./types";



export const playerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registersProgrammed: builder.mutation<void, RegisterProgrammedRequest>({
      query: ({ gameId, username, lockedCardsInOrder }) => ({
        url: `/games/${gameId}/registers-programmed`,
        method: "POST",
        body: { 
          username, 
          lockedCardsInOrder 
        },
      }),
    }),
  }),
});

export const { useRegistersProgrammedMutation } = playerApi;
