# Game Pause Feature

## 📋 Overview

This feature allows players to request a pause during an ongoing game session. The pause request requires a majority vote (>50%) from all players to be approved.

## 🎯 Feature Flow

### 1. Request Pause
- Any player (host or participant) can click the "Pause Game" button in the game header
- Button is visible on both Programming and Activation phases
- System sends pause request to backend via REST API
- Backend broadcasts `GamePauseRequested` event via SignalR to all players

### 2. Vote on Pause
- **Requester**: Sees a waiting dialog showing responses from other players in real-time
- **Other Players**: Receive a dialog with Approve/Deny buttons
- Each player submits their vote via REST API
- Backend broadcasts `GamePauseResponse` event for each vote

### 3. View Results
- Backend calculates results (>50% approval required)
- Broadcasts `GamePauseResult` event to all players
- All players see result dialog with:
  - Approval percentage
  - Vote count visualization
  - Outcome message

### 4. Navigate
- **If Approved**: All players navigate to home page
- **If Denied**: Dialog closes, game continues normally

## 🔌 Backend Integration

### REST API Endpoints

```typescript
POST /api/games/{gameId}/pause/request
Body: { username: string }
```

```typescript
POST /api/games/{gameId}/pause/respond
Body: { username: string, approved: boolean }
```

### SignalR Events

**Server → Client Events:**

```typescript
// Pause request initiated
interface GamePauseRequestedEvent {
  gameId: string;
  requesterUsername: string;
}

// Individual player response
interface GamePauseResponseEvent {
  gameId: string;
  username: string;
  approved: boolean;
}

```typescript
// Final result
interface GamePauseResultEvent {
  gameId: string;
  result: boolean;
  requestedBy: string;
  playerResponses: Record<string, boolean>;
}
```
```

## 🏗️ Architecture

### Components

```
src/modules/game/components/
├── GamePauseButton.tsx         # Pause button (header)
├── GamePauseDialog.tsx         # Request/voting dialog
└── GamePauseResultDialog.tsx   # Result display
```

### State Management

**Updated Architecture:**
- **No Redux State for Pause** - Pause request state is now managed locally in the `useGamePause` hook
- This simplifies the architecture and keeps pause state transient (not persisted in Redux)

```typescript
// Local state in useGamePause hook
const [pauseRequest, setPauseRequest] = useState<{
  isActive: boolean;
  requester: string;
  responses: Record<string, boolean>;
} | null>(null);

const [pauseResult, setPauseResult] = useState<{
  result: boolean;
  requestedBy: string;
  playerResponses: Record<string, boolean>;
} | null>(null);
```

### Custom Hook

```typescript
// useGamePause.ts
const {
  handleRequestPause,      // Initiate pause request
  handleRespondToPause,    // Vote on request
  handleContinue,          // Handle result dialog
  showRequestDialog,       // Dialog visibility
  showResultDialog,        // Result dialog visibility
  pauseRequest,            // Current pause state
  isRequester,             // Is current player the requester
  totalPlayers,            // Total player count
  isRequestingPause,       // Loading state
  isResponding,            // Response loading state
} = useGamePause({ gameId, username });
```

## 🎨 UI/UX Features

### Pause Button
- Fixed position in top-left header
- Glass panel with neon border (cyberpunk theme)
- Disabled when pause request is active
- Loading state with pulse animation
- Tooltip with description

### Request Dialog
**Cyberpunk Gaming Aesthetic:**
- Electric border animation with neon colors
- Gradient header with rotating icon (Clock for requester, Swords for voters)
- Large, bold title with gradient text effect
- Glass morphism background

**For Requester:**
- Real-time response tracking with animated progress bar
- Gradient-filled progress indicator
- Response grid with approve/deny indicators
- Pulse animations on new responses
- Color-coded response cards (green/red)
- Animated loading spinner

**For Other Players:**
- Info panel with glass effect
- Large vote buttons with electric borders
- Approve button: Green theme with checkmark
- Deny button: Red theme with X icon
- Full-width responsive layout

### Result Dialog
**Epic Results Screen:**
- Electric border (green for approved, red for denied)
- Animated background gradient that rotates
- Large icon badge (Trophy for approved, Skull for denied)
- Massive gradient title text
- Detailed voting breakdown with animated progress bars
- Split progress bar showing approve vs deny votes
- Vote count cards with glass panels
- Color-coded statistics (green/red)
- Final call-to-action button with electric border
- Smooth enter/exit animations with Framer Motion

**Special Effects:**
- Rotating background gradient
- Scale and rotate animations on icon badge
- Staggered content animations (opacity + y-offset)
- Animated vote percentage reveal
- Dual-sided progress bar with center divider
- Glowing button states

## 🔄 State Synchronization

```
Player A (Requester)
  ├─ Click "Pause Game"
  ├─ POST /pause/request
  ├─ Redux: initiatePauseRequest
  └─ Show waiting dialog

Backend
  ├─ Broadcast: GamePauseRequested
  └─ All other players receive event

Player B, C, D (Voters)
  ├─ Receive SignalR event
  ├─ Redux: initiatePauseRequest
  ├─ Show voting dialog
  ├─ Click Approve/Deny
  ├─ POST /pause/respond
  └─ Dialog closes

Backend
  ├─ Collect all responses
  ├─ Calculate result
  └─ Broadcast: GamePauseResult

All Players
  ├─ Receive result event
  ├─ Close request dialog
  ├─ Show result dialog
  └─ If approved → Navigate home
     If denied → Continue game
```

## 🎯 Design Decisions

### Why Redux for Pause State?
- Centralized state accessible across all game components
- Easy integration with existing game state
- Consistent with app architecture

### Why Separate Dialogs?
- **GamePauseDialog**: Handles both requester and voter views
- **GamePauseResultDialog**: Dedicated result display
- Clear separation of concerns
- Better UX with distinct visual states

### Why Fixed Button Position?
- Always accessible regardless of phase
- Doesn't interfere with game controls
- Consistent with existing GameHostControls positioning

## 🧪 Testing Scenarios

1. **Single Player Request**: Player A requests pause
2. **Unanimous Approval**: All players approve
3. **Majority Approval**: >50% approve
4. **Majority Denial**: ≤50% approve
5. **Mixed Responses**: Some approve, some deny
6. **Network Issues**: Handle disconnects during voting
7. **Requester Cancels**: Cancel before all votes collected

## 📝 Notes

- Pause state is NOT persisted (cleared on page refresh)
- Only ONE pause request active at a time
- Requires ALL non-requester players to vote
- Approval threshold: >50% (majority)
- Works in both Programming and Activation phases
- Button disabled during active pause request
- Result automatically navigates if approved (3-5s delay recommended)

## 🔮 Future Enhancements

- [ ] Add timeout for votes (auto-deny after 30s)
- [ ] Persist pause state in backend
- [ ] Allow requester to cancel mid-vote
- [ ] Add "Resume Game" functionality
- [ ] Show pause history in game logs
- [ ] Add sound effects for vote events
- [ ] Animate vote count in real-time
