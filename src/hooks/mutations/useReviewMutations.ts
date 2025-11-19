import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import * as reviewService from "@/services/reviews";
import type { AddReviewPayload, UpdateReviewPayload } from "@/services/reviews";

/**
 * Create review mutation hook
 * @returns Mutation object for creating a product review
 */
export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: AddReviewPayload;
      token: string;
    }) => reviewService.addReview(payload, token),
    onSuccess: (data, variables) => {
      // Invalidate product query to refresh reviews
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.product, variables.payload.product],
      });
      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.payload.product],
      });
    },
    onError: (error: Error) => {
      console.error("Review creation failed:", error.message);
    },
  });
};

/**
 * Update review mutation hook
 * @returns Mutation object for updating an existing review
 */
export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: UpdateReviewPayload;
      token: string;
    }) => reviewService.updateReview(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
    },
    onError: (error: Error) => {
      console.error("Review update failed:", error.message);
    },
  });
};

/**
 * Delete review mutation hook
 * @returns Mutation object for deleting a review
 */
export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, token }: { reviewId: string; token: string }) =>
      reviewService.deleteReview(reviewId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
    },
    onError: (error: Error) => {
      console.error("Review deletion failed:", error.message);
    },
  });
};

/**
 * Mark review as helpful mutation hook
 * @returns Mutation object for marking review as helpful
 */
export const useMarkReviewHelpfulMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, token }: { reviewId: string; token: string }) =>
      reviewService.markReviewHelpful(reviewId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => {
      console.error("Mark review helpful failed:", error.message);
    },
  });
};

