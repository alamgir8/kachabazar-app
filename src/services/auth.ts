import { api } from "@/services/api-client";
import {
  Customer,
  LoginResponse,
  RefreshResponse,
  ShippingAddress,
} from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

// Functions using api-client (with automatic token refresh)
export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>("/customer/login", payload, { requiresAuth: false });

export const signUpWithOAuth = (payload: {
  name: string;
  email: string;
  image?: string;
}) =>
  api.post<LoginResponse>("/customer/signup/oauth", payload, {
    requiresAuth: false,
  });

export const refreshSession = (refreshToken: string) =>
  api.post<RefreshResponse>(
    "/customer/refresh",
    { refreshToken },
    { requiresAuth: false }
  );

export const fetchCustomer = (id: string) =>
  api.get<Customer>(`/customer/${id}`);

export const updateCustomer = (id: string, data: Partial<Customer>) =>
  api.put<LoginResponse>(`/customer/${id}`, data);

export const addShippingAddress = (id: string, address: ShippingAddress) =>
  api.post<{ message: string }>(`/customer/shipping/address/${id}`, address);

export const getShippingAddress = (id: string) =>
  api.get<{ shippingAddress: ShippingAddress }>(
    `/customer/shipping/address/${id}`
  );

export const requestEmailVerification = (payload: {
  name: string;
  email: string;
  password: string;
}) =>
  api.post<{ message: string }>("/customer/verify-email", payload, {
    requiresAuth: false,
  });

export const authApi = {
  // Auth endpoints (no token required)
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>("/customer/login", payload, {
      requiresAuth: false,
    }),

  signUpWithOAuth: (payload: { name: string; email: string; image?: string }) =>
    api.post<LoginResponse>("/customer/signup/oauth", payload, {
      requiresAuth: false,
    }),

  requestEmailVerification: (payload: {
    name: string;
    email: string;
    password: string;
  }) =>
    api.post<{ message: string }>("/customer/verify-email", payload, {
      requiresAuth: false,
    }),

  // Email OTP verification endpoints
  sendEmailOtp: (payload: {
    email: string;
    name?: string;
    password?: string;
  }) =>
    api.post<{ message: string; expiresIn?: number }>(
      "/customer/send-email-otp",
      payload,
      {
        requiresAuth: false,
      }
    ),

  confirmEmailOtp: (payload: {
    email: string;
    code: string;
    name?: string;
    password?: string;
  }) =>
    api.post<LoginResponse>("/customer/confirm-email-otp", payload, {
      requiresAuth: false,
    }),

  resendEmailOtp: (payload: { email: string }) =>
    api.post<{ message: string; expiresIn?: number }>(
      "/customer/resend-email-otp",
      payload,
      {
        requiresAuth: false,
      }
    ),

  // Phone OTP verification endpoints
  requestPhoneOtp: (payload: {
    phone: string;
    name?: string;
    password?: string;
  }) =>
    api.post<{ message: string; expiresIn: number }>(
      "/customer/verify-phone",
      payload,
      {
        requiresAuth: false,
      }
    ),

  confirmPhoneOtp: (payload: {
    phone: string;
    code: string;
    name?: string;
    password?: string;
  }) =>
    api.post<LoginResponse>("/customer/confirm-phone-otp", payload, {
      requiresAuth: false,
    }),

  resendPhoneOtp: (payload: { phone: string }) =>
    api.post<{ message: string; expiresIn: number }>(
      "/customer/resend-phone-otp",
      payload,
      {
        requiresAuth: false,
      }
    ),

  // Customer endpoints (token auto-refreshed)
  getCustomer: (id: string) => api.get<Customer>(`/customer/${id}`),

  updateCustomer: (id: string, data: Partial<Customer>) =>
    api.put<LoginResponse>(`/customer/${id}`, data),

  addShippingAddress: (id: string, address: ShippingAddress) =>
    api.post<{ message: string }>(`/customer/shipping/address/${id}`, address),

  getShippingAddress: (id: string) =>
    api.get<{ shippingAddress: ShippingAddress }>(
      `/customer/shipping/address/${id}`
    ),
};
