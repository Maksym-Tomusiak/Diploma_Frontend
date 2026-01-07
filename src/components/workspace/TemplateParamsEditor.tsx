"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchCombobox } from "@/components/ui/search-combobox";
import type { TemplateParams, PageMargins, Template } from "@/types/document";

interface TemplateParamsEditorProps {
  templateParams: TemplateParams;
  selectedFontFamily: string | null;
  isCustomMode: boolean;
  selectedTemplate: number | null;
  templates: Template[];
  loadingTemplates: boolean;
  onParamChange: (key: string, value: any) => void;
  onMarginChange: (side: keyof PageMargins, value: number) => void;
  onPageNumberingChange: (
    key: "check_numbering" | "start_from_number" | "skip_first_page",
    value: any
  ) => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSearch: (query: string) => Promise<{ value: string; label: string }[]>;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateParamsEditor({
  templateParams,
  selectedFontFamily,
  isCustomMode,
  selectedTemplate,
  templates,
  loadingTemplates,
  onParamChange,
  onMarginChange,
  onPageNumberingChange,
  onFontFamilyChange,
  onFontSearch,
  onTemplateChange,
}: TemplateParamsEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Template Settings
        </Label>
        {isCustomMode && (
          <Badge
            variant="outline"
            className="text-xs text-orange-600 border-orange-300 bg-orange-50"
          >
            Custom
          </Badge>
        )}
      </div>

      {/* Template Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-600">
          Base Template
        </Label>
        <Select
          value={isCustomMode ? "custom" : selectedTemplate?.toString()}
          onValueChange={(value) => {
            if (value !== "custom") {
              onTemplateChange(value);
            }
          }}
          disabled={loadingTemplates}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            {isCustomMode && (
              <SelectItem value="custom">Custom Settings</SelectItem>
            )}
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id.toString()}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Settings */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-slate-600">Font</Label>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Family</Label>
            <SearchCombobox
              value={selectedFontFamily || ""}
              onValueChange={(value) => onFontFamilyChange(value)}
              onSearch={onFontSearch}
              placeholder="Select a font"
              searchPlaceholder="Search fonts..."
              emptyText="No fonts found."
              selectedLabel={selectedFontFamily || ""}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <Label htmlFor="font-size" className="text-slate-600">
                Size (pt)
              </Label>
              <span className="font-mono text-slate-900">
                {templateParams.font_size}
              </span>
            </div>
            <Input
              id="font-size"
              type="number"
              min="8"
              max="24"
              step="0.5"
              value={templateParams.font_size}
              onChange={(e) =>
                onParamChange("font_size", parseFloat(e.target.value))
              }
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <Label htmlFor="line-spacing" className="text-slate-600">
                Line Spacing
              </Label>
              <span className="font-mono text-slate-900">
                {templateParams.line_spacing}
              </span>
            </div>
            <Input
              id="line-spacing"
              type="number"
              min="1"
              max="3"
              step="0.1"
              value={templateParams.line_spacing}
              onChange={(e) =>
                onParamChange("line_spacing", parseFloat(e.target.value))
              }
              className="h-8"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Margins */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-slate-600">
          Margins (mm)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {(["top", "bottom", "left", "right"] as const).map((side) => (
            <div key={side} className="space-y-1">
              <Label
                htmlFor={`margin-${side}`}
                className="text-xs text-slate-600"
              >
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </Label>
              <Input
                id={`margin-${side}`}
                type="number"
                min="0"
                max="50"
                value={templateParams.margins[side]}
                onChange={(e) =>
                  onMarginChange(side, parseFloat(e.target.value))
                }
                className="h-8"
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Page Numbering */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-slate-600">
          Page Numbering
        </Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="page-numbering" className="text-sm text-slate-700">
              Check page numbers
            </Label>
            <Checkbox
              id="page-numbering"
              checked={templateParams.check_numbering}
              onCheckedChange={(checked) =>
                onPageNumberingChange("check_numbering", checked === true)
              }
            />
          </div>
          {templateParams.check_numbering && (
            <div className="space-y-1">
              <Label htmlFor="start-number" className="text-xs text-slate-600">
                Start from number
              </Label>
              <Input
                id="start-number"
                type="number"
                min="1"
                value={templateParams.start_from_number}
                onChange={(e) =>
                  onPageNumberingChange(
                    "start_from_number",
                    parseInt(e.target.value)
                  )
                }
                className="h-8"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="skip-first" className="text-sm text-slate-700">
              Skip first page
            </Label>
            <Checkbox
              id="skip-first"
              checked={templateParams.skip_first_page}
              onCheckedChange={(checked) =>
                onPageNumberingChange("skip_first_page", checked === true)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
