/**
 * Order Tracking Screen
 * Shows full tracking timeline, delivery partner info, and rating form
 * Accessed via trackingId parameter
 */

import React from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

import { Screen } from "@/components/layout/Screen";
import { BackButton } from "@/components/ui";
import Button from "@/components/ui/Button";
import {
  TrackingTimeline,
  DeliveryPartnerCard,
  RateDelivery,
} from "@/components/tracking";
import { useOrderTracking } from "@/hooks/queries/useTracking";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";

export default function TrackingScreen() {
  const { trackingId: paramTrackingId } = useLocalSearchParams<{
    trackingId?: string;
  }>();
  const router = useRouter();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const [searchId, setSearchId] = useState("");
  const [activeTrackingId, setActiveTrackingId] = useState(
    paramTrackingId ?? "",
  );

  const { data, isLoading, isError, refetch } =
    useOrderTracking(activeTrackingId);

  const handleSearch = () => {
    const trimmed = searchId.trim();
    if (trimmed) {
      setActiveTrackingId(trimmed);
    }
  };

  const getNameString = (name: Record<string, string> | string): string => {
    if (typeof name === "string") return name;
    return name?.en || Object.values(name)[0] || "Delivery Partner";
  };

  // If no tracking ID, show search form
  if (!activeTrackingId) {
    return (
      <Screen className="bg-slate-50">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 40,
          }}
        >
          <BackButton subTitle="Track Order" />
          <View className="mt-6">
            {/* Hero card */}
            <View
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
              style={{
                shadowColor: "#0f766e",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 6,
              }}
            >
              <View
                className="items-center px-6 py-10"
                style={{ backgroundColor: "#0f766e" }}
              >
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white/20">
                  <Feather name="package" size={40} color="#fff" />
                </View>
                <Text className="text-center text-2xl font-black text-white">
                  Track Your Order
                </Text>
                <Text className="mt-2 text-center text-sm text-white/70">
                  Enter your tracking ID to see real-time delivery updates
                </Text>
              </View>

              <View className="px-6 py-6">
                <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tracking ID
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-1 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                    <Feather name="search" size={18} color="#94a3b8" />
                    <TextInput
                      value={searchId}
                      onChangeText={setSearchId}
                      placeholder="KB-20250101-A1B2C3"
                      placeholderTextColor="#cbd5e1"
                      className="ml-3 flex-1 py-4 text-sm text-slate-700"
                      returnKeyType="search"
                      onSubmitEditing={handleSearch}
                      autoCapitalize="characters"
                    />
                  </View>
                  <Pressable
                    onPress={handleSearch}
                    className="h-14 w-14 items-center justify-center rounded-2xl active:opacity-80"
                    style={{ backgroundColor: "#0f766e" }}
                  >
                    <Feather name="arrow-right" size={22} color="#fff" />
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => router.push("/orders")}
                  className="mt-5 flex-row items-center justify-center gap-2 active:opacity-60"
                >
                  <Feather name="list" size={14} color="#0f766e" />
                  <Text className="text-sm font-semibold text-teal-700">
                    Find tracking ID in your orders
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Screen className="items-center justify-center bg-slate-50">
        <View className="items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-teal-50">
            <ActivityIndicator size="large" color="#0f766e" />
          </View>
          <Text className="text-sm font-semibold text-slate-500">
            Finding your order...
          </Text>
        </View>
      </Screen>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <Screen className="bg-slate-50 px-5 pt-24">
        <BackButton subTitle="Track Order" />
        <View
          className="mt-6 rounded-3xl bg-white p-8 shadow-lg"
          style={{
            shadowColor: "#ef4444",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Feather name="alert-circle" size={28} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-slate-900">
            Order Not Found
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-slate-600">
            We couldn't find an order with tracking ID{" "}
            <Text className="font-bold">{activeTrackingId}</Text>. Please check
            and try again.
          </Text>
          <Button
            variant="outline"
            title="Try Another ID"
            className="mt-6"
            onPress={() => setActiveTrackingId("")}
          />
        </View>
      </Screen>
    );
  }

  const { order, tracking, deliveryBoy } = data;
  const isDelivered = tracking?.status === "delivered";

  return (
    <Screen edges={["bottom"]} className="bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
          paddingTop: 8,
          paddingHorizontal: 12,
        }}
      >
        <View className="px-1">
          <BackButton
            subTitle="Track Order"
            subDescription={`Tracking ID: ${tracking?.trackingId ?? activeTrackingId}`}
          />
          <View className="h-4" />

          {/* Order Summary Card */}
          <View
            className="mb-4 overflow-hidden rounded-3xl bg-white shadow-lg"
            style={{
              shadowColor: "#0f766e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View
              className="px-5 py-5"
              style={{
                backgroundColor:
                  order.status === "delivered"
                    ? "#10b981"
                    : order.status === "pending"
                      ? "#f59e0b"
                      : order.status === "processing"
                        ? "#3b82f6"
                        : order.status === "out-for-delivery"
                          ? "#14b8a6"
                          : "#64748b",
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    Invoice #{order.invoice}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 28,
                      fontWeight: "900",
                      marginTop: 6,
                    }}
                  >
                    {formatCurrency(order.total, currency)}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 13,
                      marginTop: 8,
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <View
                  className="items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }}
                >
                  <Feather
                    name={
                      isDelivered
                        ? "check-circle"
                        : tracking?.status === "on-the-way" ||
                            tracking?.status === "nearby"
                          ? "truck"
                          : "package"
                    }
                    size={26}
                    color="#fff"
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: "700",
                      marginTop: 6,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {tracking?.status?.replace(/-/g, " ") ?? order.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Shipping address */}
            <View className="px-5 py-4">
              <View className="flex-row items-center gap-2">
                <Feather name="map-pin" size={14} color="#64748b" />
                <Text
                  className="flex-1 text-xs text-slate-500"
                  numberOfLines={2}
                >
                  {[
                    order.user_info?.address,
                    order.user_info?.city,
                    order.user_info?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            </View>
          </View>

          {/* Estimated Delivery */}
          {tracking?.estimatedDelivery && !isDelivered && (
            <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <Feather name="clock" size={20} color="#d97706" />
              <View className="flex-1">
                <Text className="text-xs font-medium text-amber-600">
                  Estimated Delivery
                </Text>
                <Text className="text-sm font-bold text-amber-800">
                  {new Date(tracking.estimatedDelivery).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </Text>
              </View>
            </View>
          )}

          {/* Tracking Timeline */}
          {tracking?.history && tracking.history.length > 0 && (
            <View
              className="mb-4 rounded-3xl bg-white p-5 shadow-lg"
              style={{
                shadowColor: "#0f766e",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View className="mb-5 flex-row items-center gap-2">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                  <Feather name="activity" size={20} color="#0f766e" />
                </View>
                <Text className="text-lg font-bold text-slate-900">
                  Tracking Timeline
                </Text>
              </View>

              <TrackingTimeline history={tracking.history} />
            </View>
          )}

          {/* Delivery Partner Card */}
          {deliveryBoy && (
            <View className="mb-4">
              <DeliveryPartnerCard deliveryBoy={deliveryBoy} />
            </View>
          )}

          {/* Rate Delivery */}
          {isDelivered && deliveryBoy && (
            <View className="mb-4">
              <RateDelivery
                orderId={order._id}
                deliveryBoyName={getNameString(deliveryBoy.name)}
                existingRating={
                  (order as any).deliveryRating
                    ? {
                        rating: (order as any).deliveryRating.rating,
                        review: (order as any).deliveryRating.review,
                      }
                    : undefined
                }
              />
            </View>
          )}

          {/* Order Items Summary */}
          {order.cart && order.cart.length > 0 && (
            <View
              className="mb-4 rounded-3xl bg-white p-5 shadow-lg"
              style={{
                shadowColor: "#0f766e",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View className="mb-4 flex-row items-center gap-2">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                  <Feather name="shopping-bag" size={20} color="#0f766e" />
                </View>
                <Text className="text-lg font-bold text-slate-900">
                  Order Items ({order.cart.length})
                </Text>
              </View>

              <View className="gap-2">
                {order.cart.slice(0, 5).map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
                  >
                    <View className="flex-1 pr-3">
                      <Text
                        className="text-sm font-medium text-slate-700"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-xs text-slate-400">
                        Qty: {item.quantity} ×{" "}
                        {formatCurrency(item.price, currency)}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-slate-700">
                      {formatCurrency(item.price * item.quantity, currency)}
                    </Text>
                  </View>
                ))}
                {order.cart.length > 5 && (
                  <Text className="text-center text-xs text-slate-400">
                    +{order.cart.length - 5} more items
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* View Full Order Button */}
          <Button
            variant="outline"
            title="View Full Order Details"
            onPress={() =>
              router.push({
                pathname: "/orders/[id]",
                params: { id: order._id },
              })
            }
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
