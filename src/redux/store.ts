import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import gameReducer from "./game/gameSlice";
import lobbyReducer from "./lobby/lobbySlice";
import { audioMiddleware } from "@/store/middleware/audioMiddleware";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    game: gameReducer,
    lobby: lobbyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(audioMiddleware),
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
