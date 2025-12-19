export interface GetLeaderboardRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface LeaderboardUser {
  username: string;
  rating: number;
}

export interface GetLeaderboardResponse {
  items: LeaderboardUser[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}