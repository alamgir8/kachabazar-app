import { API_BASE_URL } from "@/constants";
import { notifyAuthError } from "@/services/api-client";

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log("[api] base url:", API_BASE_URL);
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly payload?: T;

  constructor(message: string, status: number, payload?: T) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

const resolveUrl = (endpoint: string) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const sanitizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${API_BASE_URL}${sanitizedEndpoint}`;
};

export async function request<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  { method = "GET", token, data, headers, signal }: RequestOptions = {}
): Promise<TResponse> {
  const url = resolveUrl(endpoint);
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

    // Check if this is an auth error (401, or JWT/token related message)
    const isAuthError =
      response.status === 401 ||
      message.toLowerCase().includes("jwt") ||
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("unauthorized") ||
      message.toLowerCase().includes("expired");

    if (isAuthError) {
      // Notify auth system to log out the user
      notifyAuthError();
    }

    throw new ApiError(message, response.status, payload ?? undefined);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await parseJson()) as TResponse;
}

export const http = {
  get: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "data">
  ) => request<T>(endpoint, { ...options, method: "GET" }),
  post: <TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    options?: Omit<RequestOptions, "method" | "data">
  ) =>
    request<TResponse, TBody>(endpoint, { ...options, method: "POST", data }),
  put: <TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    options?: Omit<RequestOptions, "method" | "data">
  ) => request<TResponse, TBody>(endpoint, { ...options, method: "PUT", data }),
  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    options?: Omit<RequestOptions, "method" | "data">
  ) =>
    request<TResponse, TBody>(endpoint, {
      ...options,
      method: "PATCH",
      data,
    }),
  delete: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "data">
  ) => request<T>(endpoint, { ...options, method: "DELETE" }),
};
