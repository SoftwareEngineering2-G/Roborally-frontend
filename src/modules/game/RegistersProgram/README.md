# RegistersProgram Module Structure

This module has been refactored into a clean, modular architecture for better maintainability and separation of concerns.

## File Structure

```
RegistersProgram/
├── index.ts                 # Main exports file
├── registers-program.tsx    # Main component (orchestrates other components)
├── types.ts                # TypeScript interfaces and sample data
├── utils.ts                # Utility functions (color mappings, calculations)
├── hooks.ts                # Custom React hooks for state management
├── ProgramCard.tsx         # Individual program card component
├── RegisterSlot.tsx        # Register slot component with drag/drop
├── ProgramPreview.tsx      # Side panel preview component
└── README.md              # This documentation
```

## Components

### `RegistersProgram` (Main Component)

- Orchestrates the entire programming phase UI
- Uses custom hooks for state management
- Renders the header, main areas, and side panel

### `ProgramCardComponent`

- Displays individual program cards
- Handles card selection and drag start
- Shows card name, priority, and selection state

### `RegisterSlotComponent`

- Displays register slots (1-5)
- Handles drag and drop interactions
- Shows locked state for damaged registers
- Displays card content when filled

### `ProgramPreview`

- Side panel showing current program sequence
- Lists all registers with their current state
- Includes user instructions

## Custom Hooks

### `useProgrammingPhase(initialHand, initialRegisters)`

- Manages all component state
- Provides handlers for card/register interactions
- Handles drag and drop logic
- Returns state and handlers object

## Utilities

### Color Functions

- `getCardColorClasses(color)` - Returns card styling classes
- `getRegisterColorClasses(color)` - Returns register styling classes

### State Calculations

- `getFilledRegistersCount(registers)` - Counts filled registers
- `isProgramComplete(registers)` - Checks if program is ready to upload

## Usage

```tsx
import { RegistersProgram } from "./RegistersProgram";

// Use the main component
<RegistersProgram />;

// Or use individual components
import {
  ProgramCardComponent,
  RegisterSlotComponent,
  useProgrammingPhase,
} from "./RegistersProgram";
```

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Components can be used independently
3. **Testability**: Each component/hook can be tested in isolation
4. **Maintainability**: Easier to locate and modify specific functionality
5. **Type Safety**: Clear TypeScript interfaces for all components
6. **Performance**: Better tree-shaking and code splitting opportunities
