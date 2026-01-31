"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { documentService } from "@/services/DocumentService";
import { useGooglePicker, type GoogleDocument } from "@/hooks/useGooglePicker";
import { useDocumentWorkflow } from "@/hooks/useDocumentWorkflow";
import { useTemplateSettings } from "@/hooks/useTemplateSettings";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { WorkspaceArea } from "@/components/workspace/WorkspaceArea";
import type { Document } from "@/types/document";
import Link from "next/link";

export default function AppWorkspace() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshGoogleToken } = useAuth();
  const { isLoaded: isPickerLoaded, openPicker } = useGooglePicker();

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

  // Redirect if not authenticated - REMOVED to allow anonymous access
  // Anonymous users can only use upload mode with 10 free checks per day
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isLoading, isAuthenticated, router]);

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

  const handleSelectDocument = async () => {
    if (!isPickerLoaded) {
      setLogs(["Error: Google Picker is not loaded yet. Please try again."]);
      return;
    }

    const googleToken = user?.google_access_token;
    if (!googleToken) {
      setLogs(["Error: No Google access token found. Please log in again."]);
      console.error("User is authenticated but has no Google access token");
      return;
    }

    await openPicker(
      googleToken,
      async (doc: GoogleDocument) => {
        setGoogleDocId(doc.id);
        setSelectedDocName(doc.name);
        setLogs([`> Selected document: ${doc.name}`]);

        // Check if this document already exists in the database
        try {
          const existingDoc = await documentService.getDocumentByGoogleId(
            doc.id,
          );
          if (existingDoc) {
            setCurrentDocument(existingDoc);
            setLogs((prev) => [
              ...prev,
              `> Document found in database, loading...`,
            ]);
          } else {
            setLogs((prev) => [
              ...prev,
              `> New document - will be created when you click Check`,
            ]);
          }
        } catch (error) {
          console.error("Failed to check for existing document:", error);
          setLogs((prev) => [...prev, `> Could not check document status`]);
        }
      },
      () => {
        setLogs(["Document selection cancelled"]);
      },
      async () => {
        // Token expired - refresh it
        setLogs((prev) => [...prev, "> Google token expired, refreshing..."]);
        try {
          const newToken = await refreshGoogleToken();
          setLogs((prev) => [...prev, "> Token refreshed, please try again"]);
          return newToken;
        } catch (error) {
          setLogs((prev) => [
            ...prev,
            "> Failed to refresh token. Please log in again.",
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
    setLogs([`> Selected file: ${file.name}`]);
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
  };

  const handleCheck = async () => {
    // Handle file upload mode
    if (documentMode === "upload") {
      if (!selectedFile) {
        setLogs(["Error: No file selected"]);
        return;
      }

      setStatus("checking");
      setLogs(["> Checking uploaded file..."]);

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
          setLogs((prev) => [...prev, "> Error: No template selected"]);
          setStatus("idle");
          return;
        }

        setLogs((prev) => [
          ...prev,
          `> Check complete! Score: ${((result.overall_score ?? 0) * 100).toFixed(1)}%`,
          `> Found ${result.issues_count || 0} issue(s)`,
          ...(result.remaining_anonymous_checks !== undefined
            ? [
                `> Remaining free checks today: ${result.remaining_anonymous_checks}`,
              ]
            : []),
        ]);

        // Store the check result so it can be displayed in WorkspaceArea
        setCheckResult(result);
        setStatus("checked");
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 429) {
          setLogs((prev) => [
            ...prev,
            "> Error: Daily limit reached",
            "> You've used all 10 free checks for today.",
            "> Please log in for unlimited checks!",
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            `> Error: ${error.message || "Failed to check file"}`,
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
        setLogs(["Error: No file selected"]);
        return;
      }

      setLogs((prev) => [...prev, "> Formatting uploaded file..."]);

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
          setLogs((prev) => [...prev, "> Error: No template selected"]);
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

        setLogs((prev) => [...prev, `> Format complete! File downloaded.`]);
      } catch (error: any) {
        setLogs((prev) => [
          ...prev,
          `> Error: ${error.message || "Failed to format file"}`,
        ]);
      }
      return;
    }

    // Handle Google Docs mode (existing logic)
    if (!currentDocument) {
      setLogs([
        "Error: No document to format. Please check the document first.",
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Anonymous user banner */}
      {!isAuthenticated && !isLoading && (
        <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-sm py-2 px-4 text-center z-50">
          You're using FormatStand as a guest. Free users get 10 document checks
          per day.{" "}
          <Link href="/login" className="underline font-semibold">
            Login
          </Link>{" "}
          for unlimited checks!
        </div>
      )}

      <div className={`flex flex-1 ${!isAuthenticated ? "mt-10" : ""}`}>
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
        />

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
        />
      </div>
    </div>
  );
}
