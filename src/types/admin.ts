/**
 * Types for admin panel
 */

export type ActiveTab = "users" | "logs" | "templates" | "fonts";

export interface UserLogsModalState {
  open: boolean;
  user: any | null;
  logs: any[];
}
