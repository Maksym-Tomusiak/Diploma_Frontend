import { httpClient } from "./HttpClient";
import type {
  Template,
  TemplateCreate,
  TemplateUpdate,
} from "@/types/document";

class TemplateService {
  /**
   * Get all templates
   * @param includeInactive - Whether to include inactive templates (admin only)
   * @param skip - Number of records to skip
   * @param limit - Number of records to return
   */
  async getTemplates(
    includeInactive: boolean = false,
    skip: number = 0,
    limit: number = 10
  ): Promise<{
    templates: Template[];
    total: number;
    skip: number;
    limit: number;
  }> {
    return httpClient.get<{
      templates: Template[];
      total: number;
      skip: number;
      limit: number;
    }>(
      `/v1/templates?include_inactive=${includeInactive}&skip=${skip}&limit=${limit}`
    );
  }

  /**
   * Get a specific template by ID
   */
  async getTemplate(templateId: number): Promise<Template> {
    return httpClient.get<Template>(`/v1/templates/${templateId}`);
  }

  /**
   * Create a new template (admin only)
   */
  async createTemplate(data: TemplateCreate): Promise<Template> {
    return httpClient.post<Template>("/v1/templates", data);
  }

  /**
   * Update a template (admin only)
   */
  async updateTemplate(
    templateId: number,
    data: TemplateUpdate
  ): Promise<Template> {
    return httpClient.put<Template>(`/v1/templates/${templateId}`, data);
  }

  /**
   * Delete a template (admin only)
   */
  async deleteTemplate(templateId: number): Promise<Template> {
    return httpClient.delete<Template>(`/v1/templates/${templateId}`);
  }
}

export const templateService = new TemplateService();
