# Backend Requirements - Game Pause & Resume Feature

## 📋 Overview
Tài liệu này mô tả các API endpoints và business logic cần implement ở backend để hỗ trợ tính năng pause/resume game đã được implement ở frontend.

---

## 🔗 API Endpoints Required

### 1. **Get Paused Games**
**Endpoint:** `GET /api/games/paused`

**Query Parameters:**
- `username` (string, required) - Username của người dùng

**Response:** `200 OK`
```json
[
  {
    "gameId": "string",
    "gameName": "string",
    "hostUsername": "string",
    "playerUsernames": ["string"]
  }
]
```

**Description:**
- Trả về danh sách các game đã pause mà user tham gia
- Chỉ hiển thị games chưa hoàn thành (paused, not finished)
- Sắp xếp theo thời gian pause gần nhất

**Business Logic:**
- Filter games where `status = "PAUSED"` AND `username IN playerUsernames`
- Return game basic info + list of all players

---

### 2. **Join Continue Game Lobby**
**Endpoint:** `POST /api/game-lobbies/{gameId}/continue`

**Path Parameters:**
- `gameId` (string, required)

**Request Body:**
```json
{
  "username": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Description:**
- Join vào lobby của paused game
- Lobby này có `requiredPlayers` set từ trước
- Chỉ cho phép required players join

**Business Logic:**
1. Validate `gameId` exists và có lobby tương ứng
2. Validate lobby này có `requiredPlayers` được set
3. Validate `username` nằm trong `requiredPlayers`
4. Add user vào lobby
5. Broadcast `UserJoinedLobby` event qua SignalR

**Note:**
- Lobby đã được tạo sẵn khi game pause được approved
- Endpoint này chỉ join user vào existing lobby
- Frontend sẽ navigate đến `/lobby/{gameId}` sau khi join thành công

**Error Cases:**
- `404` - Game/Lobby not found
- `403` - User not in required players list
- `409` - Lobby full or user already in lobby

---

### 3. **Request Game Pause** *(Already implemented in previous feature)*
**Endpoint:** `POST /api/games/{gameId}/pause/request`

**Request Body:**
```json
{
  "username": "string"
}
```

**Response:** `200 OK`

**SignalR Broadcast:**
```typescript
// Broadcast to all players in game (except requester)
{
  "event": "GamePauseRequested",
  "data": {
    "requestedBy": "string",
    "gameId": "string"
  }
}
```

**Business Logic:**
- Validate game is in progress
- Broadcast pause request to all players
- Start timeout timer (e.g., 30 seconds for responses)

---

### 4. **Respond to Pause Request** *(Already implemented)*
**Endpoint:** `POST /api/games/{gameId}/pause/respond`

**Request Body:**
```json
{
  "username": "string",
  "approved": boolean
}
```

**Response:** `200 OK`

**SignalR Broadcast (when all responses collected):**
```typescript
{
  "event": "GamePauseResult",
  "data": {
    "result": boolean,           // true if >50% approved
    "requestedBy": "string",
    "playerResponses": {
      "username1": true,
      "username2": false,
      // ...
    }
  }
}
```

**Business Logic:**
1. Record vote from user
2. Check if all players have responded
3. Calculate result: `approved votes > 50%`
4. If approved:
   - Set game status = "PAUSED"
   - Save current game state
   - Broadcast result with `result: true`
5. If denied:
   - Broadcast result with `result: false`
   - Game continues normally

---

## 🎯 Lobby Changes for Paused Games

### Modified Endpoint: `GET /api/game-lobbies/{gameId}`
**Query Parameters:**
- `username` (string, required)

**Response:** `200 OK`
```json
{
  "gameId": "string",
  "lobbyname": "string",
  "joinedUsernames": ["string"],
  "hostUsername": "string",
  "requiredPlayers": ["string"] | null  // ← NEW FIELD
}
```

**Field: `requiredPlayers`**
- `null` - Normal lobby (new game), anyone can join
- `["user1", "user2", ...]` - Paused game lobby, only these users can join

---

### Modified Endpoint: `POST /api/game-lobbies/{gameId}/join`
**Request Body:**
```json
{
  "username": "string"
}
```

**Additional Validation:**
- If `requiredPlayers !== null`:
  - Check if `username IN requiredPlayers`
  - If NOT: Return `403 Forbidden` with message "This lobby is reserved for specific players"
- If `requiredPlayers === null`:
  - Normal join logic (check max players, etc.)

---

### Modified Endpoint: `POST /api/game-lobbies/{gameId}/start`
**Request Body:**
```json
{
  "username": "string",
  "gameBoardName": "string"
}
```

**Additional Validation for Paused Games:**
- If `requiredPlayers !== null`:
  - Validate ALL required players are in lobby
  - If not all present: Return `400 Bad Request` with message "Not all required players have joined"
  - If all present: Resume game from saved state
- If `requiredPlayers === null`:
  - Normal game start logic

**Business Logic when resuming:**
1. Validate all required players present
2. Load saved game state from database
3. Restore:
   - Player positions
   - Programming cards state
   - Current phase
   - Board state
4. Set game status = "IN_PROGRESS"
5. Broadcast `GameStarted` event to all players
6. Continue from saved register/phase

---

## 📊 Database Schema Changes

### Games Table
Add/modify columns:
```sql
ALTER TABLE games 
ADD COLUMN status VARCHAR(20) DEFAULT 'IN_PROGRESS';
-- Possible values: 'IN_PROGRESS', 'PAUSED', 'RESUMING', 'COMPLETED'

