import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import * as authService from "@/services/auth";
import type { LoginResponse, Customer, ShippingAddress } from "@/types";

/**
 * Login mutation hook
 * @returns Mutation object for user login
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authService.login(payload),
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
    },
  });
};

/**
 * OAuth signup mutation hook
 * @returns Mutation object for OAuth signup
 */
export const useOAuthSignupMutation = () => {
  return useMutation({
    mutationFn: (payload: { name: string; email: string; image?: string }) =>
      authService.signUpWithOAuth(payload),
    onError: (error: Error) => {
      console.error("OAuth signup failed:", error.message);
    },
  });
};

/**
 * Email verification request mutation hook
 * @returns Mutation object for email verification
 */
export const useRequestEmailVerificationMutation = () => {
  return useMutation({
    mutationFn: (payload: { name: string; email: string; password: string }) =>
      authService.requestEmailVerification(payload),
    onError: (error: Error) => {
      console.error("Email verification failed:", error.message);
    },
  });
};

/**
 * Update customer profile mutation hook
 * @returns Mutation object for updating customer profile
 */
export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      token,
    }: {
      id: string;
      data: Partial<Customer>;
      token: string;
    }) => authService.updateCustomer(id, data, token),
    onSuccess: (data, variables) => {
      // Invalidate customer query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
    },
    onError: (error: Error) => {
      console.error("Profile update failed:", error.message);
    },
  });
};

/**
 * Add/Update shipping address mutation hook
 * @returns Mutation object for managing shipping address
 */
export const useShippingAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      address,
      token,
    }: {
      id: string;
      address: ShippingAddress;
      token: string;
    }) => authService.addShippingAddress(id, address, token),
    onSuccess: (data, variables) => {
      // Invalidate shipping address query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.shippingAddress, variables.id],
      });
    },
    onError: (error: Error) => {
      console.error("Shipping address update failed:", error.message);
    },
  });
};


