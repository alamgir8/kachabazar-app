import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchOrderById,
  listOrders,
  OrderListResponse,
} from "@/services/orders";
import { OrderSummary } from "@/types";

export const useOrders = (page = 1) => {
  const { accessToken, isAuthenticated, user } = useAuth();

  return useQuery<OrderListResponse>({
    queryKey: [QUERY_KEYS.orders, page, user?._id],
    queryFn: async () => {
      if (!accessToken) throw new Error("Missing token");
      return listOrders(accessToken, { page });
    },
    enabled: isAuthenticated && Boolean(accessToken),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  });
};

export const useOrder = (orderId?: string) => {
  const { accessToken, isAuthenticated, user } = useAuth();

  return useQuery<OrderSummary>({
    queryKey: [QUERY_KEYS.order, orderId, user?._id],
    queryFn: async () => {
      if (!orderId) throw new Error("Order id is required");
      if (!accessToken) throw new Error("Missing token");
      return fetchOrderById(accessToken, orderId);
    },
    enabled: isAuthenticated && Boolean(orderId) && Boolean(accessToken),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Don't refetch single order on focus
    retry: 2,
  });
};
