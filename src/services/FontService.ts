import { httpClient } from "./HttpClient";
import type { Font } from "@/types/document";

interface FontListResponse {
  fonts: Font[];
  total: number;
  skip: number;
  limit: number;
}

interface FontSeedResponse {
  success: boolean;
  message: string;
  fonts_added: number;
}

class FontService {
  /**
   * Get all fonts
   */
  async getFonts(
    skip: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<FontListResponse> {
    let url = `/v1/fonts/?skip=${skip}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return httpClient.get<FontListResponse>(url);
  }

  /**
   * Get a specific font by ID
   */
  async getFont(fontId: number): Promise<Font> {
    return httpClient.get<Font>(`/v1/fonts/${fontId}`);
  }

  /**
   * Get font by family name
   */
  async getFontByFamily(family: string): Promise<Font> {
    return httpClient.get<Font>(
      `/v1/fonts/by-family/${encodeURIComponent(family)}`
    );
  }

  /**
   * Manually seed fonts from Google Web Fonts API (admin only)
   * Uses API key from backend environment variables
   */
  async seedFonts(): Promise<FontSeedResponse> {
    return httpClient.post<FontSeedResponse>("/v1/fonts/seed", {});
  }

  /**
   * Create a new font manually (admin only)
   */
  async createFont(data: {
    family: string;
    category?: string;
    variants?: string;
    subsets?: string;
    version?: string;
  }): Promise<Font> {
    return httpClient.post<Font>("/v1/fonts/", data);
  }

  /**
   * Delete a font (admin only)
   */
  async deleteFont(fontId: number): Promise<{ success: boolean; message: string }> {
    return httpClient.delete(`/v1/fonts/${fontId}`);
  }
}

export const fontService = new FontService();
