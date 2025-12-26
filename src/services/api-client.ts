/**
 * API Client with automatic token refresh and error handling
 * This module provides a centralized way to make authenticated API calls
 * with automatic token refresh when tokens expire.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, SECURE_STORAGE_KEYS } from "@/constants";

// Event emitter for auth state changes
type AuthEventListener = () => void;
const authEventListeners: Set<AuthEventListener> = new Set();

export const onAuthError = (listener: AuthEventListener) => {
  authEventListeners.add(listener);
  return () => authEventListeners.delete(listener);
};

export const notifyAuthError = () => {
  authEventListeners.forEach((listener) => listener());
};

// Token storage helpers
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let tokenExpiresAt: number | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const setTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 900 // 15 minutes default
) => {
  cachedAccessToken = accessToken;
  cachedRefreshToken = refreshToken;
  // Set expiry 1 minute before actual expiry to be safe
  tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000;
};

export const clearTokens = () => {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  tokenExpiresAt = null;
};

export const getAccessToken = () => cachedAccessToken;
export const getRefreshToken = () => cachedRefreshToken;

// Initialize tokens from storage
export const initializeTokens = async () => {
  const [accessToken, refreshToken] = await AsyncStorage.multiGet([
    SECURE_STORAGE_KEYS.accessToken,
    SECURE_STORAGE_KEYS.refreshToken,
  ]);

  if (accessToken[1]) {
    cachedAccessToken = accessToken[1];
  }
  if (refreshToken[1]) {
    cachedRefreshToken = refreshToken[1];
  }
};

// Refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
  if (!cachedRefreshToken) {
    return null;
  }

  // If already refreshing, wait for the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: cachedRefreshToken }),
      });

      if (!response.ok) {
        // Refresh token is invalid, need to re-authenticate
        clearTokens();
        notifyAuthError();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.token ?? data.accessToken;
      const newRefreshToken = data.refreshToken ?? cachedRefreshToken;
      const expiresIn = data.expiresIn ?? 900;

      if (newAccessToken) {
        setTokens(newAccessToken, newRefreshToken, expiresIn);

        // Persist to storage
        await AsyncStorage.multiSet([
          [SECURE_STORAGE_KEYS.accessToken, newAccessToken],
          [SECURE_STORAGE_KEYS.refreshToken, newRefreshToken],
        ]);

        return newAccessToken;
      }

      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearTokens();
      notifyAuthError();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Check if token needs refresh
const shouldRefreshToken = (): boolean => {
  if (!tokenExpiresAt) return true; // No expiry set, try to refresh
  return Date.now() >= tokenExpiresAt;
};

// Get valid access token (refresh if needed)
export const getValidAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken) {
    await initializeTokens();
  }

  if (cachedAccessToken && shouldRefreshToken()) {
    const newToken = await refreshAccessToken();
    return newToken;
  }

  return cachedAccessToken;
};

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  requiresAuth?: boolean;
  skipRefresh?: boolean;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly payload?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    payload?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }

  isAuthError(): boolean {
    return (
      this.status === 401 ||
      this.message.toLowerCase().includes("jwt") ||
      this.message.toLowerCase().includes("token") ||
      this.message.toLowerCase().includes("unauthorized")
    );
  }

  isNetworkError(): boolean {
    return (
      this.message.toLowerCase().includes("network") ||
      this.message.toLowerCase().includes("fetch") ||
      this.status === 0
    );
  }
}

/**
 * Make an API request with automatic token refresh
 */
export async function apiRequest<TResponse = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const {
    method = "GET",
    data,
    headers = {},
    signal,
    requiresAuth = true,
    skipRefresh = false,
  } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = skipRefresh ? cachedAccessToken : await getValidAccessToken();

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: data ? JSON.stringify(data) : undefined,
      signal,
    });

    const parseJson = async () => {
      try {
        return await response.json();
      } catch {
        return null;
      }
    };

    if (!response.ok) {
      const payload = await parseJson();
      const message =
        (payload?.message as string) || response.statusText || "Request failed";
      const code = payload?.code as string | undefined;

      // Handle auth errors
      if (response.status === 401) {
        // If we haven't tried refreshing yet, try once
        if (requiresAuth && !skipRefresh && cachedRefreshToken) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            // Retry the request with new token
            return apiRequest<TResponse>(endpoint, {
              ...options,
              skipRefresh: true,
            });
          }
        }

        // Refresh failed or no refresh token, notify auth error
        notifyAuthError();
      }

      throw new ApiError(message, response.status, code, payload);
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return (await parseJson()) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other error
    const message =
      error instanceof Error ? error.message : "Network request failed";
    throw new ApiError(message, 0, "NETWORK_ERROR");
  }
}

// Convenience methods
export const api = {
  get: <T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "data">
  ) => apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "data">
  ) => apiRequest<T>(endpoint, { ...options, method: "POST", data }),

  put: <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "data">
  ) => apiRequest<T>(endpoint, { ...options, method: "PUT", data }),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "data">
  ) => apiRequest<T>(endpoint, { ...options, method: "PATCH", data }),

  delete: <T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "data">
  ) => apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;
