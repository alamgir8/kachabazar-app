export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000/v1";

export const SECURE_STORAGE_KEYS = {
  accessToken: "@kachabazar/accessToken",
  refreshToken: "@kachabazar/refreshToken",
  user: "@kachabazar/user",
  cart: "@kachabazar/cart"
} as const;

export const QUERY_KEYS = {
  settings: "settings",
  global: "global-setting",
  categories: "categories",
  products: "products",
  product: "product",
  popularProducts: "popular-products",
  discountedProducts: "discounted-products",
  orders: "orders",
  order: "order",
  shippingAddress: "shipping-address",
  wishlist: "wishlist"
} as const;

export const DEFAULT_PAGE_SIZE = 20;
