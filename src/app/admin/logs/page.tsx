"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { LogsTable } from "@/components/admin/LogsTable";
import { useLogsManagement } from "@/hooks/useLogsManagement";

export default function LogsPage() {
  const searchParams = useSearchParams();
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const logsData = useLogsManagement(isAdmin, authLoading, "logs");

  // Handle user_id from URL query params
  useEffect(() => {
    const userId = searchParams.get("user_id");
    if (userId) {
      logsData.setLogsFilterUserId(userId);
      logsData.setCurrentPage(1);
    }
  }, [searchParams]);

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Activity Logs
      </h1>
      <LogsTable
        logs={logsData.logs}
        logsTotal={logsData.logsTotal}
        currentPage={logsData.currentPage}
        totalPages={logsData.totalPages}
        onPageChange={logsData.setCurrentPage}
        pageSize={logsData.pageSize}
        logsLoading={logsData.logsLoading}
        logsError={logsData.logsError}
        logsFilterUserId={logsData.logsFilterUserId}
        setLogsFilterUserId={logsData.setLogsFilterUserId}
        logsFilterActionType={logsData.logsFilterActionType}
        setLogsFilterActionType={logsData.setLogsFilterActionType}
        handleClearLogsFilter={logsData.handleClearLogsFilter}
        users={[]}
      />
    </>
  );
}
