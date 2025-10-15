import { http } from "./http";

// Wishlist Types
export interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    title: Record<string, string>;
    slug: string;
    image: string[];
    prices: {
      originalPrice: number;
      price: number;
      discount?: number;
    };
    stock: number;
    average_rating: number;
  };
  addedAt: string;
}

export interface WishlistResponse {
  wishlist: WishlistItem[];
  total: number;
}

// Get user's wishlist
export const getWishlist = (token: string) =>
  http.get<WishlistResponse>("/wishlist", { token });

// Add item to wishlist
export const addToWishlist = (productId: string, token: string) =>
  http.post<{ message: string; wishlist: WishlistItem[] }>(
    "/wishlist/add",
    { productId },
    { token }
  );

// Remove item from wishlist
export const removeFromWishlist = (productId: string, token: string) =>
  http.delete<{ message: string }>(`/wishlist/${productId}`, { token });

// Check if product is in wishlist
export const isInWishlist = (productId: string, token: string) =>
  http.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`, { token });

// Clear wishlist
export const clearWishlist = (token: string) =>
  http.delete<{ message: string }>("/wishlist/clear", { token });

// Move wishlist item to cart
export const moveToCart = (productId: string, token: string) =>
  http.post<{ message: string }>(
    "/wishlist/move-to-cart",
    { productId },
    { token }
  );
