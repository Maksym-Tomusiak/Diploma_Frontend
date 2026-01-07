import { httpClient } from "./HttpClient";

export interface UserActionLog {
  id: number;
  user_id: number;
  action_type: string;
  details?: Record<string, any>;
  created_at: string;
  user_email?: string;
}

export interface UserActionLogListResponse {
  logs: UserActionLog[];
  total: number;
  limit: number;
  skip: number;
}

class UserActionLogService {
  /**
   * Get all user action logs (admin only)
   */
  async getAllLogs(params?: {
    limit?: number;
    skip?: number;
    action_type?: string;
    user_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<UserActionLogListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.action_type)
      queryParams.append("action_type", params.action_type);
    if (params?.user_id)
      queryParams.append("user_id", params.user_id.toString());
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    const queryString = queryParams.toString();
    const url = `/v1/logs${queryString ? `?${queryString}` : ""}`;

    return httpClient.get<UserActionLogListResponse>(url);
  }

  /**
   * Get current user's action logs
   */
  async getMyLogs(params?: {
    limit?: number;
    offset?: number;
  }): Promise<UserActionLog[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const queryString = queryParams.toString();
    const url = `/v1/logs/me${queryString ? `?${queryString}` : ""}`;

    return httpClient.get<UserActionLog[]>(url);
  }

  /**
   * Get a specific log entry by ID (admin only)
   */
  async getLog(logId: number): Promise<UserActionLog> {
    return httpClient.get<UserActionLog>(`/v1/logs/${logId}`);
  }
}

export const userActionLogService = new UserActionLogService();
