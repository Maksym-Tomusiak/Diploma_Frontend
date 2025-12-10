import { httpClient } from "./HttpClient";
import type { TokenResponse, GoogleAuthUrl, User } from "@/types/auth";

class AuthService {
  /**
   * Get Google OAuth authorization URL
   */
  async getGoogleAuthUrl(): Promise<string> {
    const response = await httpClient.get<GoogleAuthUrl>("/v1/auth/login");
    return response.authorization_url;
  }

  /**
   * Handle OAuth callback and store tokens
   */
  async handleCallback(code: string): Promise<TokenResponse> {
    const response = await httpClient.get<TokenResponse>(
      `/v1/auth/callback?code=${encodeURIComponent(code)}`
    );

    // Store access token
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.access_token);
    }

    return response;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>("/v1/auth/me");
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post("/v1/auth/logout");
    } finally {
      // Clear stored tokens regardless of API response
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  /**
   * Initiate Google OAuth login flow
   */
  async loginWithGoogle(): Promise<void> {
    const authUrl = await this.getGoogleAuthUrl();
    window.location.href = authUrl;
  }
}

export const authService = new AuthService();
