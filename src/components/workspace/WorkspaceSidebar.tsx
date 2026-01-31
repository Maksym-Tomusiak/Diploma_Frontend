"use client";

import { FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentSourceSelector } from "./DocumentSourceSelector";
import { RecentDocuments } from "./RecentDocuments";
import { TemplateParamsEditor } from "./TemplateParamsEditor";
import type {
  Document,
  Template,
  TemplateParams,
  PageMargins,
} from "@/types/document";

type DocumentSourceMode = "google" | "upload";

interface WorkspaceSidebarProps {
  // Auth state
  isAuthenticated: boolean;

  // Document mode
  documentMode: DocumentSourceMode;
  onDocumentModeChange: (mode: DocumentSourceMode) => void;

  // Document state
  googleDocId: string;
  selectedDocName: string;
  currentDocument: Document | null;
  documents: Document[];
  loadingDocuments: boolean;

  // File upload state
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;

  // Template state
  selectedTemplate: number | null;
  templates: Template[];
  loadingTemplates: boolean;
  isCustomMode: boolean;
  templateParams: TemplateParams;
  selectedFontFamily: string | null;

  // Event handlers
  onSelectDocument: () => void;
  onClearDocument: () => void;
  onSelectRecentDocument: (doc: Document) => void;
  onTemplateChange: (templateId: string) => void;
  onParamChange: (key: string, value: any) => void;
  onMarginChange: (side: keyof PageMargins, value: number) => void;
  onPageNumberingChange: (
    key: "check_numbering" | "start_from_number" | "skip_first_page",
    value: any,
  ) => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSearch: (query: string) => Promise<{ value: string; label: string }[]>;
  onNavigateHome: () => void;
}

export function WorkspaceSidebar({
  isAuthenticated,
  documentMode,
  onDocumentModeChange,
  googleDocId,
  selectedDocName,
  currentDocument,
  documents,
  selectedFile,
  onFileSelect,
  onClearFile,
  selectedTemplate,
  templates,
  loadingTemplates,
  isCustomMode,
  templateParams,
  selectedFontFamily,
  onSelectDocument,
  onClearDocument,
  onSelectRecentDocument,
  onTemplateChange,
  onParamChange,
  onMarginChange,
  onPageNumberingChange,
  onFontFamilyChange,
  onFontSearch,
  onNavigateHome,
}: WorkspaceSidebarProps) {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onNavigateHome}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white">
            <FileText className="h-3 w-3" />
          </div>
          <span className="text-lg font-bold text-slate-900">FormatStand</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Document Selection */}
          {!currentDocument && !selectedFile && (
            <DocumentSourceSelector
              isAuthenticated={isAuthenticated}
              mode={documentMode}
              onModeChange={onDocumentModeChange}
              googleDocId={googleDocId}
              selectedDocName={selectedDocName}
              selectedTemplate={selectedTemplate}
              isCustomMode={isCustomMode}
              templates={templates}
              loadingTemplates={loadingTemplates}
              onSelectDocument={onSelectDocument}
              onClearDocument={onClearDocument}
              onTemplateChange={onTemplateChange}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onClearFile={onClearFile}
            />
          )}

          {/* Selected Document Display */}
          {currentDocument && (
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Document
              </Label>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-900 truncate">
                    {currentDocument.title || currentDocument.google_doc_id}
                  </span>
                </div>
                <button
                  className="h-6 w-6 text-blue-500 hover:text-blue-700"
                  onClick={onClearDocument}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Selected File Display */}
          {selectedFile && (
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selected File
              </Label>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-sm font-medium text-blue-900 truncate block">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-blue-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  className="h-6 w-6 text-blue-500 hover:text-blue-700"
                  onClick={onClearFile}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Recent Documents */}
          {documents.length > 0 &&
            !currentDocument &&
            !selectedFile &&
            documentMode === "google" && (
              <RecentDocuments
                documents={documents}
                onSelectDocument={onSelectRecentDocument}
              />
            )}

          {/* Template Parameters Editor */}
          <TemplateParamsEditor
            templateParams={templateParams}
            selectedFontFamily={selectedFontFamily}
            isCustomMode={isCustomMode}
            selectedTemplate={selectedTemplate}
            templates={templates}
            loadingTemplates={loadingTemplates}
            onParamChange={onParamChange}
            onMarginChange={onMarginChange}
            onPageNumberingChange={onPageNumberingChange}
            onFontFamilyChange={onFontFamilyChange}
            onFontSearch={onFontSearch}
            onTemplateChange={onTemplateChange}
          />
        </div>
      </ScrollArea>
    </aside>
  );
}
