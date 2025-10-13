import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Game } from '@/models/gameModels';

interface GameState {
    currentGame: Game | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: GameState = { 
    currentGame: null,
    isLoading: false,
    error: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setGameState: (state, action: PayloadAction<Game>) => {
            // Set the game state directly from the API response
            // The Game type from gameModels is our single source of truth
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
        playerLockedIn: (state, action: PayloadAction<{ username: string; programmedCards?: string[] }>) => {
            if (state.currentGame) {
                const player = state.currentGame.players.find(p => p.username === action.payload.username);
                if (player) {
                    player.hasLockedIn = true;
                    // Store the programmed cards if provided
                    if (action.payload.programmedCards) {
                        player.programmedCards = action.payload.programmedCards;
                    }
                }
            }
        },
        setRevealedRegister: (state, action: PayloadAction<number>) => {
            if (state.currentGame) {
                state.currentGame.currentRevealedRegister = action.payload;
            }
        },
        setCurrentPhase: (state, action: PayloadAction<"ProgrammingPhase" | "ActivationPhase">) => {
            if (state.currentGame) {
                state.currentGame.currentPhase = action.payload;
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
    setGameState, 
    setGameLoading, 
    setGameError, 
    playerLockedIn, 
    setRevealedRegister,
    setCurrentPhase,
    resetGameState
} = gameSlice.actions;
export default gameSlice.reducer;
