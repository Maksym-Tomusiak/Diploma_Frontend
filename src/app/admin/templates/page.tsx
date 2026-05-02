"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { TemplatesTable } from "@/components/admin/TemplatesTable";
import { TemplateFormDialog } from "@/components/TemplateFormDialog";
import { useTemplatesManagement } from "@/hooks/useTemplatesManagement";

export default function TemplatesPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const templatesData = useTemplatesManagement(
    isAdmin,
    authLoading,
    "templates"
  );

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Templates Management
      </h1>
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

      <TemplateFormDialog
        open={templatesData.templateDialogOpen}
        onOpenChange={templatesData.setTemplateDialogOpen}
        template={templatesData.editingTemplate}
        onSuccess={templatesData.handleTemplateSave}
      />
    </>
  );
}
