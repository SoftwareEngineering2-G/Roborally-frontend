export interface Player {
  id: string;
  username: string;
  avatar?: string;
}

export interface Lobby {
  gameId: string;
  gameRoomName: string;
  hostUsername: string;
  currentAmountOfPlayers: number;
}

export interface CreateLobbyRequest {
  hostUsername: string;
  gameRoomName: string;
  isPrivate: boolean;
}

export interface CreateLobbyResponse {
  gameRoomId: string;
}

export interface JoinLobbyRequest {
  gameId: string;
  username: string;
}

export interface LeaveLobbyRequest {
  gameId: string;
  username: string;
}

export interface GetLobbyInfoRequest {
  gameId: string;
  username: string;
}

export interface GetLobbyInfoResponse {
  gameId: string;
  lobbyname: string;
  joinedUsernames: string[];
  hostUsername: string;
  requiredUsernames: string[] | null; // For paused games
  pausedGameBoardName: string | null; // For paused games
}

export interface StartGameRequest {
  gameId: string;
  username: string;
  gameBoardName: string;
}

export interface ContinueGameRequest {
  gameId: string;
  username: string;
}
