/**
 * React Query hooks for customer notifications
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCustomerNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationsResponse,
} from "@/services/tracking";

export const NOTIFICATION_QUERY_KEYS = {
  notifications: "customer-notifications",
  unreadCount: "customer-notifications-unread",
} as const;

/**
 * Hook to get customer notifications
 */
export const useCustomerNotifications = (page = 1) => {
  const { isAuthenticated } = useAuth();

  return useQuery<NotificationsResponse>({
    queryKey: [NOTIFICATION_QUERY_KEYS.notifications, page],
    queryFn: () => getCustomerNotifications(page),
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every 60 seconds
    retry: 2,
  });
};

/**
 * Hook to get unread notification count (for badge)
 */
export const useUnreadNotificationCount = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<number>({
    queryKey: [NOTIFICATION_QUERY_KEYS.unreadCount],
    queryFn: async () => {
      const res = await getCustomerNotifications(1, 1);
      return res.unreadCount ?? 0;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 15, // 15 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    retry: 1,
  });
};

/**
 * Hook to mark a single notification as read
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEYS.notifications],
      });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEYS.unreadCount],
      });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEYS.notifications],
      });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEYS.unreadCount],
      });
    },
  });
};
