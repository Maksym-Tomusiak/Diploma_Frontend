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

export default function AppWorkspace() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshGoogleToken } = useAuth();
  const { isLoaded: isPickerLoaded, openPicker } = useGooglePicker();

  // Document workflow
  const {
    currentDocument,
    setCurrentDocument,
    status,
    logs,
    setLogs,
    checkResult,
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

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
            doc.id
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
      }
    );
  };

  const handleClearDocument = () => {
    clearDocument();
    setGoogleDocId("");
    setSelectedDocName("");
  };

  const handleSelectRecentDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setGoogleDocId(doc.google_doc_id);
  };

  const handleCheck = async () => {
    // If no document is selected, create it first
    let docToCheck = currentDocument;
    if (!currentDocument) {
      const doc = await createDocument(
        googleDocId,
        selectedTemplate!,
        selectedDocName
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
        docToCheck ?? undefined
      );
    } else if (selectedTemplate) {
      await startCheck(
        {
          template_id: selectedTemplate,
        },
        docToCheck ?? undefined
      );
    }
  };

  const handleFormat = async () => {
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
      <WorkspaceSidebar
        googleDocId={googleDocId}
        selectedDocName={selectedDocName}
        currentDocument={currentDocument}
        documents={documents}
        loadingDocuments={loadingDocuments}
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
  );
}
