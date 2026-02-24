import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyOrders,
  getCurrentOrder,
  getMyStats,
  getMyProfile,
  updateTrackingStatus,
  updateMyLocation,
  updateAvailability,
  updateMyProfile,
  getOrderTrackingHistory,
} from "@/services/delivery";

const KEYS = {
  orders: "delivery-orders",
  currentOrder: "delivery-current-order",
  stats: "delivery-stats",
  profile: "delivery-profile",
  trackingHistory: "delivery-tracking-history",
} as const;

// ─── Queries ─────────────────────────────────────────────────────

export const useDeliveryOrders = (page = 1, status?: string) =>
  useQuery({
    queryKey: [KEYS.orders, page, status],
    queryFn: () => getMyOrders(page, 20, status),
    staleTime: 30_000,
  });

export const useCurrentOrder = () =>
  useQuery({
    queryKey: [KEYS.currentOrder],
    queryFn: getCurrentOrder,
    staleTime: 15_000,
    refetchInterval: 30_000, // poll every 30 s while screen is active
  });

export const useDeliveryStats = () =>
  useQuery({
    queryKey: [KEYS.stats],
    queryFn: getMyStats,
    staleTime: 30_000,
  });

export const useDeliveryProfile = () =>
  useQuery({
    queryKey: [KEYS.profile],
    queryFn: getMyProfile,
    staleTime: 60_000,
  });

export const useOrderTrackingHistory = (orderId: string) =>
  useQuery({
    queryKey: [KEYS.trackingHistory, orderId],
    queryFn: () => getOrderTrackingHistory(orderId),
    enabled: !!orderId,
    staleTime: 15_000,
  });

// ─── Mutations ───────────────────────────────────────────────────

export const useUpdateTrackingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      trackingStatus,
      message,
      location,
    }: {
      orderId: string;
      trackingStatus: string;
      message?: string;
      location?: { lat: number; lng: number; address?: string };
    }) => updateTrackingStatus(orderId, { trackingStatus, message, location }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEYS.orders] });
      qc.invalidateQueries({ queryKey: [KEYS.currentOrder] });
      qc.invalidateQueries({ queryKey: [KEYS.stats] });
    },
  });
};

export const useUpdateLocation = () =>
  useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      updateMyLocation(lat, lng),
  });

export const useUpdateAvailability = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (availability: "available" | "on-delivery" | "offline") =>
      updateAvailability(availability),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEYS.stats] });
      qc.invalidateQueries({ queryKey: [KEYS.profile] });
    },
  });
};

export const useUpdateDeliveryProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: Record<string, string> | string;
      phone?: string;
      image?: string;
      password?: string;
    }) => updateMyProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEYS.profile] });
    },
  });
};
