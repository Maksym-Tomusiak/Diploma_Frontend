"use client";

import {
  Check,
  Play,
  RotateCw,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckResult, Document } from "@/types/document";
import type { WorkflowStatus } from "@/types/workspace";

interface WorkspaceAreaProps {
  currentDocument: Document | null;
  status: WorkflowStatus;
  logs: string[];
  checkResult: CheckResult | null;
  googleDocId: string;
  selectedTemplate: number | null;
  isCustomMode: boolean;
  onCheck: () => Promise<void>;
  onFormat: () => Promise<void>;
}

export function WorkspaceArea({
  currentDocument,
  status,
  logs,
  checkResult,
  googleDocId,
  selectedTemplate,
  isCustomMode,
  onCheck,
  onFormat,
}: WorkspaceAreaProps) {
  return (
    <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <h2 className="text-lg font-semibold text-slate-800">
          {currentDocument ? "Workspace" : "Getting Started"}
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
            disabled={
              !googleDocId ||
              (!selectedTemplate && !isCustomMode) ||
              status === "checking" ||
              status === "formatting"
            }
            onClick={onCheck}
          >
            {status === "checking" ? (
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Check
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            disabled={status !== "checked"}
            onClick={onFormat}
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            Apply Format
          </Button>
        </div>
      </header>

      {/* Workspace Area */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
          {/* Empty State */}
          {!currentDocument && status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No document selected
              </h3>
              <p className="text-slate-500 max-w-sm">
                Please provide a Google Doc ID and select a template from the
                sidebar to begin formatting.
              </p>
            </div>
          )}

          {/* Progress Logs */}
          {(status === "checking" ||
            status === "formatting" ||
            logs.length > 0) && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 mb-3 text-sm"
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

              {/* Check Results */}
              {checkResult && status === "checked" && (
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                  <Card className="max-w-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Check Results
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
                          {checkResult.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Overall Score:</span>
                          <span className="font-semibold text-slate-900">
                            {checkResult.overall_score
                              ? (checkResult.overall_score * 100).toFixed(0)
                              : "N/A"}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Issues Found:</span>
                          <span className="font-semibold text-slate-900">
                            {checkResult.issues_count}
                          </span>
                        </div>
                        {checkResult.issues &&
                          checkResult.issues.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="text-sm font-semibold text-slate-900">
                                Issues:
                              </h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {checkResult.issues.map((issue, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-white border border-slate-200 rounded text-sm"
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <span className="font-medium text-slate-900">
                                        {issue.type.replace(/_/g, " ")}
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
                                        {issue.severity}
                                      </Badge>
                                    </div>
                                    <p className="text-slate-600">
                                      {issue.details}
                                    </p>
                                    {(issue.expected || issue.actual) && (
                                      <div className="mt-2 text-xs text-slate-500">
                                        {issue.expected && (
                                          <div>Expected: {issue.expected}</div>
                                        )}
                                        {issue.actual && (
                                          <div>Actual: {issue.actual}</div>
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
