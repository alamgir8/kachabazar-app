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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";

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
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch } = useOrderTrackingHistory(id!);
  const updateStatus = useUpdateTrackingStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading || !data) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
          paddingTop: insets.top,
        }}
      >
        <ActivityIndicator size="large" color="#f97316" />
      </View>
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#fafafa",
        paddingTop: insets.top,
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back + Title */}
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            paddingVertical: 8,
          }}
        >
          <Feather name="arrow-left" size={20} color="#64748b" />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "700",
              color: "#334155",
            }}
          >
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
          style={{
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 11,
              fontWeight: "500",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Current Status
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "800",
              marginTop: 4,
              textTransform: "capitalize",
            }}
          >
            {currentStatus.replace(/-/g, " ")}
          </Text>
          {order.trackingId && (
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 11,
                marginTop: 8,
                fontFamily: "monospace",
              }}
            >
              Tracking: {order.trackingId}
            </Text>
          )}
        </LinearGradient>

        {/* Next Action */}
        {!isTerminal && nextStatus && (
          <Pressable
            onPress={handleNext}
            disabled={isUpdating}
            style={{ marginBottom: 12, borderRadius: 16, overflow: "hidden" }}
          >
            <LinearGradient
              colors={
                isUpdating ? ["#fdba74", "#fdba74"] : ["#ea580c", "#f97316"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
              }}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "white",
                      marginRight: 8,
                    }}
                  >
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
          style={{
            borderRadius: 20,
            backgroundColor: "white",
            padding: 16,
            marginBottom: 12,
            shadowColor: "#94a3b8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: 12,
            }}
          >
            Delivery To
          </Text>
          {order.deliveryBoyName && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="user" size={14} color="#64748b" />
              <Text style={{ marginLeft: 8, fontSize: 14, color: "#334155" }}>
                {order.deliveryBoyName}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Feather name="calendar" size={14} color="#64748b" />
            <Text style={{ marginLeft: 8, fontSize: 13, color: "#475569" }}>
              {format(new Date(order.createdAt), "MMM dd, yyyy 'at' h:mm a")}
            </Text>
          </View>
        </View>

        {/* Tracking History */}
        {tracking?.history && tracking.history.length > 0 && (
          <View
            style={{
              borderRadius: 20,
              backgroundColor: "white",
              padding: 16,
              marginBottom: 12,
              shadowColor: "#94a3b8",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: 12,
              }}
            >
              Timeline
            </Text>
            {[...tracking.history].reverse().map((entry, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 12 }}>
                <View style={{ alignItems: "center", marginRight: 12 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: i === 0 ? "#ea580c" : "#cbd5e1",
                    }}
                  />
                  {i < tracking.history.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        backgroundColor: "#e2e8f0",
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: 4 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#334155",
                      textTransform: "capitalize",
                    }}
                  >
                    {entry.status.replace(/-/g, " ")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      marginTop: 2,
                    }}
                  >
                    {entry.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      marginTop: 2,
                    }}
                  >
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
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#fecaca",
              backgroundColor: "#fef2f2",
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#dc2626" }}>
              Cancel Delivery
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
