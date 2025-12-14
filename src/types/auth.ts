// Auth types matching backend schemas

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface GoogleAuthUrl {
  authorization_url: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_banned?: boolean;
  created_at: string;
}
