# Card Programming Module

This module manages the card programming phase of RoboRally where players select movement cards and program their robot's registers.

## Overview

The Card Programming interface allows players to:

- Draw movement cards from the deck
- Place cards in robot registers (1-5) via drag & drop or click selection
- Preview their programmed sequence
- Upload their complete program to the server

## Module Structure

```
CardProgramming/
├── index.ts                     # Main exports
├── card-programming.tsx         # Main orchestrator component
├── ProgrammingHeader.tsx        # Header with upload controls
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

## State Management

The module uses several custom hooks:

- `useProgrammingPhase()` - Manages register and card state
- `useCardDealing()` - Handles card dealing animations and deck state

## Key Features

1. **Intuitive Card Programming**: Players can drag cards to registers or use click-to-select
2. **Visual Feedback**: Clear indication of register fill status and valid drops
3. **Smooth Animations**: Card dealing and movement animations
4. **Mobile Friendly**: Touch-friendly interactions for mobile devices
5. **Host Controls Integration**: Seamless integration of game host controls

## Usage

```tsx
import { CardProgramming } from "./CardProgramming";

// Basic usage
<CardProgramming />

// With host controls
<CardProgramming
  hostControls={<GameHostControls gameId={gameId} />}
/>
```

## Benefits of This Design

- **Clear Purpose**: Name clearly indicates this handles card programming
- **Focused Responsibility**: Only handles programming phase, not execution
- **Better UX**: Streamlined interface without confusing phase switches
- **Maintainable**: Cleaner code structure with better naming
- **Extensible**: Easy to add new programming features
