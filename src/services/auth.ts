import { http } from "@/services/http";
import {
  Customer,
  LoginResponse,
  RefreshResponse,
  ShippingAddress
} from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

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
    token
  });

export const addShippingAddress = (
  id: string,
  address: ShippingAddress,
  token: string
) =>
  http.post<{ message: string }>(`/customer/shipping/address/${id}`, address, {
    token
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
