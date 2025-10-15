import Constants from "expo-constants";
import { Platform } from "react-native";

const sanitizeUrl = (value?: string | null) =>
  value ? value.replace(/\/$/, "") : undefined;

const resolveDevBaseUrl = () => {
  const expoGoConfig = (Constants as unknown as { expoGoConfig?: Record<string, string> }).expoGoConfig ?? {};
  const hostUri =
    Constants.expoConfig?.hostUri ??
    expoGoConfig.hostUri ??
    expoGoConfig.debuggerHost ??
    null;

  if (!hostUri) return undefined;

  const host = hostUri.split(":")[0];
  if (!host) return undefined;

  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const devPort =
    (extra.apiPort as string | undefined) ??
    process.env.EXPO_PUBLIC_API_PORT ??
    process.env.EXPO_PUBLIC_BACKEND_PORT ??
    "5000";

  // On Android emulators, Expo exposes the Metro host. Use Android loopback.
  if (Platform.OS === "android" && host === "localhost") {
    return `http://10.0.2.2:${devPort}/v1`;
  }

  if (host === "localhost" || host === "127.0.0.1") {
    return `http://127.0.0.1:${devPort}/v1`;
  }

  return `http://${host}:${devPort}/v1`;
};

const envBaseUrl =
  sanitizeUrl(Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  sanitizeUrl(process.env.EXPO_PUBLIC_API_BASE_URL) ??
  sanitizeUrl(process.env.EXPO_PUBLIC_BASE_URL);

export const API_BASE_URL = envBaseUrl ?? resolveDevBaseUrl() ?? "http://127.0.0.1:5000/v1";

export const SECURE_STORAGE_KEYS = {
  accessToken: "@kachabazar/accessToken",
  refreshToken: "@kachabazar/refreshToken",
  user: "@kachabazar/user",
  cart: "@kachabazar/cart",
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
  wishlist: "wishlist",
} as const;

export const DEFAULT_PAGE_SIZE = 20;
