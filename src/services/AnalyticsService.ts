import { httpClient } from "./HttpClient";

export interface DocumentProcessingStats {
  date: string;
  checks: number;
  formatting: number;
}

export interface UserRegistrationStats {
  date: string;
  count: number;
}

export interface RecentUser {
  id: number;
  email: string;
  created_at: string;
  role: string;
}

export interface UserAction {
  id: number;
  user_id: number;
  user_email: string;
  action_type: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface AnalyticsDashboard {
  document_processing: DocumentProcessingStats[];
  user_registrations: UserRegistrationStats[];
  recent_users: RecentUser[];
  recent_bans_unbans: UserAction[];
}

class AnalyticsService {
  async getDashboardData(): Promise<AnalyticsDashboard> {
    return httpClient.get<AnalyticsDashboard>("/v1/analytics/dashboard");
  }
}

export const analyticsService = new AnalyticsService();
