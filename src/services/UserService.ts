import { httpClient } from "./HttpClient";
import { User, UserRole } from "@/types/auth";

export class UserService {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers(
    skip: number = 0,
    limit: number = 10,
    signal?: AbortSignal,
  ): Promise<{ users: User[]; total: number; skip: number; limit: number }> {
    return httpClient.get<{
      users: User[];
      total: number;
      skip: number;
      limit: number;
    }>(`/v1/users?skip=${skip}&limit=${limit}`, { signal });
  }

  /**
   * Get current user
   */
  async getCurrentUser(signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>("/v1/users/me", { signal });
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string, signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>(`/v1/users/${userId}`, { signal });
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string, signal?: AbortSignal): Promise<User> {
    return httpClient.delete<User>(`/v1/users/${userId}`, { signal });
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(
    userId: string,
    role: UserRole,
    signal?: AbortSignal,
  ): Promise<User> {
    return httpClient.patch<User>(`/v1/users/${userId}/role`, { role }, { signal });
  }

  /**
   * Ban a user (Admin only)
   */
  async banUser(
    userId: string,
    reason?: string,
    signal?: AbortSignal,
  ): Promise<User> {
    return httpClient.post<User>(
      `/v1/users/${userId}/ban`,
      reason ? { reason } : undefined,
      { signal },
    );
  }

  /**
   * Unban a user (Admin only)
   */
  async unbanUser(
    userId: string,
    reason?: string,
    signal?: AbortSignal,
  ): Promise<User> {
    return httpClient.post<User>(
      `/v1/users/${userId}/unban`,
      reason ? { reason } : undefined,
      { signal },
    );
  }
}

export const userService = new UserService();
