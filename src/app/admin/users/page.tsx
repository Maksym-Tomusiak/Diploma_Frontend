"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import type { UserLogsModalState } from "@/types/admin";
import { userActionLogService } from "@/services/UserActionLogService";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserLogsModal } from "@/components/admin/UserLogsModal";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [userLogsModal, setUserLogsModal] = useState<UserLogsModalState>({
    open: false,
    user: null,
    logs: [],
  });
  const [userLogsLoading, setUserLogsLoading] = useState(false);

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const usersData = useUsersManagement(isAdmin, authLoading);

  const handleViewUserLogs = async (user: any) => {
    setUserLogsLoading(true);
    setUserLogsModal({ open: true, user, logs: [] });

    try {
      const data = await userActionLogService.getAllLogs({
        user_id: user.id,
        limit: 5,
      });
      setUserLogsModal({ open: true, user, logs: data.logs });
    } catch (err: any) {
      console.error("Failed to load user logs:", err);
    } finally {
      setUserLogsLoading(false);
    }
  };

  const handleViewAllUserLogs = (userId: string) => {
    setUserLogsModal({ open: false, user: null, logs: [] });
    router.push(`/admin/logs?user_id=${userId}`);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        User Management
      </h1>
      <UsersTable
        users={usersData.users}
        setUsers={usersData.setUsers}
        searchQuery={usersData.searchQuery}
        setSearchQuery={usersData.setSearchQuery}
        currentPage={usersData.currentPage}
        totalPages={usersData.totalPages}
        onPageChange={usersData.setCurrentPage}
        isLoading={usersData.isLoading}
        error={usersData.error}
        currentUser={currentUser}
        onViewUserLogs={handleViewUserLogs}
      />

      <UserLogsModal
        open={userLogsModal.open}
        onOpenChange={(open) =>
          setUserLogsModal({ open, user: null, logs: [] })
        }
        user={userLogsModal.user}
        logs={userLogsModal.logs}
        isLoading={userLogsLoading}
        onViewAllLogs={handleViewAllUserLogs}
      />
    </>
  );
}
