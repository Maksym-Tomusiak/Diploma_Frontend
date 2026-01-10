"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { LogsTable } from "@/components/admin/LogsTable";
import { useLogsManagement } from "@/hooks/useLogsManagement";

export default function LogsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Get initial values from URL
  const initialUserId = searchParams.get("user_id");
  const initialActionType = searchParams.get("action_type");

  const logsData = useLogsManagement(
    isAdmin,
    authLoading,
    "logs",
    initialUserId,
    initialActionType
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (logsData.logsFilterUserId) {
      params.set("user_id", logsData.logsFilterUserId);
    }

    if (
      logsData.logsFilterActionType &&
      logsData.logsFilterActionType !== "all"
    ) {
      params.set("action_type", logsData.logsFilterActionType);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/admin/logs?${queryString}` : "/admin/logs";

    // Only update if URL actually changed
    const currentUrl = `/admin/logs${window.location.search}`;
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [logsData.logsFilterUserId, logsData.logsFilterActionType, router]);

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
        users={logsData.users}
      />
    </>
  );
}
