import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GameState {
    currentRoom: Room | null;
}

interface Room {
    // Empty to fix issue
}
const initialState: GameState = { currentRoom: null };

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setCurrentRoom: (s, a: PayloadAction<Room | null>) => {
            s.currentRoom = a.payload;
        },
    },
});

export const { setCurrentRoom } = gameSlice.actions;
export default gameSlice.reducer;
