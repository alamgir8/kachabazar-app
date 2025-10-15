import { http } from "./http";

// Review Types
export interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  comment: string;
  images?: string[];
  helpful?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface AddReviewPayload {
  product: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface UpdateReviewPayload {
  reviewId: string;
  rating?: number;
  comment?: string;
  images?: string[];
}

// Get reviews for a product
export const getReviewsByProduct = (
  productId: string,
  page = 1,
  limit = 10,
  token?: string
) =>
  http.get<ReviewsResponse>(
    `/reviews/${productId}?page=${page}&limit=${limit}`,
    { token: token || undefined }
  );

// Add a review
export const addReview = (payload: AddReviewPayload, token: string) =>
  http.post<{ message: string; review: Review }>("/reviews", payload, {
    token,
  });

// Update a review
export const updateReview = (payload: UpdateReviewPayload, token: string) =>
  http.put<{ message: string; review: Review }>("/reviews", payload, {
    token,
  });

// Delete a review
export const deleteReview = (reviewId: string, token: string) =>
  http.delete<{ message: string }>(`/reviews/${reviewId}`, { token });

// Get user's purchased products (for review eligibility)
export const getUserPurchasedProducts = (token: string) =>
  http.get<{ products: string[] }>("/reviews/purchased-products", { token });

// Mark review as helpful
export const markReviewHelpful = (reviewId: string, token: string) =>
  http.post<{ message: string }>(`/reviews/${reviewId}/helpful`, undefined, {
    token,
  });
