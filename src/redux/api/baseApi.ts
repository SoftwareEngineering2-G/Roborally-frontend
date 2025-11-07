import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "http://130.225.71.179:5100/api"   // prod
    : (`${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:5100/api");      // dev

console.log("API Base URL:", baseUrl);

// Or using env variables:
// const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["Lobby", "GameBoard"],
  endpoints: () => ({}),
});
