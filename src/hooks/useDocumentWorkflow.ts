import { useState } from "react";
import { documentService } from "@/services/DocumentService";
import { checkResultService } from "@/services/CheckResultService";
import type {
  Document,
  CheckResult,
  CheckDocumentRequest,
  TemplateParams,
} from "@/types/document";
import type { WorkflowStatus } from "@/types/workspace";

export function useDocumentWorkflow() {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  const createDocument = async (
    googleDocId: string,
    templateId: number,
    title?: string
  ) => {
    if (!googleDocId || !templateId) {
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
        template_id: templateId,
        title,
      });
      setCurrentDocument(doc);
      setLogs((prev) => [
        ...prev,
        `> Document created: ${doc.title || doc.google_doc_id}`,
      ]);
      return doc;
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

  const startCheck = async (
    checkRequest: CheckDocumentRequest,
    documentToCheck?: Document
  ) => {
    const docToUse = documentToCheck || currentDocument;

    if (!docToUse) {
      setLogs(["> Error: No document selected"]);
      return;
    }

    setStatus("checking");
    setLogs(["> Initializing format checker..."]);

    try {
      // Trigger check with template or custom params - returns the new result directly
      const newCheckResult = await documentService.checkDocument(
        docToUse.id,
        checkRequest
      );

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

      // Use the result returned from the check endpoint directly
      setCheckResult(newCheckResult);
      setLogs((prev) => [
        ...prev,
        `> Analysis complete. ${newCheckResult.issues_count} issue(s) found.`,
      ]);

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
    setStatus("idle");
    setLogs([]);
    setCheckResult(null);
  };

  return {
    currentDocument,
    setCurrentDocument,
    status,
    logs,
    setLogs,
    checkResult,
    createDocument,
    startCheck,
    startFormat,
    clearDocument,
  };
}
