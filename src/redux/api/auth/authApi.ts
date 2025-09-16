import { baseApi } from "../baseApi";

type SignupRequest = {
  username: string;
  password: string;
  birthday: string; // ISO format date string
};

type SignupResponse = {
  userId: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignupMutation } = authApi;
