import { http } from "./http";

// Notification Types
export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: "order" | "promotion" | "system" | "product";
  read: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

// Get user notifications
export const getNotifications = (page = 1, limit = 20, token: string) =>
  http.get<NotificationsResponse>(
    `/notifications?page=${page}&limit=${limit}`,
    { token }
  );

// Get unread notifications count
export const getUnreadCount = (token: string) =>
  http.get<{ count: number }>("/notifications/unread-count", { token });

// Mark notification as read
export const markAsRead = (notificationId: string, token: string) =>
  http.put<{ message: string }>(
    `/notifications/${notificationId}/read`,
    undefined,
    { token }
  );

// Mark all notifications as read
export const markAllAsRead = (token: string) =>
  http.put<{ message: string }>("/notifications/read-all", undefined, {
    token,
  });

// Delete notification
export const deleteNotification = (notificationId: string, token: string) =>
  http.delete<{ message: string }>(`/notifications/${notificationId}`, {
    token,
  });

// Clear all notifications
export const clearAllNotifications = (token: string) =>
  http.delete<{ message: string }>("/notifications/clear", { token });

// Update notification preferences
export const updateNotificationPreferences = (
  preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    productUpdates: boolean;
    newsletter: boolean;
  },
  token: string
) =>
  http.put<{ message: string }>("/notifications/preferences", preferences, {
    token,
  });
