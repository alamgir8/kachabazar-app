import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import * as orderService from "@/services/orders";
import type { OrderSummary } from "@/types";

/**
 * Create order mutation hook
 * @returns Mutation object for creating a new order
 */
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      order,
      token,
    }: {
      order: Omit<OrderSummary, "_id" | "createdAt" | "updatedAt">;
      token: string;
    }) => orderService.createOrder(order, token),
    onSuccess: () => {
      // Invalidate orders list to show the new order
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orders] });
    },
    onError: (error: Error) => {
      console.error("Order creation failed:", error.message);
    },
  });
};

/**
 * Create payment intent mutation hook (Stripe)
 * @returns Mutation object for creating Stripe payment intent
 */
export const useCreatePaymentIntentMutation = () => {
  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: Record<string, unknown>;
      token: string;
    }) => orderService.createPaymentIntent(payload, token),
    onError: (error: Error) => {
      console.error("Payment intent creation failed:", error.message);
    },
  });
};

/**
 * Create Razorpay order mutation hook
 * @returns Mutation object for creating Razorpay order
 */
export const useCreateRazorpayOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: { amount: number };
      token: string;
    }) => orderService.createRazorpayOrder(payload, token),
    onError: (error: Error) => {
      console.error("Razorpay order creation failed:", error.message);
    },
  });
};

/**
 * Finalize Razorpay order mutation hook
 * @returns Mutation object for finalizing Razorpay payment
 */
export const useFinalizeRazorpayOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: Record<string, unknown>;
      token: string;
    }) => orderService.finalizeRazorpayOrder(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orders] });
    },
    onError: (error: Error) => {
      console.error("Razorpay finalization failed:", error.message);
    },
  });
};

/**
 * Email invoice mutation hook
 * @returns Mutation object for sending invoice via email
 */
export const useEmailInvoiceMutation = () => {
  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: Record<string, unknown>;
      token: string;
    }) => orderService.emailInvoiceToCustomer(payload, token),
    onError: (error: Error) => {
      console.error("Invoice email failed:", error.message);
    },
  });
};


