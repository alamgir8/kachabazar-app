import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";

import { Screen } from "@/components/layout/Screen";
import {
  useOrderTrackingHistory,
  useUpdateTrackingStatus,
} from "@/hooks/queries/useDelivery";

const NEXT_STATUS_MAP: Record<string, { value: string; label: string }> = {
  "order-placed": { value: "confirmed", label: "Confirm Order" },
  confirmed: { value: "preparing", label: "Start Preparing" },
  preparing: { value: "ready-for-pickup", label: "Ready for Pickup" },
  "ready-for-pickup": { value: "picked-up", label: "Mark as Picked Up" },
  "picked-up": { value: "on-the-way", label: "On the Way" },
  "on-the-way": { value: "nearby", label: "Almost There" },
  nearby: { value: "delivered", label: "Mark Delivered ✓" },
};

export default function DeliveryOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, refetch } = useOrderTrackingHistory(id!);
  const updateStatus = useUpdateTrackingStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading || !data) {
    return (
      <Screen edges={["bottom"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      </Screen>
    );
  }

  const { order, tracking } = data;
  const currentStatus = tracking?.status || "order-placed";
  const nextStatus = NEXT_STATUS_MAP[currentStatus];
  const isTerminal =
    currentStatus === "delivered" || currentStatus === "cancelled";

  const handleNext = () => {
    if (!nextStatus || !order) return;

    Alert.alert("Update Status", `Set order to "${nextStatus.label}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          setIsUpdating(true);
          try {
            await updateStatus.mutateAsync({
              orderId: order._id,
              trackingStatus: nextStatus.value,
            });
            refetch();
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to update");
          } finally {
            setIsUpdating(false);
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Delivery",
      "Are you sure you want to cancel this delivery?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setIsUpdating(true);
            try {
              await updateStatus.mutateAsync({
                orderId: order._id,
                trackingStatus: "cancelled",
              });
              refetch();
            } catch (err: any) {
              Alert.alert("Error", err.message);
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Screen scrollable edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back + Title */}
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <Feather name="arrow-left" size={20} color="#64748b" />
          <Text className="ml-2 text-base font-bold text-slate-700">
            Order #{order.invoice}
          </Text>
        </Pressable>

        {/* Status Banner */}
        <LinearGradient
          colors={
            isTerminal && currentStatus === "delivered"
              ? ["#22c55e", "#16a34a"]
              : isTerminal
                ? ["#ef4444", "#dc2626"]
                : ["#ea580c", "#f97316"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl p-5 mb-4"
        >
          <Text className="text-white/70 text-xs font-medium uppercase tracking-wider">
            Current Status
          </Text>
          <Text className="text-white text-xl font-bold mt-1 capitalize">
            {currentStatus.replace(/-/g, " ")}
          </Text>
          {order.trackingId && (
            <Text className="text-white/60 text-xs mt-2 font-mono">
              Tracking: {order.trackingId}
            </Text>
          )}
        </LinearGradient>

        {/* Next Action */}
        {!isTerminal && nextStatus && (
          <Pressable
            onPress={handleNext}
            disabled={isUpdating}
            className="mb-4 overflow-hidden rounded-2xl"
          >
            <LinearGradient
              colors={
                isUpdating ? ["#fdba74", "#fdba74"] : ["#ea580c", "#f97316"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 px-5 flex-row items-center justify-center"
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text className="text-base font-bold text-white mr-2">
                    {nextStatus.label}
                  </Text>
                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}

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
            Delivery To
          </Text>
          {order.deliveryBoyName && (
            <View className="flex-row items-center mb-2">
              <Feather name="user" size={14} color="#64748b" />
              <Text className="ml-2 text-sm text-slate-700">
                {order.deliveryBoyName}
              </Text>
            </View>
          )}
          <View className="flex-row items-center mb-2">
            <Feather name="calendar" size={14} color="#64748b" />
            <Text className="ml-2 text-sm text-slate-600">
              {format(new Date(order.createdAt), "MMM dd, yyyy 'at' h:mm a")}
            </Text>
          </View>
        </View>

        {/* Tracking History */}
        {tracking?.history && tracking.history.length > 0 && (
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
              Timeline
            </Text>
            {[...tracking.history].reverse().map((entry, i) => (
              <View key={i} className="flex-row mb-3">
                <View className="items-center mr-3">
                  <View
                    className={`h-3 w-3 rounded-full ${
                      i === 0 ? "bg-orange-500" : "bg-slate-300"
                    }`}
                  />
                  {i < tracking.history.length - 1 && (
                    <View className="w-0.5 flex-1 bg-slate-200 mt-1" />
                  )}
                </View>
                <View className="flex-1 pb-3">
                  <Text className="text-xs font-bold text-slate-700 capitalize">
                    {entry.status.replace(/-/g, " ")}
                  </Text>
                  <Text className="text-[10px] text-slate-500 mt-0.5">
                    {entry.message}
                  </Text>
                  <Text className="text-[10px] text-slate-400 mt-0.5">
                    {format(new Date(entry.timestamp), "MMM dd, h:mm a")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Cancel button */}
        {!isTerminal && (
          <Pressable
            onPress={handleCancel}
            disabled={isUpdating}
            className="rounded-2xl border border-red-200 bg-red-50 py-3 items-center"
          >
            <Text className="text-sm font-semibold text-red-600">
              Cancel Delivery
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
}
