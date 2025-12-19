import { baseApi } from "../baseApi";
import type { GetMyProfileRequest, GetMyProfileResponse } from "./types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<GetMyProfileResponse, GetMyProfileRequest>({
      query: ({ username }) => ({
        url: `/users/${username}/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMyProfileQuery } = userApi;