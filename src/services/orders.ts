import { DEFAULT_PAGE_SIZE } from "@/constants";
import { http } from "@/services/http";
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

export const createOrder = (
  order: Omit<OrderSummary, "_id" | "createdAt" | "updatedAt">,
  token: string
) => http.post<OrderSummary>("/order/add", order, { token });

export const createPaymentIntent = (
  payload: Record<string, unknown>,
  token: string
) =>
  http.post("/order/create-payment-intent", payload, {
    token
  });

export const createRazorpayOrder = (
  payload: { amount: number },
  token: string
) =>
  http.post("/order/create/razorpay", payload, {
    token
  });

export const finalizeRazorpayOrder = (
  payload: Record<string, unknown>,
  token: string
) =>
  http.post("/order/add/razorpay", payload, {
    token
  });

export const listOrders = (
  token: string,
  params: { page?: number; limit?: number } = {}
) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE } = params;
  return http.get<OrderListResponse>(`/order?limit=${limit}&page=${page}`, {
    token
  });
};

export const fetchOrderById = (token: string, id: string) =>
  http.get<OrderSummary>(`/order/${id}`, { token });

export const emailInvoiceToCustomer = (
  payload: Record<string, unknown>,
  token: string
) =>
  http.post("/order/customer/invoice", payload, {
    token
  });
