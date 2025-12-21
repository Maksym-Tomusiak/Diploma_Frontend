"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SearchCombobox } from "@/components/ui/search-combobox";
import { templateService } from "@/services/TemplateService";
import { fontService } from "@/services/FontService";
import type {
  Template,
  TemplateCreate,
  TemplateParams,
  Font,
} from "@/types/document";
import { useToast } from "@/hooks/use-toast";

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null; // null for create, Template for edit
  onSuccess: (template: Template) => void;
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  template,
  onSuccess,
}: TemplateFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFontLabel, setSelectedFontLabel] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fontId, setFontId] = useState<string>("");
  const [fontSize, setFontSize] = useState("14");
  const [lineSpacing, setLineSpacing] = useState("1.5");
  const [marginTop, setMarginTop] = useState("20");
  const [marginBottom, setMarginBottom] = useState("20");
  const [marginLeft, setMarginLeft] = useState("30");
  const [marginRight, setMarginRight] = useState("10");
  const [pageNumberingEnabled, setPageNumberingEnabled] = useState(true);
  const [pageNumberingStartPage, setPageNumberingStartPage] = useState("1");
  const [skipFirstPage, setSkipFirstPage] = useState(false);

  // Font search function
  const handleFontSearch = async (query: string) => {
    try {
      const response = await fontService.getFonts(0, 50, query || undefined);
      return response.fonts.map((font) => ({
        value: String(font.id),
        label: font.family,
      }));
    } catch (error) {
      console.error("Failed to search fonts:", error);
      return [];
    }
  };

  // Load selected font label when editing
  useEffect(() => {
    if (open && template && template.font_id) {
      const loadSelectedFont = async () => {
        try {
          const font = await fontService.getFont(template.font_id!);
          setSelectedFontLabel(font.family);
        } catch (error) {
          console.error("Failed to load font:", error);
        }
      };
      loadSelectedFont();
    }
  }, [open, template]);

  // Reset form when dialog opens/closes or template changes
  useEffect(() => {
    if (open) {
      if (template) {
        // Edit mode - populate with existing values
        setName(template.name);
        setDescription(template.description);
        setFontId(template.font_id ? String(template.font_id) : "");
        setFontSize(String(template.params.font_size || 14));
        setLineSpacing(String(template.params.line_spacing || 1.5));
        setMarginTop(String(template.params.margins?.top || 20));
        setMarginBottom(String(template.params.margins?.bottom || 20));
        setMarginLeft(String(template.params.margins?.left || 30));
        setMarginRight(String(template.params.margins?.right || 10));
        setPageNumberingEnabled(
          template.params.page_numbering?.enabled ?? true
        );
        setPageNumberingStartPage(
          String(template.params.page_numbering?.start_page || 1)
        );
        setSkipFirstPage(template.params.skip_first_page || false);
      } else {
        // Create mode - reset to defaults
        setName("");
        setDescription("");
        setFontId("");
        setSelectedFontLabel("");
        setFontSize("14");
        setLineSpacing("1.5");
        setMarginTop("20");
        setMarginBottom("20");
        setMarginLeft("30");
        setMarginRight("10");
        setPageNumberingEnabled(true);
        setPageNumberingStartPage("1");
        setSkipFirstPage(false);
      }
    }
  }, [open, template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Template name is required.",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Template description is required.",
      });
      return;
    }

    const fontSizeNum = parseFloat(fontSize);
    const lineSpacingNum = parseFloat(lineSpacing);
    const marginTopNum = parseFloat(marginTop);
    const marginBottomNum = parseFloat(marginBottom);
    const marginLeftNum = parseFloat(marginLeft);
    const marginRightNum = parseFloat(marginRight);
    const startPageNum = parseInt(pageNumberingStartPage);

    if (
      isNaN(fontSizeNum) ||
      fontSizeNum <= 0 ||
      isNaN(lineSpacingNum) ||
      lineSpacingNum <= 0 ||
      isNaN(marginTopNum) ||
      marginTopNum < 0 ||
      isNaN(marginBottomNum) ||
      marginBottomNum < 0 ||
      isNaN(marginLeftNum) ||
      marginLeftNum < 0 ||
      isNaN(marginRightNum) ||
      marginRightNum < 0 ||
      isNaN(startPageNum) ||
      startPageNum < 1
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter valid numeric values for all fields.",
      });
      return;
    }

    const params: TemplateParams = {
      font_size: fontSizeNum,
      line_spacing: lineSpacingNum,
      margins: {
        top: marginTopNum,
        bottom: marginBottomNum,
        left: marginLeftNum,
        right: marginRightNum,
      },
      page_numbering: {
        enabled: pageNumberingEnabled,
        start_page: startPageNum,
      },
      skip_first_page: skipFirstPage,
    };

    try {
      setIsSubmitting(true);
      let result: Template;

      if (template) {
        // Update existing template
        result = await templateService.updateTemplate(template.id, {
          name: name.trim(),
          description: description.trim(),
          font_id: fontId ? parseInt(fontId) : null,
          params,
        });
        toast({
          title: "Template updated",
          description: "Template has been updated successfully.",
        });
      } else {
        // Create new template
        const data: TemplateCreate = {
          name: name.trim(),
          description: description.trim(),
          font_id: fontId ? parseInt(fontId) : null,
          params,
        };
        result = await templateService.createTemplate(data);
        toast({
          title: "Template created",
          description: "Template has been created successfully.",
        });
      }

      onSuccess(result);
      onOpenChange(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: template
          ? "Failed to update template"
          : "Failed to create template",
        description:
          err.response?.data?.detail ||
          "An error occurred while saving the template.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            {template
              ? "Update the template configuration below."
              : "Configure the formatting parameters for the new template."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Basic Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., ДСТУ Standard Template"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the template"
                required
              />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Типографія</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fontId">Шрифт *</Label>
                <SearchCombobox
                  value={fontId}
                  onValueChange={(value, label) => {
                    setFontId(value);
                    setSelectedFontLabel(label);
                  }}
                  onSearch={handleFontSearch}
                  placeholder="Select a font"
                  searchPlaceholder="Search fonts..."
                  emptyText="No fonts found."
                  selectedLabel={selectedFontLabel}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize">Розмір шрифту (pt) *</Label>
                <Input
                  id="fontSize"
                  type="number"
                  step="0.5"
                  min="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lineSpacing">Міжрядковий інтервал *</Label>
              <Input
                id="lineSpacing"
                type="number"
                step="0.1"
                min="0.1"
                value={lineSpacing}
                onChange={(e) => setLineSpacing(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Page Margins */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Відступи сторінок (мм)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marginTop">Зверху *</Label>
                <Input
                  id="marginTop"
                  type="number"
                  step="0.5"
                  min="0"
                  value={marginTop}
                  onChange={(e) => setMarginTop(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginBottom">Знизу *</Label>
                <Input
                  id="marginBottom"
                  type="number"
                  step="0.5"
                  min="0"
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginLeft">Зліва *</Label>
                <Input
                  id="marginLeft"
                  type="number"
                  step="0.5"
                  min="0"
                  value={marginLeft}
                  onChange={(e) => setMarginLeft(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginRight">Справа *</Label>
                <Input
                  id="marginRight"
                  type="number"
                  step="0.5"
                  min="0"
                  value={marginRight}
                  onChange={(e) => setMarginRight(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Page Numbering */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Нумерація сторінок
            </h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="pageNumberingEnabled"
                checked={pageNumberingEnabled}
                onCheckedChange={setPageNumberingEnabled}
              />
              <Label htmlFor="pageNumberingEnabled">
                Включити нумерацію сторінок
              </Label>
            </div>
            {pageNumberingEnabled && (
              <div className="space-y-2">
                <Label htmlFor="pageNumberingStartPage">
                  Почати нумерацію зі сторінки *
                </Label>
                <Input
                  id="pageNumberingStartPage"
                  type="number"
                  min="1"
                  value={pageNumberingStartPage}
                  onChange={(e) => setPageNumberingStartPage(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Global Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Глобальні налаштування
            </h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="skipFirstPage"
                checked={skipFirstPage}
                onCheckedChange={setSkipFirstPage}
              />
              <Label htmlFor="skipFirstPage">
                Пропускати першу сторінку для всіх перевірок
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {template ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
