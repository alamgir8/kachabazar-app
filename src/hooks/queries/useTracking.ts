/**
 * React Query hooks for order tracking
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  trackOrderByTrackingId,
  rateDeliveryBoy,
  type TrackOrderResponse,
  type RateDeliveryPayload,
} from "@/services/tracking";

export const TRACKING_QUERY_KEYS = {
  tracking: "order-tracking",
} as const;

/**
 * Hook to track an order by its tracking ID
 */
export const useOrderTracking = (trackingId?: string) => {
  return useQuery<TrackOrderResponse>({
    queryKey: [TRACKING_QUERY_KEYS.tracking, trackingId],
    queryFn: () => {
      if (!trackingId) throw new Error("Tracking ID is required");
      return trackOrderByTrackingId(trackingId);
    },
    enabled: Boolean(trackingId),
    staleTime: 1000 * 30, // 30 seconds — tracking data changes often
    refetchInterval: 1000 * 60, // Refetch every 60 seconds
    retry: 2,
  });
};

/**
 * Hook to rate a delivery boy
 */
export const useRateDeliveryBoy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RateDeliveryPayload) => rateDeliveryBoy(payload),
    onSuccess: () => {
      // Invalidate tracking to refresh delivery boy rating data
      queryClient.invalidateQueries({
        queryKey: [TRACKING_QUERY_KEYS.tracking],
      });
    },
    onError: (error: Error) => {
      console.error("Rating delivery boy failed:", error.message);
    },
  });
};
