import { DEFAULT_PAGE_SIZE } from "@/constants";
import { api } from "@/services/api-client";
import { OrderSummary } from "@/types";

export interface OrderListResponse {
  orders: OrderSummary[];
  totalDoc: number;
  limits: number;
  pages: number;
  pending: number;
  processing: number;
  delivered: number;
}

// Legacy functions using http (with manual token passing)
export const createOrder = (
  order: Omit<OrderSummary, "_id" | "createdAt" | "updatedAt">
) => api.post<OrderSummary>("/order/add", order);

export const createPaymentIntent = (payload: Record<string, unknown>) =>
  api.post("/order/create-payment-intent", payload);

export const createRazorpayOrder = (payload: { amount: number }) =>
  api.post("/order/create/razorpay", payload);

export const finalizeRazorpayOrder = (payload: Record<string, unknown>) =>
  api.post("/order/add/razorpay", payload);

export const listOrders = (params: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE } = params;
  return api.get<OrderListResponse>(`/order?limit=${limit}&page=${page}`);
};

export const fetchOrderById = (id: string) =>
  api.get<OrderSummary>(`/order/${id}`);

export const emailInvoiceToCustomer = (payload: Record<string, unknown>) =>
  api.post("/order/customer/invoice", payload);

// New functions using api-client (with automatic token refresh)
export const ordersApi = {
  create: (order: Omit<OrderSummary, "_id" | "createdAt" | "updatedAt">) =>
    api.post<OrderSummary>("/order/add", order),

  createPaymentIntent: (payload: Record<string, unknown>) =>
    api.post("/order/create-payment-intent", payload),

  createRazorpayOrder: (payload: { amount: number }) =>
    api.post("/order/create/razorpay", payload),

  finalizeRazorpayOrder: (payload: Record<string, unknown>) =>
    api.post("/order/add/razorpay", payload),

  list: (params: { page?: number; limit?: number } = {}) => {
    const { page = 1, limit = DEFAULT_PAGE_SIZE } = params;
    return api.get<OrderListResponse>(`/order?limit=${limit}&page=${page}`);
  },

  getById: (id: string) => api.get<OrderSummary>(`/order/${id}`),

  emailInvoice: (payload: Record<string, unknown>) =>
    api.post("/order/customer/invoice", payload),
};
