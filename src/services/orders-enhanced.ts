import { http } from "./http";

// Order Types
export interface OrderItem {
  _id: string;
  title: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
  variant?: any;
}

export interface OrderUserInfo {
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  invoice: number;
  user: string;
  cart: OrderItem[];
  user_info: OrderUserInfo;
  subTotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingOption?: string;
  paymentMethod: string;
  cardInfo?: any;
  status: "pending" | "processing" | "delivered" | "cancel";
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  page: number;
  limit: number;
}

export interface CreateOrderPayload {
  cart: Array<{
    productId: string;
    title: string;
    slug: string;
    image: string;
    quantity: number;
    price: number;
    variant?: any;
  }>;
  user_info: OrderUserInfo;
  subTotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingOption?: string;
  paymentMethod: string;
  cardInfo?: any;
}

export interface OrderStats {
  totalOrders: number;
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
  totalSpent: number;
}

// Get customer orders
export const getCustomerOrders = (
  customerId: string,
  page = 1,
  limit = 20,
  token: string
) =>
  http.get<OrdersResponse>(
    `/orders/customer/${customerId}?page=${page}&limit=${limit}`,
    { token }
  );

// Get order by ID
export const getOrderById = (orderId: string, token: string) =>
  http.get<Order>(`/orders/${orderId}`, { token });

// Create new order
export const createOrder = (payload: CreateOrderPayload, token: string) =>
  http.post<{ message: string; order: Order }>("/orders", payload, { token });

// Update order
export const updateOrder = (
  orderId: string,
  payload: Partial<Order>,
  token: string
) =>
  http.put<{ message: string; order: Order }>(`/orders/${orderId}`, payload, {
    token,
  });

// Cancel order
export const cancelOrder = (orderId: string, token: string) =>
  http.put<{ message: string }>(
    `/orders/${orderId}`,
    { status: "cancel" },
    { token }
  );

// Get order stats
export const getOrderStats = (customerId: string, token: string) =>
  http.get<OrderStats>(`/orders/customer/${customerId}/stats`, { token });

// Reorder (create new order from existing order)
export const reorder = (orderId: string, token: string) =>
  http.post<{ message: string; order: Order }>(
    `/orders/${orderId}/reorder`,
    undefined,
    { token }
  );

// Download invoice
export const downloadInvoice = (orderId: string, token: string) =>
  http.get<Blob>(`/orders/${orderId}/invoice`, { token });

// Track order
export const trackOrder = (orderId: string, token?: string) =>
  http.get<{
    order: Order;
    tracking: {
      status: string;
      timestamp: string;
      description: string;
    }[];
  }>(`/orders/${orderId}/track`, { token: token || undefined });
