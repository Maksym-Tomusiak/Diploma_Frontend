import { httpClient } from "./HttpClient";
import type {
  Document,
  DocumentCreate,
  CheckDocumentRequest,
  CheckResult,
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
  async getDocument(documentId: number): Promise<Document> {
    return httpClient.get<Document>(`/v1/documents/${documentId}`);
  }

  /**
   * Get a document by Google Doc ID
   */
  async getDocumentByGoogleId(googleDocId: string): Promise<Document | null> {
    try {
      return await httpClient.get<Document>(
        `/v1/documents/by-google-id/${googleDocId}`
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
  async deleteDocument(documentId: number): Promise<void> {
    return httpClient.delete(`/v1/documents/${documentId}`);
  }

  /**
   * Trigger format check for a document
   */
  async checkDocument(
    documentId: number,
    data: CheckDocumentRequest
  ): Promise<CheckResult> {
    return httpClient.post<CheckResult>(
      `/v1/documents/${documentId}/check`,
      data
    );
  }

  /**
   * Apply formatting to a document
   */
  async formatDocument(documentId: number): Promise<void> {
    return httpClient.post(`/v1/documents/${documentId}/format`);
  }
}

export const documentService = new DocumentService();
