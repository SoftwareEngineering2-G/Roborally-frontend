export interface GetMyProfileRequest {
  username: string;
}

export interface GetMyProfileResponse {
  username: string;
  birthday: string; // ISO date string
  rating: number;
}
