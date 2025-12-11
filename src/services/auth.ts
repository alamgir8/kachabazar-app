import { http } from "@/services/http";
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

// Legacy functions using http (with manual token passing)
export const login = (payload: LoginPayload) =>
  http.post<LoginResponse>("/customer/login", payload);

export const signUpWithOAuth = (payload: {
  name: string;
  email: string;
  image?: string;
}) => http.post<LoginResponse>("/customer/signup/oauth", payload);

export const refreshSession = (refreshToken: string) =>
  http.post<RefreshResponse>("/customer/refresh", { refreshToken });

export const fetchCustomer = (id: string, token: string) =>
  http.get<Customer>(`/customer/${id}`, { token });

export const updateCustomer = (
  id: string,
  data: Partial<Customer>,
  token: string
) =>
  http.put<LoginResponse>(`/customer/${id}`, data, {
    token,
  });

export const addShippingAddress = (
  id: string,
  address: ShippingAddress,
  token: string
) =>
  http.post<{ message: string }>(`/customer/shipping/address/${id}`, address, {
    token,
  });

export const getShippingAddress = (id: string, token: string) =>
  http.get<{ shippingAddress: ShippingAddress }>(
    `/customer/shipping/address/${id}`,
    { token }
  );

export const requestEmailVerification = (payload: {
  name: string;
  email: string;
  password: string;
}) => http.post<{ message: string }>("/customer/verify-email", payload);

// New functions using api-client (with automatic token refresh)
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