ADD COLUMN paused_at TIMESTAMP NULL;
-- Timestamp when game was paused

ADD COLUMN game_state_snapshot JSONB NULL;
-- Snapshot of entire game state when paused
-- Contains: player positions, cards, current phase, board state, etc.
```

### Lobbies Table
Add column:
```sql
ALTER TABLE lobbies
ADD COLUMN required_players TEXT[] NULL;
-- Array of usernames that MUST join (for paused games)
-- NULL for normal lobbies
```

---

## 🔄 Complete Flow Example

### Pause Game Flow:
```
1. Player A clicks "Pause Game" button
   → POST /api/games/{gameId}/pause/request
   
2. Backend broadcasts to all players
   → SignalR: GamePauseRequested
   
3. Each player responds within timeout
   → POST /api/games/{gameId}/pause/respond
   
4. Backend collects votes, calculates result
   → SignalR: GamePauseResult { result: true/false }
   
5. If approved:
   - Backend saves game state
   - Sets status = "PAUSED"
   - Frontend navigates all players to home
```

### Resume Game Flow:
```
1. Player sees paused game on home page
   → GET /api/games/paused?username=PlayerA
   
2. Player clicks "Continue Game"
   → POST /api/game-lobbies/{gameId}/continue
   
3. Backend adds user to existing paused game lobby
   → Returns success response
   
4. Frontend navigates to lobby
   → GET /api/game-lobbies/{gameId}?username=PlayerA
   → Response includes requiredPlayers array
   
5. Other players also click "Continue" and join
   → Only allowed if username IN requiredPlayers
   → POST /api/game-lobbies/{gameId}/continue
   
6. When all required players joined, host starts
   → POST /api/game-lobbies/{gameId}/start
   
7. Backend loads saved game state
   → Restores all game data
   → SignalR: GameStarted
   → Game continues from saved state
```

**Important Notes:**
- Lobby for paused game should be created automatically when pause is approved
- OR create lobby on first player's continue request
- All subsequent players use same continue endpoint to join
- Regular `/join` endpoint should reject non-required players

---

## ⚠️ Important Notes

### Security Considerations:
1. **Validate ownership:** Only players from paused game can continue it
2. **Prevent duplicate resumes:** Check if game already resumed
3. **Timeout handling:** Clean up abandoned pause requests
4. **State validation:** Verify game state integrity before resume

### Performance Considerations:
1. **Index on game status:** For faster paused games queries
2. **Cache paused games list:** Update only when games are paused/resumed
3. **Limit snapshot size:** Consider storing only essential state

### Edge Cases to Handle:
1. **Player left during pause:** 
   - Option A: Still require them (they must rejoin)
   - Option B: Remove from requiredPlayers if they left
   
2. **Host left during pause:**
   - Transfer host to next player in list
   - Or: First player to continue becomes new host
   
3. **Game state corruption:**
   - Validate saved state before loading
   - Fallback: Start fresh game with same players
   
4. **Multiple continue requests:**
   - First request wins
   - Others get "Already resumed" error

---

## 🧪 Testing Checklist

### Unit Tests:
- [ ] Pause request creates vote session
- [ ] Vote calculation (>50% approval)
- [ ] Game state serialization/deserialization
- [ ] Required players validation

### Integration Tests:
- [ ] Full pause → resume → continue flow
- [ ] Only required players can join resumed lobby
- [ ] Cannot start until all required players joined
- [ ] Game state restored correctly

### Edge Case Tests:
- [ ] Timeout on pause vote
- [ ] Player disconnects during pause vote
- [ ] Duplicate continue requests
- [ ] Invalid game state recovery

---

## 📝 Frontend Implementation Summary

Để tham khảo, frontend đã implement:

### Components:
- `PausedGames` - Display paused games list
- `GamePauseButton` - Trigger pause request
- `GamePauseDialog` - Vote on pause request
- `GamePauseResultDialog` - Show vote results
- `PlayersGrid` - Show required players with opacity

### Redux State:
- `lobbySlice.requiredPlayers` - Track required players
- Selectors: `selectMissingRequiredPlayers`, `selectIsPausedGame`

### API Hooks:
- `useGetPausedGamesQuery()` - from gameApi
- `useJoinContinueGameLobbyMutation()` - from lobbyApi
- `useRequestGamePauseMutation()` - from gameApi
- `useRespondToGamePauseMutation()` - from gameApi

### SignalR Events (Frontend listens):
- `GamePauseRequested` - Show vote dialog
- `GamePauseResult` - Show result & navigate

---

## 🚀 Implementation Priority

1. **High Priority:**
   - [ ] Game pause vote system (request + respond)
   - [ ] Save game state snapshot
   - [ ] Get paused games endpoint

2. **Medium Priority:**
   - [ ] Continue paused game endpoint
   - [ ] Required players validation in lobby
   - [ ] Resume game from snapshot

3. **Low Priority:**
   - [ ] Timeout handling for votes
   - [ ] Host transfer on resume
   - [ ] Advanced state validation

---

## 📞 Support

Nếu cần clarification về bất kỳ endpoint hoặc business logic nào, please ask!
