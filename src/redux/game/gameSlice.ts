import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Room } from "../api/lobby/lobbyApi";

interface GameState { currentRoom: Room | null }
const initialState: GameState = { currentRoom: null };

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentRoom: (s, a: PayloadAction<Room | null>) => { s.currentRoom = a.payload; },
  },
});

export const { setCurrentRoom } = gameSlice.actions;
export default gameSlice.reducer;
