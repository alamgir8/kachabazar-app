import { http } from "./http";

// Coupon Types
export interface Coupon {
  _id: string;
  title: Record<string, string>;
  couponCode: string;
  endTime: string;
  discountType: {
    type: "percentage" | "fixed";
    value: number;
  };
  minimumAmount: number;
  productType: string;
  logo?: string;
  status: "show" | "hide";
  createdAt: string;
  updatedAt: string;
}

export interface CouponsResponse {
  coupons: Coupon[];
  totalCoupons: number;
}

export interface ApplyCouponPayload {
  couponCode: string;
  cartTotal: number;
}

export interface ApplyCouponResponse {
  valid: boolean;
  message: string;
  discount?: number;
  coupon?: Coupon;
}

// Get all showing coupons
export const getShowingCoupons = (token?: string) =>
  http.get<CouponsResponse>("/coupons/show", { token: token || undefined });

// Get all coupons
export const getAllCoupons = (page = 1, limit = 20, token?: string) =>
  http.get<CouponsResponse>(`/coupons?page=${page}&limit=${limit}`, {
    token: token || undefined,
  });

// Get coupon by ID
export const getCouponById = (id: string, token?: string) =>
  http.get<Coupon>(`/coupons/${id}`, { token: token || undefined });

// Validate and apply coupon
export const applyCoupon = (payload: ApplyCouponPayload, token?: string) =>
  http.post<ApplyCouponResponse>("/coupons/apply", payload, {
    token: token || undefined,
  });

// Get user's available coupons
export const getUserCoupons = (token: string) =>
  http.get<CouponsResponse>("/coupons/user", { token });
