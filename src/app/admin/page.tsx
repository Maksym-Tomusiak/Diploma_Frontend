"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import type { ActiveTab, UserLogsModalState } from "@/types/admin";
import { getUserInitials } from "@/lib/formatters";
import { userActionLogService } from "@/services/UserActionLogService";
import { TemplateFormDialog } from "@/components/TemplateFormDialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UsersTable } from "@/components/admin/UsersTable";
import { LogsTable } from "@/components/admin/LogsTable";
import { TemplatesTable } from "@/components/admin/TemplatesTable";
import { FontsTable } from "@/components/admin/FontsTable";
import { UserLogsModal } from "@/components/admin/UserLogsModal";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { useLogsManagement } from "@/hooks/useLogsManagement";
import { useTemplatesManagement } from "@/hooks/useTemplatesManagement";
import { useFontsManagement } from "@/hooks/useFontsManagement";

export default function AdminPage() {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [userLogsModal, setUserLogsModal] = useState<UserLogsModalState>({
    open: false,
    user: null,
    logs: [],
  });
  const [userLogsLoading, setUserLogsLoading] = useState(false);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Custom hooks for data management
  const usersData = useUsersManagement(isAdmin, authLoading);
  const logsData = useLogsManagement(isAdmin, authLoading, activeTab);
  const templatesData = useTemplatesManagement(isAdmin, authLoading, activeTab);
  const fontsData = useFontsManagement(isAdmin, authLoading, activeTab);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/");
    }
  }, [currentUser, authLoading, router, isAdmin]);

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

  const handleViewAllUserLogs = (userId: number) => {
    setUserLogsModal({ open: false, user: null, logs: [] });
    setActiveTab("logs");
    logsData.setLogsFilterUserId(userId);
    logsData.setCurrentPage(1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "users":
        return "User Management";
      case "templates":
        return "Templates Management";
      case "fonts":
        return "Fonts Management";
      case "logs":
        return "Activity Logs";
      default:
        return "Admin Panel";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-900">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {currentUser?.email ? getUserInitials(currentUser.email) : "AD"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 p-8">
          {activeTab === "users" && (
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
          )}

          {activeTab === "logs" && (
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
          )}

          {activeTab === "templates" && (
            <TemplatesTable
              templates={templatesData.templates}
              currentPage={templatesData.currentPage}
              totalPages={templatesData.totalPages}
              onPageChange={templatesData.setCurrentPage}
              templatesLoading={templatesData.templatesLoading}
              templatesError={templatesData.templatesError}
              onCreateTemplate={templatesData.handleCreateTemplate}
              onEditTemplate={templatesData.handleEditTemplate}
              onDeleteTemplate={templatesData.handleDeleteTemplate}
              onToggleTemplateActive={templatesData.handleToggleTemplateActive}
            />
          )}

          {activeTab === "fonts" && (
            <FontsTable
              fonts={fontsData.fonts}
              searchQuery={fontsData.searchQuery}
              setSearchQuery={fontsData.setSearchQuery}
              currentPage={fontsData.currentPage}
              totalPages={fontsData.totalPages}
              onPageChange={fontsData.setCurrentPage}
              fontsLoading={fontsData.fontsLoading}
              fontsError={fontsData.fontsError}
              onSeedFonts={fontsData.handleSeedFonts}
              onRefresh={fontsData.handleRefresh}
            />
          )}
        </div>
      </main>

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

      <TemplateFormDialog
        open={templatesData.templateDialogOpen}
        onOpenChange={templatesData.setTemplateDialogOpen}
        template={templatesData.editingTemplate}
        onSuccess={templatesData.handleTemplateSave}
      />
    </div>
  );
}
