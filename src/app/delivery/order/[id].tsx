import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
import { DELIVERY_COLORS } from "@/constants/deliveryTheme";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

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
  const [commentModal, setCommentModal] = useState<{
    visible: boolean;
    status: string;
    label: string;
  }>({ visible: false, status: "", label: "" });
  const [comment, setComment] = useState("");

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
        <ActivityIndicator size="large" color={DELIVERY_COLORS.primaryLight} />
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
    setComment("");
    setCommentModal({
      visible: true,
      status: nextStatus.value,
      label: nextStatus.label,
    });
  };

  const confirmStatusUpdate = async () => {
    if (!order) return;
    const targetStatus = commentModal.status;
    setCommentModal({ visible: false, status: "", label: "" });
    setIsUpdating(true);
    try {
      await updateStatus.mutateAsync({
        orderId: order._id,
        trackingStatus: targetStatus,
        message: comment.trim() || undefined,
      });
      refetch();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update");
    } finally {
      setIsUpdating(false);
      setComment("");
    }
  };

  const handleCancel = () => {
    setComment("");
    setCommentModal({
      visible: true,
      status: "cancelled",
      label: "Cancel Delivery",
    });
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
        <ScreenHeader title={`Order #${order.invoice}`} />

        {/* Status Banner */}
        <LinearGradient
          colors={
            isTerminal && currentStatus === "delivered"
              ? ["#22c55e", "#16a34a"]
              : isTerminal
                ? ["#ef4444", "#dc2626"]
                : DELIVERY_COLORS.gradientHorizontal
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
                isUpdating
                  ? [DELIVERY_COLORS.loadingBg, DELIVERY_COLORS.loadingBg]
                  : DELIVERY_COLORS.gradientHorizontal
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
                      backgroundColor:
                        i === 0 ? DELIVERY_COLORS.primary : "#cbd5e1",
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

      {/* Status Update Modal with Comment */}
      <Modal
        visible={commentModal.visible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setCommentModal({ visible: false, status: "", label: "" })
        }
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={() =>
              setCommentModal({ visible: false, status: "", label: "" })
            }
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                padding: 24,
                paddingBottom: 40,
              }}
            >
              {/* Handle bar */}
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#e2e8f0",
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              />

              {/* Title */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: DELIVERY_COLORS.accentBg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name="send"
                    size={18}
                    color={DELIVERY_COLORS.primary}
                  />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "#1e293b",
                    }}
                  >
                    {commentModal.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginTop: 2,
                    }}
                  >
                    Add an optional note for the customer
                  </Text>
                </View>
              </View>

              {/* Warning for terminal statuses */}
              {(commentModal.status === "delivered" ||
                commentModal.status === "cancelled") && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor:
                      commentModal.status === "delivered"
                        ? "#f0fdf4"
                        : "#fef2f2",
                    borderWidth: 1,
                    borderColor:
                      commentModal.status === "delivered"
                        ? "#bbf7d0"
                        : "#fecaca",
                    borderRadius: 14,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <Feather
                    name="alert-circle"
                    size={16}
                    color={
                      commentModal.status === "delivered"
                        ? "#16a34a"
                        : "#dc2626"
                    }
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 12,
                      color:
                        commentModal.status === "delivered"
                          ? "#166534"
                          : "#991b1b",
                      flex: 1,
                    }}
                  >
                    This action cannot be undone.
                  </Text>
                </View>
              )}

              {/* Comment Input */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: 8,
                  }}
                >
                  Note{" "}
                  <Text style={{ fontWeight: "400", color: "#94a3b8" }}>
                    (optional)
                  </Text>
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="e.g. Left package at the door, slight delay due to traffic..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    borderRadius: 16,
                    backgroundColor: "#f8fafc",
                    padding: 14,
                    fontSize: 14,
                    color: "#0f172a",
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginTop: 6,
                  }}
                >
                  This note will be sent as a notification to the customer.
                </Text>
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={() =>
                    setCommentModal({
                      visible: false,
                      status: "",
                      label: "",
                    })
                  }
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#64748b",
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={confirmStatusUpdate}
                  style={{
                    flex: 2,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <LinearGradient
                    colors={
                      commentModal.status === "cancelled"
                        ? ["#ef4444", "#dc2626"]
                        : commentModal.status === "delivered"
                          ? ["#22c55e", "#16a34a"]
                          : DELIVERY_COLORS.gradientHorizontal
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 14,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      borderRadius: 16,
                    }}
                  >
                    <Feather
                      name={
                        commentModal.status === "cancelled"
                          ? "x-circle"
                          : commentModal.status === "delivered"
                            ? "check-circle"
                            : "arrow-right"
                      }
                      size={16}
                      color="white"
                    />
                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      {commentModal.status === "cancelled"
                        ? "Cancel Delivery"
                        : commentModal.status === "delivered"
                          ? "Confirm Delivered"
                          : "Update Status"}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
