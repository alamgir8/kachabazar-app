import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrderById, listOrders } from "@/services/orders";
import { OrderListResponse, OrderSummary } from "@/services/orders";

export const useOrders = (page = 1) => {
  const { accessToken, isAuthenticated } = useAuth();

  return useQuery<OrderListResponse>({
    queryKey: [QUERY_KEYS.orders, page],
    queryFn: () => {
      if (!accessToken) throw new Error("Missing token");
      return listOrders(accessToken, { page });
    },
    enabled: isAuthenticated && Boolean(accessToken),
    staleTime: 1000 * 30
  });
};

export const useOrder = (orderId?: string) => {
  const { accessToken, isAuthenticated } = useAuth();

  return useQuery<OrderSummary>({
    queryKey: [QUERY_KEYS.order, orderId],
    queryFn: () => {
      if (!orderId) throw new Error("Order id is required");
      if (!accessToken) throw new Error("Missing token");
      return fetchOrderById(accessToken, orderId);
    },
    enabled: isAuthenticated && Boolean(orderId && accessToken)
  });
};
