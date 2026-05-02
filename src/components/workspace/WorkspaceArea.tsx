"use client";

import {
  Check,
  Play,
  RotateCw,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";
import { Info } from "lucide-react";
import { LimitationsModal } from "./LimitationsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  CheckResult,
  UploadCheckResult,
  Document,
  FormatResult,
} from "@/types/document";
import type { WorkflowStatus } from "@/types/workspace";

interface WorkspaceAreaProps {
  currentDocument: Document | null;
  selectedFile: File | null;
  documentMode: "google" | "upload";
  status: WorkflowStatus;
  logs: string[];
  checkResult: CheckResult | UploadCheckResult | null;
  formatResult: FormatResult | null;
  googleDocId: string;
  selectedTemplate: number | null;
  isCustomMode: boolean;
  onCheck: () => Promise<void>;
  onFormat: () => Promise<void>;
  onFileSelect: (file: File) => void;
}

const TYPE_TRANSLATIONS: Record<string, string> = {
  // Issue types
  margin_error: "Помилка полів",
  font_family_error: "Помилка шрифту",
  font_size_error: "Помилка розміру шрифту",
  line_spacing_error: "Помилка інтервалу",
  alignment_error: "Помилка вирівнювання",
  indentation_error: "Помилка відступу",
  heading_error: "Помилка заголовка",
  table_error: "Помилка таблиці",
  citation_error: "Помилка цитування",
  page_number_error: "Помилка нумерації",
  image_alignment_error: "Вирівнювання зображення",
  image_caption_missing: "Відсутній підпис",
  image_caption_format_error: "Формат підпису",
  image_caption_alignment_error: "Вирівнювання підпису",
  image_source_alignment_error: "Вирівнювання джерела",
  image_source_style_error: "Стиль джерела",
  image_source_missing: "Відсутнє джерело",
  image_source_format_error: "Формат джерела",

  // Change types
  margin_update: "Оновлення полів",
  font_update: "Оновлення шрифту",
  image_alignment: "Вирівнювання зображення",
  caption_alignment: "Вирівнювання підпису",
  caption_format_fix: "Формат номера підпису",
  source_alignment: "Вирівнювання джерела",
  source_style: "Стиль джерела",
  spacing_update: "Оновлення інтервалів",
  alignment_update: "Оновлення вирівнювання",
  indent_update: "Оновлення відступів",
  page_number_update: "Оновлення нумерації",
  style_application: "Застосування стилю",
};

const translateType = (type: string) => {
  return TYPE_TRANSLATIONS[type] || type.replace(/_/g, " ");
};

