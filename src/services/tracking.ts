/**
 * Tracking & Delivery Boy Service
 * Handles order tracking, delivery boy info, rating, and customer notifications
 */

import { api } from "@/services/api-client";

// ==================== Types ====================

export interface TrackingHistoryEntry {
  status: string;
  message: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  updatedBy?: string;
  updatedById?: string;
  timestamp: string;
}

export interface DeliveryBoyInfo {
  _id: string;
  name: Record<string, string> | string;
  phone: string;
  image?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  averageRating?: number;
  totalRatings?: number;
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}

export interface OrderTracking {
  _id: string;
  orderId: string;
  trackingId: string;
  deliveryBoyId?: string;
  status: string;
  history: TrackingHistoryEntry[];
  estimatedDelivery?: string;
  actualDelivery?: string;
  deliveryProof?: {
    image?: string;
    signature?: string;
    note?: string;
  };
}

export interface TrackOrderResponse {
  order: {
    _id: string;
    invoice: number;
    status: string;
    total: number;
    shippingCost: number;
    discount: number;
    subTotal: number;
    paymentMethod: string;
    user_info: {
      name: string;
      email: string;
      contact: string;
      address: string;
      city: string;
      country: string;
      zipCode: string;
    };
    cart: Array<{
      title: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    createdAt: string;
  };
  tracking: OrderTracking;
  deliveryBoy: DeliveryBoyInfo | null;
}

export interface CustomerNotification {
  _id: string;
  customerId: string;
  orderId?: string;
  trackingId?: string;
  type:
    | "order-placed"
    | "order-confirmed"
    | "order-preparing"
    | "order-ready"
    | "order-picked-up"
    | "order-on-the-way"
    | "order-nearby"
    | "order-delivered"
    | "order-cancelled"
    | "delivery-assigned"
    | "rating-request"
    | "general";
  title: string;
  message: string;
  status: "read" | "unread";
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: CustomerNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface RateDeliveryPayload {
  orderId: string;
  rating: number;
  review?: string;
}

// ==================== API Functions ====================

/**
 * Track an order by tracking ID (public — no auth required)
 */
export const trackOrderByTrackingId = (trackingId: string) =>
  api.get<TrackOrderResponse>(`/tracking/track/${trackingId}`, {
    requiresAuth: false,
  });

/**
 * Rate a delivery boy (requires auth)
 */
export const rateDeliveryBoy = (payload: RateDeliveryPayload) =>
  api.post<{ message: string }>("/customer-tracking/rate-delivery", payload);

/**
 * Get customer notifications (requires auth)
 */
export const getCustomerNotifications = (page = 1, limit = 20) =>
  api.get<NotificationsResponse>(
    `/customer-tracking/notifications?page=${page}&limit=${limit}`,
  );

/**
 * Get unread notification count (requires auth)
 */
export const getUnreadNotificationCount = () =>
  api.get<{ unreadCount: number }>(
    `/customer-tracking/notifications?page=1&limit=1`,
  );

/**
 * Mark a single notification as read (requires auth)
 */
export const markNotificationRead = (notificationId: string) =>
  api.put<{ message: string }>(
    `/customer-tracking/notifications/${notificationId}/read`,
  );

/**
 * Mark all notifications as read (requires auth)
 */
export const markAllNotificationsRead = () =>
  api.put<{ message: string }>("/customer-tracking/notifications/read-all");
