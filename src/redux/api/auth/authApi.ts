import { baseApi } from "../baseApi";

type SignupRequest = {
  username: string;
  password: string;
  birthday: string; // ISO format date string
};

type SignupResponse = {
  username: string;
  token: string; // JWT token from backend
};

type SigninRequest = {
  username: string;
  password: string;
};

type SigninResponse = {
  username: string;
  token: string; // JWT token from backend
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (data) => ({
        url: "/users/signup",
        method: "POST",
        body: data,
      }),
    }),
    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (data) => ({
        url: "/users/signin",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignupMutation, useSigninMutation } = authApi;