import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Direction, Game, ProgrammingCards } from "@/models/gameModels";
import { GetCurrentGameStateResponse } from "../api/game/types";

interface GameState {
  currentGame: Game | null;
  isLoading: boolean;
  error: string | null;
  currentTurnUsername: string | null; // Track whose turn it is to execute
  executedPlayers: string[]; // Track which players have executed in current round
  winner: string | null;
  isGameOver: boolean;
}

const initialState: GameState = {
  currentGame: null,
  isLoading: false,
  error: null,
  currentTurnUsername: null,
  executedPlayers: [],
  winner: null,
  isGameOver: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState: (
      state,
      action: PayloadAction<GetCurrentGameStateResponse>
    ) => {
      // Transform the API response to match the Game type
      const response = action.payload;
      state.currentGame = {
        gameId: response.gameId,
        hostUsername: response.hostUsername,
        name: response.name,
        players: response.players.map((p) => ({
          username: p.username,
          robot: p.robot,
          positionX: p.positionX,
          positionY: p.positionY,
          direction: p.direction as Direction,
          hasLockedInRegisters: p.hasLockedInRegisters,
          revealedCardsInOrder: p.revealedCardsInOrder as ProgrammingCards[],
          currentExecutingRegister: p.currentExecutingRegister,
        })),
        gameBoard: {
          name: response.gameBoard.name,
          spaces: response.gameBoard.spaces.map((row) =>
            row.map((cell) => ({
              name: cell.name as any, // Cast to Celltype
              walls: cell.walls as Direction[],
              direction: cell.direction as Direction | null,
            }))
          ),
        },
        currentPhase: response.currentPhase as
          | "ProgrammingPhase"
          | "ActivationPhase",
        currentRevealedRegister: response.currentRevealedRegister,
        currentTurnUsername: response.currentTurnUsername,
        currentExecutingRegister: response.currentExecutingRegister,
        personalState: {
          hasLockedInRegisters: response.personalState.hasLockedInRegisters,
          lockedInCards: response.personalState.lockedInCards as
            | ProgrammingCards[]
            | null,
          dealtCards: response.personalState.dealtCards as
            | ProgrammingCards[]
            | null,
        },
      };
      state.isLoading = false;
      state.error = null;
      // Sync Redux state with backend state
      state.currentTurnUsername = response.currentTurnUsername;
    },
    setGameLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGameError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    playerLockedIn: (
      state,
      action: PayloadAction<{ username: string; lockedCards?: string[] }>
    ) => {
      if (state.currentGame) {
        // Find the player and update their hasLockedInRegisters flag
        const player = state.currentGame.players.find(
          (p) => p.username === action.payload.username
        );
        if (player) {
          player.hasLockedInRegisters = true;
        }

        // If lockedCards are provided (for current user), update personalState
        if (action.payload.lockedCards) {
          state.currentGame.personalState.hasLockedInRegisters = true;
          state.currentGame.personalState.lockedInCards = action.payload
            .lockedCards as ProgrammingCards[];
        }
      }
    },
    setRevealedRegister: (state, action: PayloadAction<number>) => {
      if (state.currentGame) {
        state.currentGame.currentRevealedRegister = action.payload;
        // Reset executed players when a new card is revealed
        state.executedPlayers = [];
      }
    },
    updateRevealedCards: (
      state,
      action: PayloadAction<{
        registerNumber: number;
        revealedCards: Array<{ username: string; card: string }>;
      }>
    ) => {
      if (state.currentGame) {
        // Update the current revealed register
        state.currentGame.currentRevealedRegister =
          action.payload.registerNumber - 1; // Backend sends 1-5, we use 0-4

        // Update each player's revealedCardsInOrder array
        action.payload.revealedCards.forEach(({ username, card }) => {
          const player = state.currentGame!.players.find(
            (p) => p.username === username
          );
          if (player) {
            // Add the card to the player's revealed cards in order
            player.revealedCardsInOrder = [
              ...player.revealedCardsInOrder,
              card as ProgrammingCards,
            ];
          }
        });

        // Reset executed players when a new card is revealed
        state.executedPlayers = [];
      }
    },
    setCurrentPhase: (
      state,
      action: PayloadAction<"ProgrammingPhase" | "ActivationPhase">
    ) => {
      if (state.currentGame) {
        state.currentGame.currentPhase = action.payload;
      }
    },
    setCurrentTurn: (state, action: PayloadAction<string | null>) => {
      state.currentTurnUsername = action.payload;
    },
    updateRobotPosition: (
      state,
      action: PayloadAction<{
        username: string;
        positionX: number;
        positionY: number;
        direction: string;
      }>
    ) => {
      if (state.currentGame) {
        const player = state.currentGame.players.find(
          (p) => p.username === action.payload.username
        );
        if (player) {
          player.positionX = action.payload.positionX;
          player.positionY = action.payload.positionY;
          player.direction = action.payload.direction as Direction;
        }
      }
    },
    markPlayerExecuted: (state, action: PayloadAction<string>) => {
      if (!state.executedPlayers.includes(action.payload)) {
        state.executedPlayers.push(action.payload);
      }
    },
    setGameOver: (state, action: PayloadAction<{winner: String}> ) => {
      state.isGameOver = true;
      state.winner = action.payload.winner;
    },
    resetGameState: (state) => {
      state.currentGame = null;
      state.isLoading = false;
      state.error = null;
      state.currentTurnUsername = null;
      state.executedPlayers = [];
    },
  },
});

export const {
  setGameState,
  setGameLoading,
  setGameError,
  playerLockedIn,
  setRevealedRegister,
  updateRevealedCards,
  setCurrentPhase,
  setCurrentTurn,
  updateRobotPosition,
  markPlayerExecuted,
  setGameOver,
  resetGameState,
} = gameSlice.actions;
export default gameSlice.reducer;
