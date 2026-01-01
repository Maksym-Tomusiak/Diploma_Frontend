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
}

export const fontService = new FontService();
