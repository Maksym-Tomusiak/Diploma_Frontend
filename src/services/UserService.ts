import { httpClient } from "./HttpClient";
import { User, UserRole } from "@/types/auth";

export class UserService {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers(signal?: AbortSignal): Promise<User[]> {
    return httpClient.get<User[]>("/v1/users", signal);
  }

  /**
   * Get current user
   */
  async getCurrentUser(signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>("/v1/users/me", signal);
  }

  /**
   * Get user by ID
   */
  async getUser(userId: number, signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>(`/v1/users/${userId}`, signal);
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: number, signal?: AbortSignal): Promise<User> {
    return httpClient.delete<User>(`/v1/users/${userId}`, signal);
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(
    userId: number,
    role: UserRole,
    signal?: AbortSignal
  ): Promise<User> {
    return httpClient.patch<User>(`/v1/users/${userId}/role`, { role }, signal);
  }

  /**
   * Ban a user (Admin only)
   */
  async banUser(userId: number, signal?: AbortSignal): Promise<User> {
    return httpClient.post<User>(`/v1/users/${userId}/ban`, undefined, signal);
  }

  /**
   * Unban a user (Admin only)
   */
  async unbanUser(userId: number, signal?: AbortSignal): Promise<User> {
    return httpClient.post<User>(
      `/v1/users/${userId}/unban`,
      undefined,
      signal
    );
  }
}

export const userService = new UserService();
