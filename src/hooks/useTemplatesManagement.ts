import { useState, useEffect } from "react";
import { templateService } from "@/services/TemplateService";
import type { Template } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

export function useTemplatesManagement(
  isAdmin: boolean,
  authLoading: boolean,
  activeTab: string
) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  // Fetch templates
  useEffect(() => {
    const controller = new AbortController();

    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);
        const skip = (currentPage - 1) * pageSize;
        const data = await templateService.getTemplates(true, skip, pageSize);
        setTemplates(data.templates);
        setTotal(data.total);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setTemplatesError(
            err.response?.data?.detail || "Failed to load templates"
          );
        }
      } finally {
        setTemplatesLoading(false);
      }
    };

    if (!authLoading && isAdmin && activeTab === "templates") {
      fetchTemplates();
    }

    return () => controller.abort();
  }, [authLoading, isAdmin, activeTab, currentPage, pageSize]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await templateService.deleteTemplate(templateId);
      setTemplates(templates.filter((t) => t.id !== templateId));
      toast({
        title: "Template deleted",
        description: "Template has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete template",
        description:
          err.response?.data?.detail ||
          "An error occurred while deleting the template.",
      });
    }
  };

  const handleToggleTemplateActive = async (
    templateId: number,
    isActive: boolean
  ) => {
    try {
      const updated = await templateService.updateTemplate(templateId, {
        is_active: !isActive,
      });
      setTemplates(templates.map((t) => (t.id === templateId ? updated : t)));
      toast({
        title: isActive ? "Template deactivated" : "Template activated",
        description: `Template has been ${
          isActive ? "deactivated" : "activated"
        } successfully.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to update template",
        description:
          err.response?.data?.detail ||
          "An error occurred while updating the template.",
      });
    }
  };

  const handleTemplateSave = (savedTemplate: Template) => {
    if (editingTemplate) {
      setTemplates(
        templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
      );
    } else {
      setTemplates([...templates, savedTemplate]);
    }
  };

  return {
    templates,
    total,
    currentPage,
    totalPages,
    setCurrentPage,
    templatesLoading,
    templatesError,
    templateDialogOpen,
    setTemplateDialogOpen,
    editingTemplate,
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleToggleTemplateActive,
    handleTemplateSave,
  };
}
