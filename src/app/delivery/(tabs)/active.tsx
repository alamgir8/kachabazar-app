import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import {
  useCurrentOrder,
  useUpdateTrackingStatus,
} from "@/hooks/queries/useDelivery";

const TRACKING_STATUSES = [
  {
    value: "confirmed",
    label: "Confirmed",
    icon: "check-circle" as const,
    color: "#3b82f6",
  },
  {
    value: "preparing",
    label: "Preparing",
    icon: "clock" as const,
    color: "#8b5cf6",
  },
  {
    value: "ready-for-pickup",
    label: "Ready for Pickup",
    icon: "package" as const,
    color: "#06b6d4",
  },
  {
    value: "picked-up",
    label: "Picked Up",
    icon: "shopping-bag" as const,
    color: "#f59e0b",
  },
  {
    value: "on-the-way",
    label: "On the Way",
    icon: "truck" as const,
    color: "#ea580c",
  },
  {
    value: "nearby",
    label: "Nearby",
    icon: "map-pin" as const,
    color: "#ec4899",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: "check" as const,
    color: "#22c55e",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: "x" as const,
    color: "#ef4444",
  },
] as const;

export default function ActiveDeliveryScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useCurrentOrder();
  const updateStatus = useUpdateTrackingStatus();
  const [updatingTo, setUpdatingTo] = useState<string | null>(null);

  const order = data?.order;
  const tracking = data?.tracking;
  const currentStatus = tracking?.status || "order-placed";

  const handleStatusUpdate = (newStatus: string, label: string) => {
    if (!order) return;

    const message =
      newStatus === "delivered"
        ? "Mark this order as delivered? This action cannot be undone."
        : newStatus === "cancelled"
          ? "Cancel this delivery? This action cannot be undone."
          : `Update status to "${label}"?`;

    Alert.alert("Update Status", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          setUpdatingTo(newStatus);
          try {
            await updateStatus.mutateAsync({
              orderId: order._id,
              trackingStatus: newStatus,
            });
            Alert.alert("Success", `Status updated to ${label}`);
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to update status");
          } finally {
            setUpdatingTo(null);
          }
        },
      },
    ]);
  };

  const callCustomer = () => {
    const phone = order?.user_info?.contact;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  if (isLoading) {
    return (
      <Screen edges={["bottom"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen edges={["bottom"]}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-20 w-20 rounded-full bg-slate-100 items-center justify-center mb-4">
            <MaterialCommunityIcons
              name="bike-fast"
              size={40}
              color="#cbd5e1"
            />
          </View>
          <Text className="text-lg font-bold text-slate-700 text-center">
            No Active Delivery
          </Text>
          <Text className="text-sm text-slate-500 text-center mt-2">
            You don't have any active delivery right now. Check your orders list
            for assigned deliveries.
          </Text>
          <Pressable
            onPress={() => router.push("/delivery/(tabs)/orders")}
            className="mt-6 rounded-2xl bg-orange-500 px-6 py-3"
          >
            <Text className="text-sm font-bold text-white">
              View All Orders
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // Determine which statuses are available as next steps
  const currentIndex = TRACKING_STATUSES.findIndex(
    (s) => s.value === currentStatus,
  );

  return (
    <Screen scrollable edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Order Header */}
        <LinearGradient
          colors={["#ea580c", "#f97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl p-5 mb-4"
          style={{ marginHorizontal: -4 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-white">
              Order #{order.invoice}
            </Text>
            <View className="rounded-full bg-white/20 px-3 py-1">
              <Text className="text-xs font-bold text-white uppercase">
                {currentStatus.replace(/-/g, " ")}
              </Text>
            </View>
          </View>
          {order.trackingId && (
            <View className="flex-row items-center">
              <Feather
                name="navigation"
                size={12}
                color="rgba(255,255,255,0.7)"
              />
              <Text className="ml-1 text-xs text-white/70 font-mono">
                {order.trackingId}
              </Text>
            </View>
          )}
          <Text className="text-white text-xl font-bold mt-2">
            ${order.total?.toFixed(2)}
          </Text>
        </LinearGradient>

        {/* Customer Info */}
        <View
          className="rounded-2xl bg-white p-4 mb-4"
          style={{
            shadowColor: "#94a3b8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text className="text-sm font-bold text-slate-800 mb-3">
            Customer Details
          </Text>
          <View className="gap-2">
            <View className="flex-row items-center">
              <Feather name="user" size={14} color="#64748b" />
              <Text className="ml-2 text-sm text-slate-700">
                {order.user_info?.name}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="map-pin" size={14} color="#64748b" />
              <Text className="ml-2 text-sm text-slate-600 flex-1">
                {order.user_info?.address}, {order.user_info?.city},{" "}
                {order.user_info?.country} {order.user_info?.zipCode}
              </Text>
            </View>
            {order.user_info?.contact && (
              <Pressable
                onPress={callCustomer}
                className="flex-row items-center"
              >
                <Feather name="phone" size={14} color="#0d9488" />
                <Text className="ml-2 text-sm text-teal-600 font-semibold">
                  {order.user_info.contact}
                </Text>
                <Text className="ml-1 text-xs text-teal-500">Tap to call</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Update Status */}
        <View
          className="rounded-2xl bg-white p-4 mb-4"
          style={{
            shadowColor: "#94a3b8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text className="text-sm font-bold text-slate-800 mb-3">
            Update Delivery Status
          </Text>
          <View className="gap-2">
            {TRACKING_STATUSES.map((status, index) => {
              const isPast = index <= currentIndex;
              const isCurrent = status.value === currentStatus;
              const isNext = index === currentIndex + 1;
              const isAvailable = index > currentIndex;
              const isDeliveredOrCancelled =
                currentStatus === "delivered" || currentStatus === "cancelled";

              // Skip non-adjacent future statuses (allow next + delivered/cancelled)
              if (
                isDeliveredOrCancelled ||
                (!isPast &&
                  !isNext &&
                  status.value !== "delivered" &&
                  status.value !== "cancelled")
              ) {
                if (!isPast && !isCurrent) return null;
              }

              return (
                <Pressable
                  key={status.value}
                  onPress={() =>
                    isAvailable && !isDeliveredOrCancelled
                      ? handleStatusUpdate(status.value, status.label)
                      : null
                  }
                  disabled={
                    !isAvailable ||
                    isDeliveredOrCancelled ||
                    updatingTo !== null
                  }
                  className={`flex-row items-center rounded-xl p-3 ${
                    isCurrent
                      ? "bg-orange-50 border-2 border-orange-300"
                      : isPast
                        ? "bg-slate-50"
                        : isNext
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-slate-50 opacity-60"
                  }`}
                >
                  <View
                    className="h-8 w-8 rounded-full items-center justify-center"
                    style={{
                      backgroundColor:
                        isPast || isCurrent ? status.color + "20" : "#f1f5f9",
                    }}
                  >
                    {updatingTo === status.value ? (
                      <ActivityIndicator size="small" color={status.color} />
                    ) : (
                      <Feather
                        name={
                          isPast && !isCurrent ? "check-circle" : status.icon
                        }
                        size={16}
                        color={isPast || isCurrent ? status.color : "#94a3b8"}
                      />
                    )}
                  </View>
                  <Text
                    className={`ml-3 text-sm font-semibold ${
                      isCurrent
                        ? "text-orange-700"
                        : isPast
                          ? "text-slate-500"
                          : "text-slate-700"
                    }`}
                  >
                    {status.label}
                  </Text>
                  {isCurrent && (
                    <View className="ml-auto rounded-full bg-orange-500 px-2 py-0.5">
                      <Text className="text-[9px] font-bold text-white">
                        CURRENT
                      </Text>
                    </View>
                  )}
                  {isNext && !isDeliveredOrCancelled && (
                    <View className="ml-auto rounded-full bg-blue-500 px-2 py-0.5">
                      <Text className="text-[9px] font-bold text-white">
                        NEXT →
                      </Text>
                    </View>
                  )}
                  {isPast && !isCurrent && (
                    <Feather
                      name="check"
                      size={14}
                      color="#22c55e"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Tracking History */}
        {tracking?.history && tracking.history.length > 0 && (
          <View
            className="rounded-2xl bg-white p-4"
            style={{
              shadowColor: "#94a3b8",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text className="text-sm font-bold text-slate-800 mb-3">
              Tracking History
            </Text>
            {[...tracking.history].reverse().map((entry, i) => (
              <View key={i} className="flex-row mb-3">
                <View className="items-center mr-3">
                  <View className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  {i < tracking.history.length - 1 && (
                    <View className="w-0.5 flex-1 bg-slate-200 mt-1" />
                  )}
                </View>
                <View className="flex-1 pb-3">
                  <Text className="text-xs font-semibold text-slate-700 capitalize">
                    {entry.status.replace(/-/g, " ")}
                  </Text>
                  <Text className="text-[10px] text-slate-500 mt-0.5">
                    {entry.message}
                  </Text>
                  {entry.location?.address && (
                    <Text className="text-[10px] text-slate-400 mt-0.5">
                      📍 {entry.location.address}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
