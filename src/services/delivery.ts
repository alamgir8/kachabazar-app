/**
 * Delivery Boy API Service
 * Uses direct fetch with delivery boy token (separate from customer auth)
 */

import { API_BASE_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DELIVERY_TOKEN_KEY = "@kachabazar/delivery_token";

const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(DELIVERY_TOKEN_KEY);
};

const authFetch = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = await getToken();
  const url = `${API_BASE_URL}/delivery${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
};

// ─── Types ───────────────────────────────────────────────────────

export interface DeliveryOrder {
  _id: string;
  invoice?: number;
  trackingId?: string;
  paymentMethod: string;
  subTotal: number;
  total: number;
  discount: number;
  shippingCost: number;
  status: string;
  trackingStatus: string;
  user_info: {
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  deliveryBoyName?: string;
  deliveryBoyPhone?: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryOrdersResponse {
  orders: DeliveryOrder[];
  totalDoc: number;
  currentOrders: number;
  limits: number;
  pages: number;
}

export interface CurrentOrderResponse {
  order: DeliveryOrder | null;
  tracking: {
    status: string;
    history: TrackingHistoryEntry[];
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    deliveryProof?: {
      image?: string;
      signature?: string;
      note?: string;
    };
  } | null;
  message?: string;
}

export interface TrackingHistoryEntry {
  status: string;
  message: string;
  location?: { lat?: number; lng?: number; address?: string };
  updatedBy: string;
  timestamp: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  totalRatings: number;
  thisMonthDeliveries: number;
  todayDeliveries: number;
  activeOrders: number;
  thisMonthEarnings: number;
  recentRatings: Array<{
    rating: number;
    review?: string;
    createdAt: string;
  }>;
  availability: "available" | "on-delivery" | "offline";
}

export interface DeliveryProfile {
  _id: string;
  name: Record<string, string> | string;
  email: string;
  phone: string;
  image?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  vehicleType: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  status: string;
  availability: string;
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  totalRatings: number;
  joiningDate: string;
  createdAt: string;
}

export interface OrderTrackingHistoryResponse {
  order: {
    _id: string;
    invoice?: number;
    trackingId?: string;
    status: string;
    trackingStatus: string;
    deliveryBoyName?: string;
    createdAt: string;
  };
  tracking: {
    status: string;
    history: TrackingHistoryEntry[];
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    deliveryProof?: {
      image?: string;
      signature?: string;
      note?: string;
    };
  };
}

// ─── API Methods ─────────────────────────────────────────────────

/** Get my assigned orders */
export const getMyOrders = async (
  page = 1,
  limit = 20,
  status?: string,
): Promise<DeliveryOrdersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append("status", status);
  const res = await authFetch(`/my-orders?${params}`);
  return handleResponse<DeliveryOrdersResponse>(res);
};

/** Get current active order */
export const getCurrentOrder = async (): Promise<CurrentOrderResponse> => {
  const res = await authFetch("/current-order");
  return handleResponse<CurrentOrderResponse>(res);
};

/** Get my dashboard stats */
export const getMyStats = async (): Promise<DeliveryStats> => {
  const res = await authFetch("/my-stats");
  return handleResponse<DeliveryStats>(res);
};

/** Update tracking status for an order */
export const updateTrackingStatus = async (
  orderId: string,
  payload: {
    trackingStatus: string;
    message?: string;
    location?: { lat: number; lng: number; address?: string };
  },
): Promise<{
  message: string;
  trackingStatus: string;
  orderStatus: string;
}> => {
  const res = await authFetch(`/update-tracking/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

/** Update my location */
export const updateMyLocation = async (
  lat: number,
  lng: number,
): Promise<{ message: string }> => {
  const res = await authFetch("/update-location", {
    method: "PUT",
    body: JSON.stringify({ lat, lng }),
  });
  return handleResponse(res);
};

/** Update availability */
export const updateAvailability = async (
  availability: "available" | "on-delivery" | "offline",
): Promise<{ message: string }> => {
  const res = await authFetch("/update-availability", {
    method: "PUT",
    body: JSON.stringify({ availability }),
  });
  return handleResponse(res);
};

/** Get my profile */
export const getMyProfile = async (): Promise<DeliveryProfile> => {
  const res = await authFetch("/my-profile");
  return handleResponse<DeliveryProfile>(res);
};

/** Update my profile */
export const updateMyProfile = async (data: {
  name?: Record<string, string> | string;
  phone?: string;
  image?: string;
  password?: string;
}): Promise<DeliveryProfile & { message: string }> => {
  const res = await authFetch("/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

/** Get order tracking history */
export const getOrderTrackingHistory = async (
  orderId: string,
): Promise<OrderTrackingHistoryResponse> => {
  const res = await authFetch(`/tracking-history/${orderId}`);
  return handleResponse<OrderTrackingHistoryResponse>(res);
};
