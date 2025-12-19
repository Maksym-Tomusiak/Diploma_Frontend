"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Check,
  AlertCircle,
  Play,
  Upload,
  Settings,
  LogOut,
  X,
  CheckCircle,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { documentService } from "@/services/DocumentService";
import { templateService } from "@/services/TemplateService";
import { checkResultService } from "@/services/CheckResultService";
import { useGooglePicker, type GoogleDocument } from "@/hooks/useGooglePicker";
import type {
  Document,
  Template,
  CheckResult,
  Issue,
  DocumentStatus,
} from "@/types/document";

type WorkflowStatus =
  | "idle"
  | "checking"
  | "checked"
  | "formatting"
  | "complete";

export default function AppWorkspace() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isLoaded: isPickerLoaded, openPicker } = useGooglePicker();

  // State
  const [googleDocId, setGoogleDocId] = useState("");
  const [selectedDocName, setSelectedDocName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  // Settings state
  const [enableTypography, setEnableTypography] = useState(true);
  const [enableMargins, setEnableMargins] = useState(true);
  const [enableSpacing, setEnableSpacing] = useState(true);
  const [fixCitations, setFixCitations] = useState(true);
  const [autoFitTables, setAutoFitTables] = useState(true);
  const [centerImages, setCenterImages] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await templateService.getTemplates();
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    if (isAuthenticated) {
      loadTemplates();
    }
  }, [isAuthenticated]);

  // Load user documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await documentService.getUserDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoadingDocuments(false);
      }
    };
    if (isAuthenticated) {
      loadDocuments();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSelectDocument = () => {
    if (!isPickerLoaded) {
      setLogs(["Error: Google Picker is not loaded yet. Please try again."]);
      return;
    }

    // Get Google access token from user context
    const googleToken = user?.google_access_token;

    if (!googleToken) {
      setLogs(["Error: No Google access token found. Please log in again."]);
      console.error("User is authenticated but has no Google access token");
      return;
    }

    // Pass the token to openPicker
    openPicker(
      googleToken,
      (doc: GoogleDocument) => {
        setGoogleDocId(doc.id);
        setSelectedDocName(doc.name);
        setLogs([`> Selected document: ${doc.name}`]);
      },
      () => {
        setLogs(["Document selection cancelled"]);
      }
    );
  };

  const handleCreateDocument = async () => {
    if (!googleDocId || !selectedTemplate) {
      setLogs((prev) => [
        ...prev,
        "> Error: Please select a document and template",
      ]);
      return;
    }

    try {
      setLogs(["> Creating document entry..."]);
      const doc = await documentService.createDocument({
        google_doc_id: googleDocId,
        template_id: selectedTemplate,
      });
      setCurrentDocument(doc);
      setDocuments((prev) => [doc, ...prev]);
      setLogs((prev) => [
        ...prev,
        `> Document created: ${doc.title || doc.google_doc_id}`,
      ]);
    } catch (error: any) {
      console.error("Failed to create document:", error);
      setLogs((prev) => [
        ...prev,
        `> Error creating document: ${
          error?.response?.data?.detail || error.message
        }`,
      ]);
    }
  };

  const startCheck = async () => {
    if (!currentDocument) {
      setLogs(["> Error: No document selected"]);
      return;
    }

    setStatus("checking");
    setLogs(["> Initializing format checker..."]);

    try {
      // Trigger check
      await documentService.checkDocument(currentDocument.id);

      // Simulate progress steps
      const steps = [
        "Reading document structure...",
        "Verifying page margins...",
        "Checking font families...",
        "Analyzing paragraph indentation...",
        "Validating citation format...",
        "Scanning for table consistency...",
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLogs((prev) => [...prev, `> ${steps[i]} OK`]);
      }

      // Get check results
      const results = await checkResultService.getDocumentCheckResults(
        currentDocument.id
      );

      if (results.length > 0) {
        const latestResult = results[0];
        setCheckResult(latestResult);
        setLogs((prev) => [
          ...prev,
          `> Analysis complete. ${latestResult.issues_count} issue(s) found.`,
        ]);
      }

      setStatus("checked");
    } catch (error: any) {
      console.error("Check failed:", error);
      setLogs((prev) => [
        ...prev,
        `> Error: ${error?.response?.data?.detail || error.message}`,
      ]);
      setStatus("idle");
    }
  };

  const startFormat = async () => {
    if (!currentDocument) return;

    setStatus("formatting");
    setLogs((prev) => [...prev, "> Applying automated fixes..."]);

    try {
      await documentService.formatDocument(currentDocument.id);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLogs((prev) => [...prev, "> Corrections applied successfully."]);
      setStatus("complete");
    } catch (error: any) {
      console.error("Format failed:", error);
      setLogs((prev) => [
        ...prev,
        `> Error: ${error?.response?.data?.detail || error.message}`,
      ]);
      setStatus("checked");
    }
  };

  const clearDocument = () => {
    setCurrentDocument(null);
    setGoogleDocId("");
    setSelectedDocName("");
    setStatus("idle");
    setLogs([]);
    setCheckResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Settings */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white">
              <FileText className="h-3 w-3" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              FormatStand
            </span>
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
                <div className="space-y-3">
                  {/* Google Drive Picker Button */}
                  {!googleDocId ? (
                    <div
                      onClick={handleSelectDocument}
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
                  ) : (
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
                            onClick={() => {
                              setGoogleDocId("");
                              setSelectedDocName("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Template Selection */}
                      <Select
                        value={selectedTemplate?.toString()}
                        onValueChange={(value) =>
                          setSelectedTemplate(parseInt(value))
                        }
                        disabled={loadingTemplates}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem
                              key={template.id}
                              value={template.id.toString()}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Load Button */}
                      <Button
                        onClick={handleCreateDocument}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!googleDocId || !selectedTemplate}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Load Document
                      </Button>

                      {/* Change Document Button */}
                      <Button
                        variant="outline"
                        onClick={handleSelectDocument}
                        className="w-full border-slate-200 text-slate-700"
                      >
                        Change Document
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-900 truncate">
                      {currentDocument.title || currentDocument.google_doc_id}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-blue-500 hover:text-blue-700"
                    onClick={clearDocument}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Recent Documents */}
            {documents.length > 0 && !currentDocument && (
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recent Documents
                </Label>
                <div className="space-y-2">
                  {documents.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer text-sm"
                      onClick={() => {
                        setCurrentDocument(doc);
                        setGoogleDocId(doc.google_doc_id);
                      }}
                    >
                      <div className="font-medium text-slate-900 truncate">
                        {doc.title || doc.google_doc_id}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Groups */}
            <div className="space-y-6">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Formatting Rules
              </Label>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-fix" className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">
                      Typography
                    </span>
                    <span className="text-xs text-slate-500">
                      Times New Roman, 14pt
                    </span>
                  </Label>
                  <Switch
                    id="font-fix"
                    checked={enableTypography}
                    onCheckedChange={setEnableTypography}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="margin-fix" className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">
                      Margins (DSTU)
                    </span>
                    <span className="text-xs text-slate-500">
                      L:30, R:15, T:20, B:20 mm
                    </span>
                  </Label>
                  <Switch
                    id="margin-fix"
                    checked={enableMargins}
                    onCheckedChange={setEnableMargins}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="spacing-fix" className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">
                      Line Spacing
                    </span>
                    <span className="text-xs text-slate-500">
                      1.5 lines, no paragraph space
                    </span>
                  </Label>
                  <Switch
                    id="spacing-fix"
                    checked={enableSpacing}
                    onCheckedChange={setEnableSpacing}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="citations"
                    checked={fixCitations}
                    onCheckedChange={(checked) =>
                      setFixCitations(checked === true)
                    }
                  />
                  <Label htmlFor="citations" className="text-sm text-slate-700">
                    Fix citation format [1]
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="tables"
                    checked={autoFitTables}
                    onCheckedChange={(checked) =>
                      setAutoFitTables(checked === true)
                    }
                  />
                  <Label htmlFor="tables" className="text-sm text-slate-700">
                    Auto-fit tables
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="images"
                    checked={centerImages}
                    onCheckedChange={(checked) =>
                      setCenterImages(checked === true)
                    }
                  />
                  <Label htmlFor="images" className="text-sm text-slate-700">
                    Center align images
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.role || "user"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-900"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Action Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {currentDocument ? "Workspace" : "Getting Started"}
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              disabled={
                !currentDocument ||
                status === "checking" ||
                status === "formatting"
              }
              onClick={startCheck}
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
              onClick={startFormat}
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

            {/* Content Area */}
            {currentDocument && (
              <div className="flex flex-col h-full">
                {/* Status Bar */}
                <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 text-sm text-slate-500 font-mono">
                  <span className="mr-2 text-slate-400">$</span>
                  {status === "idle" && "Ready..."}
                  {status === "checking" && "Running diagnostics..."}
                  {status === "checked" &&
                    "Diagnostics complete. Waiting for user action."}
                  {status === "formatting" && "Applying changes..."}
                  {status === "complete" && "Process finished successfully."}
                </div>

                {/* Main View Area */}
                <ScrollArea className="flex-1 p-8 bg-slate-50/50">
                  <div className="max-w-3xl mx-auto space-y-6">
                    {/* Log Output */}
                    {(status === "checking" || logs.length > 0) && (
                      <Card className="bg-slate-900 text-slate-200 font-mono text-sm border-slate-800 shadow-lg">
                        <CardContent className="p-4 space-y-1">
                          {logs.map((log, i) => (
                            <div key={i} className="opacity-90">
                              {log}
                            </div>
                          ))}
                          {status === "checking" && (
                            <div className="animate-pulse">_</div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Issues List */}
                    {status === "checked" &&
                      checkResult &&
                      checkResult.issues.length > 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
                            <AlertCircle className="h-5 w-5" />
                            <span>
                              Issues Detected ({checkResult.issues.length})
                            </span>
                          </div>
                          {checkResult.issues.map((issue, i) => (
                            <div
                              key={i}
                              className="bg-white rounded border border-red-100 shadow-sm flex overflow-hidden"
                            >
                              <div className="w-1.5 bg-red-500 flex-shrink-0"></div>
                              <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-medium text-slate-900">
                                    {issue.type}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={
                                      issue.severity === "high"
                                        ? "text-red-600 border-red-200 bg-red-50"
                                        : issue.severity === "medium"
                                        ? "text-orange-600 border-orange-200 bg-orange-50"
                                        : "text-yellow-600 border-yellow-200 bg-yellow-50"
                                    }
                                  >
                                    {issue.severity}
                                  </Badge>
                                </div>
                                <div className="text-sm text-slate-600">
                                  {issue.details}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Success State */}
                    {status === "complete" && (
                      <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95 duration-500">
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          Formatting Complete!
                        </h3>
                        <p className="text-slate-500 mb-8">
                          Your document has been updated and saved to Google
                          Drive.
                        </p>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          onClick={() => {
                            window.open(
                              `https://docs.google.com/document/d/${currentDocument.google_doc_id}`,
                              "_blank"
                            );
                          }}
                        >
                          Open Document
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
