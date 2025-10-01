import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { GetCurrentGameStateResponse } from '@/redux/api/game/types';

interface Player {
  username: string;
  robot: string;
  hasLockedIn?: boolean;
}

interface CurrentGame {
  gameId: string;
  players: Player[];
  currentPhase: "ProgrammingPhase" | "ActivationPhase";
}

interface Room {
    // Empty to fix issue
}

interface GameState {
    currentRoom: Room | null;
    currentGame: CurrentGame | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: GameState = { 
    currentRoom: null,
    currentGame: null,
    isLoading: false,
    error: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setCurrentRoom: (s, a: PayloadAction<Room | null>) => {
            s.currentRoom = a.payload;
        },
        setGameState: (state, action: PayloadAction<GetCurrentGameStateResponse>) => {
            // Transform API response to include hasLockedIn status for each player
            // Backend may not provide hasLockedIn property, so we default to false
            state.currentGame = {
                ...action.payload,
                players: action.payload.players.map(player => ({
                    ...player,
                    hasLockedIn: player.hasLockedIn ?? false, // Use backend value if available, otherwise default to false
                })),
            };
            state.isLoading = false;
            state.error = null;
        },
        setGameLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setGameError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        playerLockedIn: (state, action: PayloadAction<{ username: string }>) => {
            if (state.currentGame) {
                const player = state.currentGame.players.find(p => p.username === action.payload.username);
                if (player) {
                    player.hasLockedIn = true;
                }
            }
        },
        resetGameState: (state) => {
            state.currentGame = null;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const { 
    setCurrentRoom, 
    setGameState, 
    setGameLoading, 
    setGameError, 
    playerLockedIn, 
    resetGameState 
} = gameSlice.actions;
export default gameSlice.reducer;
