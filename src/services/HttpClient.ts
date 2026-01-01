import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";

export interface HttpClientConfig extends AxiosRequestConfig {
  baseURL: string;
  withCredentials?: boolean;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.headers,
      },
    });

    this.initInterceptors();
  }

  async get<T = any>(url: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>({ method: "GET", url, signal });
  }

  async post<T = any>(
    url: string,
    data?: any,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>({ method: "POST", url, data, signal });
  }

  async put<T = any>(
    url: string,
    data?: any,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>({ method: "PUT", url, data, signal });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>({ method: "PATCH", url, data, signal });
  }

  async delete<T = any>(url: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>({ method: "DELETE", url, signal });
  }

  private async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request<T>(
        config
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.info("Request was cancelled");
      } else if (error instanceof AxiosError) {
        console.error("Request failed with error", error.response?.statusText);
      } else if (error instanceof Error) {
        console.error("Unexpected error occurred", error.message);
      }
      return Promise.reject(error);
    }
  }

  private initInterceptors() {
    // Attach token before requests
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              if (typeof window !== "undefined") {
                localStorage.setItem("token", newToken);
              }
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              return this.axiosInstance.request(error.config);
            }
          } catch {
            console.error("Token refresh failed, redirecting to login...");
            if (
              typeof window !== "undefined" &&
              !window.location.href.includes("/login")
            ) {
              window.location.href =
                "/login?returnUrl=" + window.location.pathname;
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Refresh token is sent automatically in HTTP-only cookie
      const refreshInstance = axios.create({
        baseURL: apiUrl,
        withCredentials: true, // Important: sends cookies with request
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const response = await refreshInstance.post(`/v1/auth/refresh`, {});

      const { access_token } = response.data;

      // Store new access token (refresh token is updated in cookie by backend)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
      }

      return access_token;
    } catch (e) {
      console.error("Token refresh failed", e);
      // Clear access token on refresh failure
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return null;
    }
  }
}

// Singleton instance
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const httpClient = new HttpClient({
  baseURL: apiBaseUrl,
  withCredentials: true,
});
