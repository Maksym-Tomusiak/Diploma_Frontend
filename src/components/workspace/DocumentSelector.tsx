"use client";

import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Template } from "@/types/document";

interface DocumentSelectorProps {
  googleDocId: string;
  selectedDocName: string;
  selectedTemplate: number | null;
  isCustomMode: boolean;
  templates: Template[];
  loadingTemplates: boolean;
  onSelectDocument: () => void;
  onClearDocument: () => void;
  onTemplateChange: (templateId: string) => void;
}

export function DocumentSelector({
  googleDocId,
  selectedDocName,
  selectedTemplate,
  isCustomMode,
  templates,
  loadingTemplates,
  onSelectDocument,
  onClearDocument,
  onTemplateChange,
}: DocumentSelectorProps) {
  if (!googleDocId) {
    return (
      <div
        onClick={onSelectDocument}
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
      >
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
          <Upload className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
        </div>
        <span className="text-sm font-medium text-slate-700">
          Select from Google Drive
        </span>
        <span className="text-xs text-slate-500 mt-1">
          Choose a Google Document
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Selected Document Display */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-slate-600 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">
              {selectedDocName || "Selected Document"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-700"
            onClick={onClearDocument}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Template Selection */}
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

      {/* Change Document Button */}
      <Button
        variant="outline"
        onClick={onSelectDocument}
        className="w-full border-slate-200 text-slate-700"
      >
        Change Document
      </Button>
    </div>
  );
}
