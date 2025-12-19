import { httpClient } from "./HttpClient";
import type { Template } from "@/types/document";

class TemplateService {
  /**
   * Get all active templates
   */
  async getTemplates(includeInactive: boolean = false): Promise<Template[]> {
    return httpClient.get<Template[]>(
      `/v1/templates?include_inactive=${includeInactive}`
    );
  }

  /**
   * Get a specific template by ID
   */
  async getTemplate(templateId: number): Promise<Template> {
    return httpClient.get<Template>(`/v1/templates/${templateId}`);
  }
}

export const templateService = new TemplateService();
