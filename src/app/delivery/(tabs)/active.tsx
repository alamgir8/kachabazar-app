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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useCurrentOrder,
  useUpdateTrackingStatus,
} from "@/hooks/queries/useDelivery";
import { DELIVERY_COLORS } from "@/constants/deliveryTheme";

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
    color: "#6366f1",
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
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch } = useCurrentOrder();
  const updateStatus = useUpdateTrackingStatus();
  const [updatingTo, setUpdatingTo] = useState<string | null>(null);
  const [commentModal, setCommentModal] = useState<{
    visible: boolean;
    status: string;
    label: string;
  }>({ visible: false, status: "", label: "" });
  const [comment, setComment] = useState("");

  const order = data?.order;
  const tracking = data?.tracking;
  const currentStatus = tracking?.status || "order-placed";

  const handleStatusUpdate = (newStatus: string, label: string) => {
    if (!order) return;
    setComment("");
    setCommentModal({ visible: true, status: newStatus, label });
  };

  const confirmStatusUpdate = async () => {
    if (!order) return;
    const { status: newStatus, label } = commentModal;
    setCommentModal({ visible: false, status: "", label: "" });
    setUpdatingTo(newStatus);
    try {
      await updateStatus.mutateAsync({
        orderId: order._id,
        trackingStatus: newStatus,
        message: comment.trim() || undefined,
      });
      Alert.alert("Success", `Status updated to ${label}`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update status");
    } finally {
      setUpdatingTo(null);
      setComment("");
    }
  };

  const callCustomer = () => {
    const phone = order?.user_info?.contact;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  if (isLoading) {
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

  if (!order) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: "#fafafa",
          paddingTop: insets.top,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#f1f5f9",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons name="bike-fast" size={40} color="#cbd5e1" />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#334155",
            textAlign: "center",
          }}
        >
          No Active Delivery
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#64748b",
            textAlign: "center",
            marginTop: 8,
            lineHeight: 20,
          }}
        >
          You don't have any active delivery right now. Check your orders list
          for assigned deliveries.
        </Text>
        <Pressable
          onPress={() => router.push("/delivery/(tabs)/orders")}
          style={{
            marginTop: 24,
            borderRadius: 16,
            backgroundColor: DELIVERY_COLORS.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>
            View All Orders
          </Text>
        </Pressable>
      </View>
    );
  }

  // Determine which statuses are available as next steps
  const currentIndex = TRACKING_STATUSES.findIndex(
    (s) => s.value === currentStatus,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Order Header */}
        <LinearGradient
          colors={DELIVERY_COLORS.gradientHorizontal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 24,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>
              Order #{order.invoice}
            </Text>
            <View
              style={{
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                {currentStatus.replace(/-/g, " ")}
              </Text>
            </View>
          </View>
          {order.trackingId && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather
                name="navigation"
                size={12}
                color="rgba(255,255,255,0.7)"
              />
              <Text
                style={{
                  marginLeft: 4,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "monospace",
                }}
              >
                {order.trackingId}
              </Text>
            </View>
          )}
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "800",
              marginTop: 8,
            }}
          >
            ${order.total?.toFixed(2)}
          </Text>
        </LinearGradient>

        {/* Content */}
        <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
          {/* Customer Info */}
          <View
            style={{
              marginTop: 12,
              borderRadius: 20,
              backgroundColor: "white",
              padding: 16,
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
              Customer Details
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="user" size={14} color="#64748b" />
                <Text style={{ marginLeft: 8, fontSize: 14, color: "#334155" }}>
                  {order.user_info?.name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="map-pin" size={14} color="#64748b" />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 13,
                    color: "#475569",
                    flex: 1,
                  }}
                >
                  {order.user_info?.address}, {order.user_info?.city},{" "}
                  {order.user_info?.country} {order.user_info?.zipCode}
                </Text>
              </View>
              {order.user_info?.contact && (
                <Pressable
                  onPress={callCustomer}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Feather name="phone" size={14} color="#0d9488" />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 14,
                      color: "#0d9488",
                      fontWeight: "600",
                    }}
                  >
                    {order.user_info.contact}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 4,
                      fontSize: 11,
                      color: "#14b8a6",
                    }}
                  >
                    Tap to call
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Update Status */}
          <View
            style={{
              marginTop: 12,
              borderRadius: 20,
              backgroundColor: "white",
              padding: 16,
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
              Update Delivery Status
            </Text>
            <View style={{ gap: 8 }}>
              {TRACKING_STATUSES.map((status, index) => {
                const isPast = index <= currentIndex;
                const isCurrent = status.value === currentStatus;
                const isNext = index === currentIndex + 1;
                const isAvailable = index > currentIndex;
                const isDeliveredOrCancelled =
                  currentStatus === "delivered" ||
                  currentStatus === "cancelled";

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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 14,
                      padding: 12,
                      backgroundColor: isCurrent
                        ? DELIVERY_COLORS.accentBg
                        : isPast
                          ? "#f8fafc"
                          : isNext
                            ? "#eff6ff"
                            : "#f8fafc",
                      borderWidth: isCurrent ? 2 : isNext ? 1 : 0,
                      borderColor: isCurrent
                        ? DELIVERY_COLORS.accentBorder
                        : isNext
                          ? "#bfdbfe"
                          : "transparent",
                      opacity: !isPast && !isCurrent && !isNext ? 0.6 : 1,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
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
                      style={{
                        marginLeft: 12,
                        fontSize: 14,
                        fontWeight: "600",
                        color: isCurrent
                          ? DELIVERY_COLORS.accentText
                          : isPast
                            ? "#64748b"
                            : "#334155",
                      }}
                    >
                      {status.label}
                    </Text>
                    {isCurrent && (
                      <View
                        style={{
                          marginLeft: "auto",
                          borderRadius: 20,
                          backgroundColor: DELIVERY_COLORS.primary,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: "700",
                            color: "white",
                          }}
                        >
                          CURRENT
                        </Text>
                      </View>
                    )}
                    {isNext && !isDeliveredOrCancelled && (
                      <View
                        style={{
                          marginLeft: "auto",
                          borderRadius: 20,
                          backgroundColor: "#3b82f6",
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: "700",
                            color: "white",
                          }}
                        >
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
              style={{
                marginTop: 12,
                borderRadius: 20,
                backgroundColor: "white",
                padding: 16,
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
                Tracking History
              </Text>
              {[...tracking.history].reverse().map((entry, i) => (
                <View
                  key={i}
                  style={{ flexDirection: "row", marginBottom: 12 }}
                >
                  <View style={{ alignItems: "center", marginRight: 12 }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: DELIVERY_COLORS.primaryLighter,
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
                        fontWeight: "600",
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
                    {entry.location?.address && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          marginTop: 2,
                        }}
                      >
                        📍 {entry.location.address}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
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
                    Update to "{commentModal.label}"
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
                  <Text
                    style={{
                      fontWeight: "400",
                      color: "#94a3b8",
                    }}
                  >
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
                          : (DELIVERY_COLORS.gradientHorizontal)
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
                          : `Update Status`}
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
