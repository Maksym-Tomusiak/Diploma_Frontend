import { useState, useEffect } from "react";
import {
  userActionLogService,
  UserActionLog,
} from "@/services/UserActionLogService";

export function useLogsManagement(
  isAdmin: boolean,
  authLoading: boolean,
  activeTab: string
) {
  const [logs, setLogs] = useState<UserActionLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [logsFilterUserId, setLogsFilterUserId] = useState<string | null>(null);
  const [logsFilterActionType, setLogsFilterActionType] = useState<string>("");

  const totalPages = Math.ceil(logsTotal / pageSize);

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
  };
}