export function WorkspaceArea({
  currentDocument,
  selectedFile,
  documentMode,
  status,
  logs,
  checkResult,
  formatResult,
  googleDocId,
  selectedTemplate,
  isCustomMode,
  onCheck,
  onFormat,
  onFileSelect,
}: WorkspaceAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showLimitations, setShowLimitations] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        onFileSelect(file);
      }
    }
  };
  return (
    <main className="flex-1 flex flex-col bg-slate-50 overflow-y-auto lg:overflow-hidden">
      {/* Header */}
      <header className="h-auto py-4 lg:h-16 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            {(currentDocument || selectedFile || googleDocId) ? "Робоча область" : "Початок роботи"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => setShowLimitations(true)}
            aria-label="Переглянути обмеження"
          >
            <Info className="h-4 w-4" />
            <span className="hidden xs:inline">Обмеження</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0"
            disabled={
              (documentMode === "google" && !googleDocId) ||
              (documentMode === "upload" && !selectedFile) ||
              (!selectedTemplate && !isCustomMode) ||
              status === "checking" ||
              status === "formatting"
            }
            onClick={onCheck}
          >
            {status === "checking" ? (
              <RotateCw className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-1.5 h-4 w-4" />
            )}
            <span className="whitespace-nowrap">Перевірити</span>
          </Button>
          <Button
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0"
            disabled={
              status === "checking" ||
              status === "formatting" ||
              (documentMode === "google" && !googleDocId) ||
              (documentMode === "upload" && !selectedFile) ||
              (!selectedTemplate && !isCustomMode) ||
              (status !== "checked" && status !== "complete")
            }
            onClick={onFormat}
          >
            {status === "formatting" ? (
              <RotateCw className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-1.5 h-4 w-4 fill-current" />
            )}
            <span className="whitespace-nowrap">Форматувати</span>
          </Button>
        </div>
      </header>

      {/* Workspace Area */}
      <div
        className="flex-1 p-3 sm:p-8 overflow-visible lg:overflow-hidden flex flex-col"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            "flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-visible lg:overflow-hidden flex flex-col relative transition-all duration-200",
            isDragging &&
              "border-blue-500 bg-blue-50/30 ring-4 ring-blue-500/10",
          )}
        >
          {/* Empty State */}
          {!currentDocument && !selectedFile && !googleDocId && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div
                className={cn(
                  "h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
                  isDragging
                    ? "bg-blue-100 scale-110 shadow-lg shadow-blue-100"
                    : "bg-slate-50",
                )}
              >
                <FileText
                  className={cn(
                    "h-12 w-12 transition-colors",
                    isDragging ? "text-blue-600" : "text-slate-300",
                  )}
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {isDragging ? "Кидайте файл сюди!" : "Документ не обрано"}
              </h3>
              <p className="text-slate-500 max-w-sm text-lg">
                {isDragging
                  ? "Ми готові до обробки вашого .docx документа"
                  : "Оберіть Google Doc або перетягніть .docx файл прямо сюди"}
              </p>

              {!isDragging && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="h-px w-12 bg-slate-200"></div>
                    <span className="text-xs font-semibold uppercase tracking-widest">
                      Або
                    </span>
                    <div className="h-px w-12 bg-slate-200"></div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 border-slate-200 text-slate-600"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".docx";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) onFileSelect(file);
                      };
                      input.click();
                    }}
                  >
                    Обрати файл з комп'ютера
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Progress Logs */}
          {(currentDocument || selectedFile || googleDocId) &&
            (status === "checking" ||
              status === "formatting" ||
              logs.length > 0) && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden">
                {/* Left side - Logs */}
                <div className="h-auto lg:flex-1 lg:overflow-y-auto p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">
                    Журнал прогресу
                  </h3>
                  <div className="space-y-3">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        {log.startsWith(">") ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">
                              {log.slice(1).trim()}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600">{log}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side - Results */}
                <div className="h-auto lg:flex-1 p-4 sm:p-3 bg-slate-50 lg:overflow-hidden lg:flex lg:flex-col">
                  {/* Check Results */}
                  {checkResult && status === "checked" && (
                    <Card className="mb-6 lg:mb-0 lg:h-full lg:flex lg:flex-col overflow-hidden">
                      <CardContent className="p-6 lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Результати перевірки
                          </h3>
                          <Badge
                            variant={
                              checkResult.passed ? "default" : "destructive"
                            }
                            className={
                              checkResult.passed
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : ""
                            }
                          >
                            {checkResult.passed ? "Пройдено" : "Помилка"}
                          </Badge>
                        </div>
                          <div className="space-y-4 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
                          <div className="flex-shrink-0 space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Загальна оцінка:
                              </span>
                              <span className="font-semibold text-slate-900">
                                {checkResult.overall_score
                                  ? (checkResult.overall_score * 100).toFixed(0)
                                  : "N/A"}
                                %
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Знайдено зауважень:
                              </span>
                              <span className="font-semibold text-slate-900">
                                {checkResult.issues_count}
                              </span>
                            </div>
                          </div>
                          {checkResult.issues &&
                            checkResult.issues.length > 0 && (
                              <div className="mt-4 space-y-2 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
                                <h4 className="text-sm font-semibold text-slate-900">
                                  Зауваження:
                                </h4>
                                <div className="space-y-2 lg:flex-1 lg:overflow-y-auto pr-1">
                                  {checkResult.issues.map((issue, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-white border border-slate-200 rounded text-sm"
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <span className="font-medium text-slate-900">
                                          {translateType(issue.type)}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={
                                            issue.severity === "high"
                                              ? "border-red-300 text-red-700 bg-red-50"
                                              : issue.severity === "medium"
                                                ? "border-amber-300 text-amber-700 bg-amber-50"
                                                : "border-slate-300 text-slate-700 bg-slate-50"
                                          }
                                        >
                                          {issue.severity === "high"
                                            ? "висока"
                                            : issue.severity === "medium"
                                              ? "середня"
                                              : "низька"}
                                        </Badge>
                                      </div>
                                      <p className="text-slate-600">
                                        {issue.details}
                                      </p>
                                      {(issue.expected || issue.actual) && (
                                        <div className="mt-2 text-xs text-slate-500">
                                          {issue.expected && (
                                            <div>
                                              Очікувалося: {issue.expected}
                                            </div>
                                          )}
                                          {issue.actual && (
                                            <div>Фактично: {issue.actual}</div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Format Results */}
                  {formatResult && status === "complete" && (
                    <Card className="lg:h-full lg:flex lg:flex-col overflow-hidden">
                      <CardContent className="p-6 lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Результати форматування
                          </h3>
                          <Badge
                            variant={
                              formatResult.success ? "default" : "destructive"
                            }
                            className={
                              formatResult.success
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : ""
                            }
                          >
                            {formatResult.success ? "Успішно" : "Помилка"}
                          </Badge>
                        </div>
                        <div className="space-y-4 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
                          <div className="flex-shrink-0">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Застосувано змін:
                              </span>
                              <span className="font-semibold text-slate-900">
                                {formatResult.changes_applied}
                              </span>
                            </div>
                          </div>
                          {formatResult.changes &&
                            formatResult.changes.length > 0 && (
                              <div className="mt-4 space-y-2 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
                                <h4 className="text-sm font-semibold text-slate-900">
                                  Застосовані зміни:
                                </h4>
                                <div className="space-y-2 lg:flex-1 lg:overflow-y-auto pr-1">
                                  {formatResult.changes.map((change, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-white border border-slate-200 rounded text-sm"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <span className="font-medium text-slate-900">
                                          {translateType(change.type)}
                                        </span>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      </div>
                                      <p className="text-slate-600 mt-1">
                                        {change.description}
                                      </p>
                                      {(change.before || change.after) && (
                                        <div className="mt-2 text-xs text-slate-500 grid grid-cols-2 gap-2">
                                          {change.before && (
                                            <div>
                                              <span className="text-slate-400">
                                                До:
                                              </span>{" "}
                                              {change.before}
                                            </div>
                                          )}
                                          {change.after && (
                                            <div>
                                              <span className="text-slate-400">
                                                Після:
                                              </span>{" "}
                                              {change.after}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
      <LimitationsModal
        isOpen={showLimitations}
        onClose={() => setShowLimitations(false)}
      />
    </main>
  );
}
