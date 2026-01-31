"use client";

import { CloudUpload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DocumentSelector } from "./DocumentSelector";
import { FileUploadSelector } from "./FileUploadSelector";
import type { Template } from "@/types/document";

type DocumentSourceMode = "google" | "upload";

interface DocumentSourceSelectorProps {
  // Auth state
  isAuthenticated: boolean;

  // Mode
  mode: DocumentSourceMode;
  onModeChange: (mode: DocumentSourceMode) => void;

  // Google Docs props
  googleDocId: string;
  selectedDocName: string;
  selectedTemplate: number | null;
  isCustomMode: boolean;
  templates: Template[];
  loadingTemplates: boolean;
  onSelectDocument: () => void;
  onClearDocument: () => void;
  onTemplateChange: (templateId: string) => void;

  // File upload props
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
}

export function DocumentSourceSelector({
  isAuthenticated,
  mode,
  onModeChange,
  googleDocId,
  selectedDocName,
  selectedTemplate,
  isCustomMode,
  templates,
  loadingTemplates,
  onSelectDocument,
  onClearDocument,
  onTemplateChange,
  selectedFile,
  onFileSelect,
  onClearFile,
}: DocumentSourceSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Document Source
      </Label>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={mode === "google" ? "default" : "outline"}
          className="flex items-center gap-2"
          onClick={() => onModeChange("google")}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Login to use Google Docs integration" : ""}
        >
          <CloudUpload className="h-4 w-4" />
          <span className="hidden sm:inline">Google Docs</span>
          <span className="sm:hidden">Google</span>
        </Button>
        <Button
          variant={mode === "upload" ? "default" : "outline"}
          className="flex items-center gap-2"
          onClick={() => onModeChange("upload")}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Upload File</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {mode === "google" ? (
          <DocumentSelector
            googleDocId={googleDocId}
            selectedDocName={selectedDocName}
            selectedTemplate={selectedTemplate}
            isCustomMode={isCustomMode}
            templates={templates}
            loadingTemplates={loadingTemplates}
            onSelectDocument={onSelectDocument}
            onClearDocument={onClearDocument}
            onTemplateChange={onTemplateChange}
          />
        ) : (
          <FileUploadSelector
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            onClear={onClearFile}
          />
        )}
      </div>
    </div>
  );
}
