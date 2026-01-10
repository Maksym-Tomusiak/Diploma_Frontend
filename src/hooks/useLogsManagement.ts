import { useState, useEffect } from "react";
import {
  userActionLogService,
  UserActionLog,
} from "@/services/UserActionLogService";
import { userService } from "@/services/UserService";
import type { User } from "@/types/auth";

export function useLogsManagement(
  isAdmin: boolean,
  authLoading: boolean,
  activeTab: string,
  initialUserId: string | null = null,
  initialActionType: string | null = null
) {
  const [logs, setLogs] = useState<UserActionLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [logsFilterUserId, setLogsFilterUserId] = useState<string | null>(
    initialUserId
  );
  const [logsFilterActionType, setLogsFilterActionType] = useState<string>(
    initialActionType || ""
  );
  const [users, setUsers] = useState<User[]>([]);

  const totalPages = Math.ceil(logsTotal / pageSize);

  // Fetch users for filter dropdown
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers(
          0,
          1000, // Fetch enough users for dropdown
          controller.signal
        );
        setUsers(data.users);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error("Failed to load users for filter:", err);
        }
      }
    };

    if (!authLoading && isAdmin) {
      fetchUsers();
    }

    return () => controller.abort();
  }, [authLoading, isAdmin]);

  // Fetch logs
  useEffect(() => {
    const controller = new AbortController();

    const fetchLogs = async () => {
      try {
        setLogsLoading(true);
        setLogsError(null);
        const skip = (currentPage - 1) * pageSize;
        const data = await userActionLogService.getAllLogs({
          limit: pageSize,
          skip: skip,
          user_id: logsFilterUserId || undefined,
          action_type: logsFilterActionType || undefined,
        });
        setLogs(data.logs);
        setLogsTotal(data.total);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setLogsError(err.response?.data?.detail || "Failed to load logs");
        }
      } finally {
        setLogsLoading(false);
      }
    };

    if (!authLoading && isAdmin && activeTab === "logs") {
      fetchLogs();
    }

    return () => controller.abort();
  }, [
    authLoading,
    isAdmin,
    activeTab,
    currentPage,
    pageSize,
    logsFilterUserId,
    logsFilterActionType,
  ]);

  const handleClearLogsFilter = () => {
    setLogsFilterUserId(null);
    setLogsFilterActionType("");
    setCurrentPage(1);
  };

  return {
    logs,
    logsTotal,
    currentPage,
    totalPages,
    setCurrentPage,
    pageSize,
    logsLoading,
    logsError,
    logsFilterUserId,
    setLogsFilterUserId,
    logsFilterActionType,
    setLogsFilterActionType,
    handleClearLogsFilter,
    users,
  };
}
