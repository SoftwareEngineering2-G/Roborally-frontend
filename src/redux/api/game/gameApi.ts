import {baseApi} from "@/redux/api/baseApi";
import {GetGameRequest, GetGameResponse} from "@/redux/api/game/types";



export const gameApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getGame: builder.query<GetGameResponse,GetGameRequest>({
            query: ({gameId}) => ({
                url: `/game/${gameId}`,
                method: "GET"}),
        }),
    }),

});

export const { useGetGameQuery } = gameApi;