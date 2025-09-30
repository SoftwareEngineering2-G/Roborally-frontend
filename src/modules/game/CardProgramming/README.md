# Card Programming Module

This module manages the card programming phase of RoboRally where players select movement cards and program their robot's registers.

## Overview

The Card Programming interface allows players to:

- Receive dealt cards from the server via SignalR
- Place cards in robot registers (1-5) via drag & drop or click selection
- Preview their programmed sequence
- Upload their complete program to the server

## SignalR Integration

The module integrates with the game's SignalR hub to:

- **Join Game Session**: Automatically joins the game group when connected
- **Receive Cards**: Listens for `PlayerCardsDealt` events from the server
- **Real-time Updates**: Maintains connection status and error handling

### Card Dealing Flow

1. Host triggers card dealing via REST API (not SignalR)
2. Backend processes dealing and broadcasts to individual players
3. Frontend receives `PlayerCardsDealt` event with exact card names
4. Cards are converted to frontend `ProgramCard` objects and dealt to hand
5. Card dealing animation plays (if needed)

### Backend Card Types

The module supports these exact card types from the backend:

- "Move 1", "Move 2", "Move 3"
- "Rotate Left", "Rotate Right", "U-Turn"
- "Move Back", "Power Up", "Again"

## Module Structure

```
CardProgramming/
├── index.ts                     # Main exports
├── card-programming.tsx         # Main orchestrator component with SignalR
├── ProgrammingHeader.tsx        # Header with upload controls
├── hooks/
│   ├── index.ts                 # Hook exports
│   └── useGameSignalR.ts        # Game SignalR connection hook
├── ProgrammingPhase.tsx         # Main programming interface
├── ProgrammingControls.tsx      # Card hand and deck controls
├── types.ts                     # TypeScript interfaces and sample data
├── utils.ts                     # Utility functions
├── hooks.ts                     # React hooks for state management
├── useCardDealing.ts           # Card dealing animation hook
├── ProgramCard.tsx             # Individual program card component
├── RegisterSlot.tsx            # Register slot with drag/drop
├── DeckArea.tsx                # Deck and card dealing area
├── DealingAnimation*.tsx       # Card dealing animations
└── README.md                   # This documentation
```

## Key Components

### `CardProgramming` (Main Component)

- Orchestrates the entire card programming interface
- Manages card dealing state and register programming
- Integrates host controls when user is game host

### `ProgrammingHeader`

- Shows current phase status
- Displays register fill progress (x/5)
- Provides "Upload Program" button when complete
- Integrates host controls

### `ProgrammingPhase`

- Main interface for card programming
- Contains game board, registers, and card hand
- Handles drag & drop interactions
- Shows card dealing animations

### `useGameSignalR`

- Manages SignalR connection to game hub (`/game`)
- Automatically joins/leaves game sessions
- Provides connection state and event handling
- Handles `PlayerCardsDealt` events

## State Management

The module uses several custom hooks:

- `useProgrammingPhase()` - Manages register and card state
- `useCardDealing()` - Handles card dealing animations and deck state
- `useGameSignalR()` - Manages real-time game connection

## Key Features

1. **Real-time Card Dealing**: Receives cards via SignalR from server
2. **Intuitive Card Programming**: Players can drag cards to registers or use click-to-select
3. **Visual Feedback**: Clear indication of register fill status and valid drops
4. **Smooth Animations**: Card dealing and movement animations
5. **Mobile Friendly**: Touch-friendly interactions for mobile devices
6. **Host Controls Integration**: Seamless integration of game host controls
7. **Connection Status**: Real-time connection status with error handling

## Usage

```tsx
import { CardProgramming } from "./CardProgramming";

// Basic usage with required props
<CardProgramming
  gameId="12345-67890"
  username="player1"
/>

// With host controls
<CardProgramming
  gameId="12345-67890"
  username="player1"
  hostControls={<GameHostControls gameId={gameId} />}
/>
```

## Benefits of This Design

- **Real-time Integration**: Direct SignalR integration for seamless multiplayer experience
- **Clear Purpose**: Name clearly indicates this handles card programming
- **Focused Responsibility**: Only handles programming phase, not execution
- **Better UX**: Streamlined interface with real-time card dealing
- **Maintainable**: Cleaner code structure with better naming
- **Extensible**: Easy to add new programming features and game events
