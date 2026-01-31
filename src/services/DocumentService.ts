import { httpClient } from "./HttpClient";
import type {
  Document,
  DocumentCreate,
  CheckDocumentRequest,
  CheckResult,
  UploadCheckResult,
  FormatDocumentRequest,
  FormatResult,
} from "@/types/document";

class DocumentService {
  /**
   * Get all documents for the current user
   */
  async getUserDocuments(): Promise<Document[]> {
    return httpClient.get<Document[]>("/v1/documents");
  }

  /**
   * Get a specific document by ID
   */
  async getDocument(documentId: string): Promise<Document> {
    return httpClient.get<Document>(`/v1/documents/${documentId}`);
  }

  /**
   * Get a document by Google Doc ID
   */
  async getDocumentByGoogleId(googleDocId: string): Promise<Document | null> {
    try {
      return await httpClient.get<Document>(
        `/v1/documents/by-google-id/${googleDocId}`,
      );
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new document
   */
  async createDocument(data: DocumentCreate): Promise<Document> {
    return httpClient.post<Document>("/v1/documents", data);
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    return httpClient.delete(`/v1/documents/${documentId}`);
  }

  /**
   * Trigger format check for a document
   */
  async checkDocument(
    documentId: string,
    data: CheckDocumentRequest,
  ): Promise<CheckResult> {
    return httpClient.post<CheckResult>(
      `/v1/documents/${documentId}/check`,
      data,
    );
  }

  /**
   * Apply formatting to a document
   */
  async formatDocument(
    documentId: string,
    data: FormatDocumentRequest,
  ): Promise<FormatResult> {
    return httpClient.post<FormatResult>(
      `/v1/documents/${documentId}/format`,
      data,
    );
  }

  /**
   * Check an uploaded file's formatting
   */
  async checkUploadedFile(
    file: File,
    templateId?: number,
    customParams?: any,
    fontFamily?: string,
  ): Promise<UploadCheckResult> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    if (templateId) {
      formData.append("template_id", templateId.toString());
    }

    if (customParams) {
      formData.append("custom_params", JSON.stringify(customParams));
    }

    if (fontFamily) {
      formData.append("font_family", fontFamily);
    }

    return httpClient.post<UploadCheckResult>(
      "/v1/documents/upload/check",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  /**
   * Format an uploaded file and download the result
   */
  async formatUploadedFile(
    file: File,
    templateId?: number,
    customParams?: any,
    fontFamily?: string,
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    if (templateId) {
      formData.append("template_id", templateId.toString());
    }

    if (customParams) {
      formData.append("custom_params", JSON.stringify(customParams));
    }

    if (fontFamily) {
      formData.append("font_family", fontFamily);
    }

    return httpClient.post<Blob>("/v1/documents/upload/format", formData, {
      responseType: "blob",
    });
  }
}

export const documentService = new DocumentService();
