import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQuery } from "@tanstack/react-query";

import { applyCoupon, getShowingCoupons, type Coupon } from "@/services/coupons";
import { formatCurrency } from "@/utils";
import { HapticFeedback } from "@/utils/accessibility";
import { analytics } from "@/utils/analytics";
import { QUERY_KEYS } from "@/constants";

interface CouponSectionProps {
  cartTotal: number;
  onCouponApplied: (discount: number, coupon: Coupon | null) => void;
  appliedCoupon: Coupon | null;
  currency: string;
  token?: string;
}

/**
 * Coupon Section Component for Checkout
 * Allows users to apply discount coupons
 */
export const CouponSection: React.FC<CouponSectionProps> = ({
  cartTotal,
  onCouponApplied,
  appliedCoupon,
  currency,
  token,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const { data: couponsData } = useQuery({
    queryKey: [QUERY_KEYS.coupons, "show"],
    queryFn: () => getShowingCoupons(token),
    enabled: showAvailableCoupons,
  });

  const applyCouponMutation = useMutation({
    mutationFn: (code: string) =>
      applyCoupon({ couponCode: code, cartTotal }, token),
    onSuccess: (response) => {
      if (response.valid && response.discount && response.coupon) {
        HapticFeedback.success();
        onCouponApplied(response.discount, response.coupon);
        analytics.trackEvent("coupon_applied", {
          coupon_code: couponCode,
          discount: response.discount,
        });
        Alert.alert("Success", `Coupon applied! You saved ${formatCurrency(response.discount, currency)}`);
        setCouponCode("");
      } else {
        HapticFeedback.error();
        Alert.alert("Invalid Coupon", response.message || "This coupon cannot be applied.");
      }
    },
    onError: (error: any) => {
      HapticFeedback.error();
      Alert.alert("Error", error.message || "Failed to apply coupon");
    },
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert("Error", "Please enter a coupon code");
      return;
    }
    applyCouponMutation.mutate(couponCode.trim().toUpperCase());
  };

  const handleRemoveCoupon = () => {
    onCouponApplied(0, null);
    setCouponCode("");
    HapticFeedback.light();
  };

  const availableCoupons = couponsData?.coupons?.filter(
    (coupon) => cartTotal >= coupon.minimumAmount
  ) || [];

  return (
    <View className="mb-4">
      {appliedCoupon ? (
        <View className="rounded-[28px] border-2 border-emerald-200 bg-emerald-50/60 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Feather name="check-circle" size={18} color="#059669" />
                <Text className="text-sm font-bold text-emerald-700">
                  Coupon Applied
                </Text>
              </View>
              <Text className="text-xs text-emerald-600">
                {appliedCoupon.couponCode} -{" "}
                {appliedCoupon.discountType.type === "fixed"
                  ? formatCurrency(appliedCoupon.discountType.value, currency)
                  : `${appliedCoupon.discountType.value}%`}{" "}
                off
              </Text>
            </View>
            <Pressable
              onPress={handleRemoveCoupon}
              className="h-8 w-8 items-center justify-center rounded-full bg-emerald-100 active:bg-emerald-200"
            >
              <Feather name="x" size={16} color="#059669" />
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="rounded-[28px] border border-slate-200 bg-white/70 px-4 py-4">
          <View className="mb-3 flex-row items-center gap-2">
            <Feather name="tag" size={16} color="#10b981" />
            <Text className="text-sm font-semibold text-slate-700">
              Have a coupon code?
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Enter coupon code"
              placeholderTextColor="#94a3b8"
              className="flex-1 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
              autoCapitalize="characters"
            />
            <Pressable
              onPress={handleApplyCoupon}
              disabled={applyCouponMutation.isPending || !couponCode.trim()}
              className="rounded-[24px] bg-primary-500 px-6 py-3 active:bg-primary-600 disabled:opacity-50"
            >
              {applyCouponMutation.isPending ? (
                <Feather name="loader" size={18} color="#ffffff" />
              ) : (
                <Text className="text-sm font-semibold text-white">Apply</Text>
              )}
            </Pressable>
          </View>

          {availableCoupons.length > 0 && (
            <Pressable
              onPress={() => setShowAvailableCoupons(!showAvailableCoupons)}
              className="mt-3 flex-row items-center gap-2"
            >
              <Text className="text-xs font-medium text-primary-600">
                {showAvailableCoupons
                  ? "Hide available coupons"
                  : `View ${availableCoupons.length} available coupon${availableCoupons.length > 1 ? "s" : ""}`}
              </Text>
              <Feather
                name={showAvailableCoupons ? "chevron-up" : "chevron-down"}
                size={14}
                color="#10b981"
              />
            </Pressable>
          )}

          {showAvailableCoupons && availableCoupons.length > 0 && (
            <View className="mt-3 gap-2">
              {availableCoupons.map((coupon) => (
                <Pressable
                  key={coupon._id}
                  onPress={() => {
                    setCouponCode(coupon.couponCode);
                    handleApplyCoupon();
                  }}
                  className="flex-row items-center justify-between rounded-xl border border-primary-200 bg-primary-50/50 px-3 py-2.5"
                >
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-primary-700">
                      {coupon.couponCode}
                    </Text>
                    <Text className="mt-0.5 text-[10px] text-primary-600">
                      {coupon.discountType.type === "fixed"
                        ? formatCurrency(coupon.discountType.value, currency)
                        : `${coupon.discountType.value}%`}{" "}
                      off • Min. {formatCurrency(coupon.minimumAmount, currency)}
                    </Text>
                  </View>
                  <Feather name="arrow-right" size={14} color="#10b981" />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

