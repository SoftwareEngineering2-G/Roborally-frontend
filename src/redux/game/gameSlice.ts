import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { GetCurrentGameStateResponse } from '@/redux/api/game/types';

interface Player {
  username: string;
  robot: string;
  hasLockedIn?: boolean;
  programmedCards?: string[]; // Array of card names locked in by player
}

export type BoardSpace = {
    name: string;
};

export type GameBoardModel = {
    name: string;
    spaces: BoardSpace[][]; // rows x cols
};


interface CurrentGame {
  gameId: string;
  hostUsername: string;
  name: string;
  players: Player[];
  currentPhase: "ProgrammingPhase" | "ActivationPhase";
  currentRevealedRegister?: number; // Tracks which register is currently revealed (0-4)
  gameBoard: GameBoardModel;
}

interface Room {
    id?: string;
    name?: string;
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
    setRevealedRegister,
    resetGameState
} = gameSlice.actions;
export default gameSlice.reducer;
