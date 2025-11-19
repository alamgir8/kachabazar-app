import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import * as wishlistService from "@/services/wishlist";

/**
 * Add to wishlist mutation hook
 * @returns Mutation object for adding product to wishlist
 */
export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      token,
    }: {
      productId: string;
      token: string;
    }) => wishlistService.addToWishlist(productId, token),
    onSuccess: () => {
      // Invalidate wishlist query
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.wishlist] });
    },
    onError: (error: Error) => {
      console.error("Add to wishlist failed:", error.message);
    },
  });
};

/**
 * Remove from wishlist mutation hook
 * @returns Mutation object for removing product from wishlist
 */
export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      token,
    }: {
      productId: string;
      token: string;
    }) => wishlistService.removeFromWishlist(productId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.wishlist] });
    },
    onError: (error: Error) => {
      console.error("Remove from wishlist failed:", error.message);
    },
  });
};

/**
 * Clear wishlist mutation hook
 * @returns Mutation object for clearing entire wishlist
 */
export const useClearWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => wishlistService.clearWishlist(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.wishlist] });
    },
    onError: (error: Error) => {
      console.error("Clear wishlist failed:", error.message);
    },
  });
};


