"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { documentService } from "@/services/DocumentService";
import { authService } from "@/services/AuthService";
import { useGooglePicker, type GoogleDocument } from "@/hooks/useGooglePicker";
import { useDocumentWorkflow } from "@/hooks/useDocumentWorkflow";
import { useTemplateSettings } from "@/hooks/useTemplateSettings";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { WorkspaceArea } from "@/components/workspace/WorkspaceArea";
import { LimitReachedModal } from "@/components/workspace/LimitReachedModal";
import type { Document } from "@/types/document";
import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppWorkspace() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshGoogleToken } = useAuth();
  const { isLoaded: isPickerLoaded, openPicker } = useGooglePicker();
  const [isPickerOpening, setIsPickerOpening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Document source mode - anonymous users can only use upload mode
  const [documentMode, setDocumentMode] = useState<"google" | "upload">(
    "upload", // Default to upload for anonymous users
  );

  // Effect to reset to upload mode for anonymous users
  useEffect(() => {
    if (!isAuthenticated && documentMode === "google") {
      setDocumentMode("upload");
    }
  }, [isAuthenticated, documentMode]);

  // Document workflow
  const {
    currentDocument,
    setCurrentDocument,
    status,
    setStatus,
    logs,
    setLogs,
    checkResult,
    setCheckResult,
    formatResult,
    createDocument,
    startCheck,
    startFormat,
    clearDocument,
  } = useDocumentWorkflow();

  // Template settings
  const {
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
  } = useTemplateSettings(isAuthenticated);

  // State
  const [googleDocId, setGoogleDocId] = useState("");
  const [selectedDocName, setSelectedDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [remainingChecks, setRemainingChecks] = useState<number | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

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

  // Load remaining checks for anonymous users
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const count = await authService.getRemainingChecks();
        setRemainingChecks(count);
      } catch (error) {
        console.error("Failed to fetch remaining checks:", error);
      }
    };

    if (!isAuthenticated && !isLoading) {
      fetchRemaining();
    }
  }, [isAuthenticated, isLoading]);

  const handleSelectDocument = async () => {
    if (!isPickerLoaded || isPickerOpening) {
      if (!isPickerLoaded) {
        setLogs([
          "Помилка: Google Picker ще не завантажився. Спробуйте ще раз.",
        ]);
      }
      return;
    }

    setIsPickerOpening(true);
    setLogs((prev) => [...prev, "> Підготовка Google Picker..."]);

    const googleToken = user?.google_access_token;
    if (!googleToken) {
      setLogs([
        "Помилка: Токен доступу Google не знайдено. Будь ласка, увійдіть знову.",
      ]);
      console.error("User is authenticated but has no Google access token");
      return;
    }

    await openPicker(
      googleToken,
      async (doc: GoogleDocument) => {
        setIsPickerOpening(false);
        setGoogleDocId(doc.id);
        setSelectedDocName(doc.name);
        setLogs([`> Обрано документ: ${doc.name}`]);

        // Check if this document already exists in the database
        try {
          const existingDoc = await documentService.getDocumentByGoogleId(
            doc.id,
          );
          if (existingDoc) {
            setCurrentDocument(existingDoc);
            setLogs((prev) => [
              ...prev,
              `> Документ знайдено в базі даних, завантаження...`,
            ]);
          } else {
            setLogs((prev) => [
              ...prev,
              `> Новий документ - буде створено після натискання кнопки "Перевірити"`,
            ]);
          }
        } catch (error) {
          console.error("Failed to check for existing document:", error);
          setLogs((prev) => [
            ...prev,
            `> Не вдалося перевірити статус документа`,
          ]);
        }
      },
      () => {
        setIsPickerOpening(false);
        setLogs(["Вибір документа скасовано"]);
      },
      async () => {
        // Token expired - refresh it
        setLogs((prev) => [...prev, "> Токен Google застарів, оновлення..."]);
        try {
          const newToken = await refreshGoogleToken();
          setLogs((prev) => [...prev, "> Токен оновлено, спробуйте ще раз"]);
          return newToken;
        } catch (error) {
          setIsPickerOpening(false);
          setLogs((prev) => [
            ...prev,
            "> Не вдалося оновити токен. Будь ласка, увійдіть знову.",
          ]);
          throw error;
        }
      },
    );
  };

  const handleClearDocument = () => {
    clearDocument();
    setGoogleDocId("");
    setSelectedDocName("");
    setSelectedFile(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCheckResult(null); // Clear previous check results
    setStatus("idle"); // Reset status
    setLogs([`> Обрано файл: ${file.name}`]);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setCheckResult(null); // Clear check results
    setStatus("idle"); // Reset status
    setLogs([]);
  };

  const handleSelectRecentDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setGoogleDocId(doc.google_doc_id);
    setLogs([`> Обрано документ: ${doc.title}`]);
  };

  const handleCheck = async () => {
    // Handle file upload mode
    if (documentMode === "upload") {
      if (!selectedFile) {
        setLogs(["Помилка: Файл не обрано"]);
        return;
      }

      setStatus("checking");
      setLogs(["> Перевірка завантаженого файлу..."]);

      try {
        let result;
        if (isCustomMode) {
          result = await documentService.checkUploadedFile(
            selectedFile,
            undefined,
            templateParams,
            selectedFontFamily || undefined,
          );
        } else if (selectedTemplate) {
          result = await documentService.checkUploadedFile(
            selectedFile,
            selectedTemplate,
          );
        } else {
          setLogs((prev) => [...prev, "> Помилка: Шаблон не обрано"]);
          setStatus("idle");
          return;
        }

        setLogs((prev) => [
          ...prev,
          `> Перевірка завершена! Оцінка: ${((result.overall_score ?? 0) * 100).toFixed(1)}%`,
          `> Знайдено зауважень: ${result.issues_count || 0}`,
          ...(result.remaining_anonymous_checks !== undefined &&
          result.remaining_anonymous_checks !== null
            ? [
                `> Залишилося безкоштовних перевірок на сьогодні: ${result.remaining_anonymous_checks}`,
              ]
            : []),
        ]);

        // Store the check result so it can be displayed in WorkspaceArea
        setCheckResult(result);
        setStatus("checked");

        // Update remaining checks count
        if (result.remaining_anonymous_checks !== undefined) {
          setRemainingChecks(result.remaining_anonymous_checks);
        }
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 429) {
          setShowLimitModal(true);
          setLogs((prev) => [
            ...prev,
            "> Помилка: Денний ліміт вичерпано",
            "> Ви використали всі безкоштовні перевірки на сьогодні.",
            "> Будь ласка, увійдіть для необмеженої кількості перевірок!",
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            `> Помилка: ${error.message || "Не вдалося перевірити файл"}`,
          ]);
        }
        setStatus("idle");
      }
      return;
    }

    // Handle Google Docs mode (existing logic)
    // If no document is selected, create it first
    let docToCheck = currentDocument;
    if (!currentDocument) {
      const doc = await createDocument(
        googleDocId,
        selectedTemplate!,
        selectedDocName,
      );
      if (!doc) {
        return; // Creation failed, don't proceed
      }
      setDocuments((prev) => [doc, ...prev]);
      docToCheck = doc; // Use the newly created document
    }

    // Build check request based on mode
    if (isCustomMode) {
      await startCheck(
        {
          custom_params: templateParams,
          font_family: selectedFontFamily || undefined,
        },
        docToCheck ?? undefined,
      );
    } else if (selectedTemplate) {
      await startCheck(
        {
          template_id: selectedTemplate,
        },
        docToCheck ?? undefined,
      );
    }
  };

  const handleFormat = async () => {
    // Redirect anonymous users to login page
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/app");
      return;
    }

    // Handle file upload mode
    if (documentMode === "upload") {
      if (!selectedFile) {
        setLogs(["Помилка: Файл не обрано"]);
        return;
      }

      setStatus("formatting");
      setLogs((prev) => [...prev, "> Форматування завантаженого файлу..."]);

      try {
        let blob;
        if (isCustomMode) {
          blob = await documentService.formatUploadedFile(
            selectedFile,
            undefined,
            templateParams,
            selectedFontFamily || undefined,
          );
        } else if (selectedTemplate) {
          blob = await documentService.formatUploadedFile(
            selectedFile,
            selectedTemplate,
          );
        } else {
          setLogs((prev) => [...prev, "> Помилка: Шаблон не обрано"]);
          setStatus("idle");
          return;
        }

        // Download the formatted file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `formatted_${selectedFile.name}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setLogs((prev) => [
          ...prev,
          `> Форматування завершено! Файл завантажено.`,
        ]);
        setStatus("complete");
      } catch (error: any) {
        setLogs((prev) => [
          ...prev,
          `> Помилка: ${error.message || "Не вдалося відформатувати файл"}`,
        ]);
        setStatus("idle");
      }
      return;
    }

    // Handle Google Docs mode (existing logic)
    if (!currentDocument) {
      setLogs([
        "Помилка: Немає документа для форматування. Спочатку виконайте перевірку.",
      ]);
      return;
    }

    // Build format request based on mode
    if (isCustomMode) {
      await startFormat({
        custom_params: templateParams,
        font_family: selectedFontFamily || undefined,
      });
    } else if (selectedTemplate) {
      await startFormat({
        template_id: selectedTemplate,
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Anonymous user banner */}
      {!isAuthenticated && !isLoading && (
        <div className="bg-blue-600 text-white text-sm py-2 px-4 text-center z-50 shrink-0 w-full">
          Ви як гість маєте{" "}
          <span className="font-bold underline">
            {remainingChecks !== null ? remainingChecks : "..."}
          </span>{" "}
          безкоштовних перевірок сьогодні.{" "}
          <Link href="/login" className="underline font-semibold ml-1">
            Увійти
          </Link>{" "}
          для безліміту!
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-slate-200 z-30 shrink-0">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-slate-900">Norma</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        <div
          className={cn(
            "fixed inset-y-0 left-0 lg:relative lg:flex z-50 lg:z-20 transition-transform duration-300 transform w-80",
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          )}
        >
          <WorkspaceSidebar
            isAuthenticated={isAuthenticated}
            documentMode={documentMode}
            onDocumentModeChange={setDocumentMode}
            googleDocId={googleDocId}
            selectedDocName={selectedDocName}
            currentDocument={currentDocument}
            documents={documents}
            loadingDocuments={loadingDocuments}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
            selectedTemplate={selectedTemplate}
            templates={templates}
            loadingTemplates={loadingTemplates}
            isCustomMode={isCustomMode}
            templateParams={templateParams}
            selectedFontFamily={selectedFontFamily}
            onSelectDocument={handleSelectDocument}
            onClearDocument={handleClearDocument}
            onSelectRecentDocument={handleSelectRecentDocument}
            onTemplateChange={handleTemplateChange}
            onParamChange={handleParamChange}
            onMarginChange={handleMarginChange}
            onPageNumberingChange={handlePageNumberingChange}
            onFontFamilyChange={handleFontFamilyChange}
            onFontSearch={handleFontSearch}
            onNavigateHome={() => router.push("/")}
            isPickerOpening={isPickerOpening}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <WorkspaceArea
          currentDocument={currentDocument}
          selectedFile={selectedFile}
          documentMode={documentMode}
          status={status}
          logs={logs}
          checkResult={checkResult}
          formatResult={formatResult}
          googleDocId={googleDocId}
          selectedTemplate={selectedTemplate}
          isCustomMode={isCustomMode}
          onCheck={handleCheck}
          onFormat={handleFormat}
          onFileSelect={handleFileSelect}
        />
      </div>

      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}
