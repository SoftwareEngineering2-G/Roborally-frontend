import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "http://130.225.71.179:5100/api" // prod
    : `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:5100/api"; // dev

// Custom baseQuery with JWT authentication
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    // Get JWT token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem("jwt_token") : null;

    // Add Authorization header if token exists
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Wrapper to handle 401 errors (token expired/invalid)
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  // If we get a 401 Unauthorized error
  if (result.error && result.error.status === 401) {
    // Clear stored auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("username");
    }

    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = "/signin";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Lobby", "GameBoard", "Game"],
  endpoints: () => ({}),
});