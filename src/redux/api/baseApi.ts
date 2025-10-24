import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "http://130.225.71.179:5100/api"   // prod
    : "http://localhost:5100/api";      // dev

// Or using env variables:
// const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["Lobby"],
  endpoints: () => ({}),
});
