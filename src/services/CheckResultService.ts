import { httpClient } from "./HttpClient";
import type { CheckResult } from "@/types/document";

class CheckResultService {
  /**
   * Get check results for a document
   */
  async getDocumentCheckResults(documentId: number): Promise<CheckResult[]> {
    return httpClient.get<CheckResult[]>(
      `/v1/check-results/document/${documentId}`
    );
  }

  /**
   * Get a specific check result by ID
   */
  async getCheckResult(checkResultId: number): Promise<CheckResult> {
    return httpClient.get<CheckResult>(`/v1/check-results/${checkResultId}`);
  }
}

export const checkResultService = new CheckResultService();
