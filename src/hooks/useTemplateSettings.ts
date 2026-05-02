import { useState, useEffect } from "react";
import { templateService } from "@/services/TemplateService";
import { fontService } from "@/services/FontService";
import type { Template, TemplateParams, PageMargins } from "@/types/document";

export function useTemplateSettings(isAuthenticated: boolean) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedFontFamily, setSelectedFontFamily] = useState<string | null>(
    null,
  );

  const [templateParams, setTemplateParams] = useState<TemplateParams>({
    font_size: 14,
    line_spacing: 1.5,
    margins: {
      top: 20,
      bottom: 20,
      left: 30,
      right: 15,
    },
    check_numbering: true,
    start_from_number: 1,
    skip_first_page: false,
  });

  // Load templates (available for both authenticated and anonymous users)
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await templateService.getTemplates(false, 0, 100);
        const data = response.templates || [];
        setTemplates(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setSelectedTemplate(data[0].id);
          setTemplateParams(data[0].params);
          setSelectedFontFamily(data[0].font_family);
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
        setTemplates([]);
      } finally {
        setLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []); // Remove isAuthenticated dependency

  // Update params when template changes
  useEffect(() => {
    if (selectedTemplate && !isCustomMode && templates.length > 0) {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        setTemplateParams(template.params);
        setSelectedFontFamily(template.font_family);
      }
    }
  }, [selectedTemplate, isCustomMode, templates]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(parseInt(templateId));
    setIsCustomMode(false);
  };

  const handleParamChange = (key: string, value: any) => {
    setIsCustomMode(true);
    setTemplateParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMarginChange = (side: keyof PageMargins, value: number) => {
    setIsCustomMode(true);
    setTemplateParams((prev) => ({
      ...prev,
      margins: {
        ...prev.margins,
        [side]: value,
      },
    }));
  };

  const handlePageNumberingChange = (
    key: "check_numbering" | "start_from_number" | "skip_first_page",
    value: any,
  ) => {
    setIsCustomMode(true);
    setTemplateParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    setIsCustomMode(true);
    setSelectedFontFamily(fontFamily);
  };

  const handleFontSearch = async (query: string) => {
    try {
      const response = await fontService.getFonts(0, 50, query || undefined);
      return response.fonts.map((font) => ({
        value: font.family,
        label: font.family,
      }));
    } catch (error) {
      console.error("Failed to search fonts:", error);
      return [];
    }
  };

  return {
    selectedTemplate,
    templates,
    loadingTemplates,
    isCustomMode,
    templateParams,
    selectedFontFamily,
    handleTemplateChange,
    handleParamChange,
    handleMarginChange,
    handlePageNumberingChange,
    handleFontFamilyChange,
    handleFontSearch,
  };
}
