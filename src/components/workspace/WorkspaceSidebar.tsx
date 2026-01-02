"use client";

import { FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentSelector } from "./DocumentSelector";
import { RecentDocuments } from "./RecentDocuments";
import { TemplateParamsEditor } from "./TemplateParamsEditor";
import type {
  Document,
  Template,
  TemplateParams,
  PageMargins,
  PageNumbering,
} from "@/types/document";

interface WorkspaceSidebarProps {
  // Document state
  googleDocId: string;
  selectedDocName: string;
  currentDocument: Document | null;
  documents: Document[];
  loadingDocuments: boolean;

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
  onPageNumberingChange: (key: keyof PageNumbering, value: any) => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSearch: (query: string) => Promise<{ value: string; label: string }[]>;
  onNavigateHome: () => void;
}

export function WorkspaceSidebar({
  googleDocId,
  selectedDocName,
  currentDocument,
  documents,
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
          <div className="space-y-4">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Document
            </Label>
            {!currentDocument ? (
              <DocumentSelector
                googleDocId={googleDocId}
                selectedDocName={selectedDocName}
                selectedTemplate={selectedTemplate}
                isCustomMode={isCustomMode}
                templates={templates}
                loadingTemplates={loadingTemplates}
                onSelectDocument={onSelectDocument}
                onClearDocument={() => {}}
                onTemplateChange={onTemplateChange}
              />
            ) : (
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
            )}
          </div>

          {/* Recent Documents */}
          {documents.length > 0 && !currentDocument && (
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
