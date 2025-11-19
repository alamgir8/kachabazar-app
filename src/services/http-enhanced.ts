import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, SECURE_STORAGE_KEYS } from "@/constants";
import { logger } from "@/utils/logger";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  retry?: boolean;
}

export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly payload?: T;

  constructor(message: string, status: number, payload?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

class HttpClient {
  private refreshPromise: Promise<string> | null = null;
  private requestQueue: Array<() => void> = [];
  private isRefreshing = false;

  private resolveUrl(endpoint: string): string {
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }

    const sanitizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    return `${API_BASE_URL}${sanitizedEndpoint}`;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem(
      SECURE_STORAGE_KEYS.refreshToken
    );

    if (!refreshToken) {
      throw new ApiError("No refresh token available", 401);
    }

    try {
      const response = await fetch(this.resolveUrl("/customer/refresh"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new ApiError("Token refresh failed", response.status);
      }

      const data = await response.json();
      const newAccessToken = data.token || data.accessToken;

      if (newAccessToken) {
        await AsyncStorage.setItem(
          SECURE_STORAGE_KEYS.accessToken,
          newAccessToken
        );
        
        if (data.refreshToken) {
          await AsyncStorage.setItem(
            SECURE_STORAGE_KEYS.refreshToken,
            data.refreshToken
          );
        }

        return newAccessToken;
      }

      throw new ApiError("No token in refresh response", 401);
    } catch (error) {
      // Clear tokens if refresh fails
      await AsyncStorage.multiRemove([
        SECURE_STORAGE_KEYS.accessToken,
        SECURE_STORAGE_KEYS.refreshToken,
        SECURE_STORAGE_KEYS.user,
      ]);
      throw error;
    }
  }

  /**
   * Handle 401 errors with automatic token refresh
   */
  private async handleUnauthorized(
    endpoint: string,
    options: RequestOptions
  ): Promise<Response> {
    if (this.isRefreshing) {
      // Wait for ongoing refresh
      return new Promise((resolve, reject) => {
        this.requestQueue.push(async () => {
          try {
            const token = await AsyncStorage.getItem(
              SECURE_STORAGE_KEYS.accessToken
            );
            const response = await this.executeRequest(endpoint, {
              ...options,
              token,
              retry: false, // Prevent infinite retry
            });
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await this.refreshAccessToken();
      logger.info("Access token refreshed successfully", undefined, "HTTP");

      // Process queued requests
      this.requestQueue.forEach((callback) => callback());
      this.requestQueue = [];

      // Retry original request with new token
      return await this.executeRequest(endpoint, {
        ...options,
        token: newToken,
        retry: false,
      });
    } catch (error) {
      logger.error("Token refresh failed", error, "HTTP");
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Execute HTTP request
   */
  private async executeRequest(
    endpoint: string,
    options: RequestOptions
  ): Promise<Response> {
    const { method = "GET", token, data, headers, signal } = options;
    const url = this.resolveUrl(endpoint);
    const startTime = Date.now();

    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        body: data
          ? isFormData
            ? (data as FormData)
            : JSON.stringify(data)
          : undefined,
        signal,
      });

      const duration = Date.now() - startTime;
      logger.logApiRequest(method, endpoint, response.status, duration);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logApiRequest(method, endpoint, undefined, duration);
      throw error;
    }
  }

  /**
   * Main request method with automatic retry on 401
   */
  async request<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const { retry = true } = options;

    try {
      const response = await this.executeRequest(endpoint, options);

      // Handle 401 with token refresh
      if (response.status === 401 && retry) {
        const retryResponse = await this.handleUnauthorized(endpoint, options);
        return await this.parseResponse<TResponse>(retryResponse);
      }

      return await this.parseResponse<TResponse>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Network request failed",
        0
      );
    }
  }

  /**
   * Parse response and handle errors
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const parseJson = async () => {
      try {
        return await response.json();
      } catch (error) {
        return null;
      }
    };

    if (!response.ok) {
      const payload = await parseJson();
      const message =
        (payload && typeof payload === "object" && "message" in payload
          ? String(payload.message)
          : response.statusText) || "Request failed";
      throw new ApiError(message, response.status, payload ?? undefined);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await parseJson()) as T;
  }

  // Convenience methods
  get = <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "data">) =>
    this.request<T>(endpoint, { ...options, method: "GET" });

  post = <TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    options?: Omit<RequestOptions, "method" | "data">
  ) => this.request<TResponse, TBody>(endpoint, { ...options, method: "POST", data });

  put = <TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    options?: Omit<RequestOptions, "method" | "data">
  ) => this.request<TResponse, TBody>(endpoint, { ...options, method: "PUT", data });

  patch = <TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    options?: Omit<RequestOptions, "method" | "data">
  ) => this.request<TResponse, TBody>(endpoint, { ...options, method: "PATCH", data });

  delete = <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "data">) =>
    this.request<T>(endpoint, { ...options, method: "DELETE" });
}

export const httpEnhanced = new HttpClient();


