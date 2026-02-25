import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";

import {
  useDeliveryOrders,
  useOrderTrackingHistory,
  useUpdateTrackingStatus,
} from "@/hooks/queries/useDelivery";
import type { DeliveryOrder } from "@/services/delivery";
import { DELIVERY_COLORS } from "@/constants/deliveryTheme";

const STATUS_FILTERS = [
  { label: "All", value: undefined },
  { label: "Active", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancel" },
] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#fef3c7", text: "#92400e" },
  processing: { bg: "#dbeafe", text: "#1e40af" },
  "out-for-delivery": { bg: "#e0e7ff", text: "#3730a3" },
  delivered: { bg: "#dcfce7", text: "#166534" },
  cancel: { bg: "#fee2e2", text: "#991b1b" },
};

const TRACKING_STATUS_CONFIG: Record<
  string,
  {
    icon: React.ComponentProps<typeof Feather>["name"];
    color: string;
    bg: string;
  }
> = {
  "order-placed": { icon: "package", color: "#3b82f6", bg: "#dbeafe" },
  confirmed: { icon: "check-circle", color: "#059669", bg: "#d1fae5" },
  preparing: { icon: "clock", color: "#d97706", bg: "#fef3c7" },
  "ready-for-pickup": { icon: "package", color: "#ea580c", bg: "#ffedd5" },
  "picked-up": { icon: "shopping-bag", color: "#6366f1", bg: "#e0e7ff" },
  "on-the-way": { icon: "truck", color: "#7c3aed", bg: "#ede9fe" },
  nearby: { icon: "map-pin", color: "#0891b2", bg: "#cffafe" },
  delivered: { icon: "check-circle", color: "#16a34a", bg: "#dcfce7" },
  cancelled: { icon: "x-circle", color: "#dc2626", bg: "#fee2e2" },
};

const UPDATE_STATUSES = [
  {
    value: "picked-up",
    label: "Picked Up",
    description: "Order has been picked up from the store",
    icon: "shopping-bag" as const,
    color: "#6366f1",
    bg: "#e0e7ff",
    activeBorder: "#818cf8",
  },
  {
    value: "on-the-way",
    label: "On The Way",
    description: "Out for delivery to customer",
    icon: "truck" as const,
    color: "#7c3aed",
    bg: "#ede9fe",
    activeBorder: "#a78bfa",
  },
  {
    value: "nearby",
    label: "Nearby",
    description: "Almost at the delivery address",
    icon: "map-pin" as const,
    color: "#0891b2",
    bg: "#cffafe",
    activeBorder: "#22d3ee",
  },
  {
    value: "delivered",
    label: "Delivered",
    description: "Order successfully delivered to customer",
    icon: "check-circle" as const,
    color: "#16a34a",
    bg: "#dcfce7",
    activeBorder: "#4ade80",
  },
  {
    value: "cancelled",
    label: "Cancel Delivery",
    description: "Cannot complete this delivery",
    icon: "x-circle" as const,
    color: "#dc2626",
    bg: "#fee2e2",
    activeBorder: "#f87171",
  },
];

const STATUS_ORDER = [
  "order-placed",
  "confirmed",
  "preparing",
  "ready-for-pickup",
  "picked-up",
  "on-the-way",
  "nearby",
  "delivered",
];

export default function DeliveryOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data, isLoading, refetch } = useDeliveryOrders(page, statusFilter);

  // History modal state
  const [historyOrderId, setHistoryOrderId] = useState<string | null>(null);

  // Update status modal state
  const [updateOrder, setUpdateOrder] = useState<{
    id: string;
    trackingStatus: string;
    invoice?: number;
  } | null>(null);

  const renderOrder = ({ item }: { item: DeliveryOrder }) => {
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
    const isActive =
      item.status === "pending" ||
      item.status === "processing" ||
      item.status === "out-for-delivery";

    return (
      <View
        style={{
          marginBottom: 10,
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
        {/* Top row: invoice + status */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="package" size={16} color="#64748b" />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              #{item.invoice}
            </Text>
            {item.trackingId && (
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 10,
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  backgroundColor: "#f1f5f9",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {item.trackingId}
              </Text>
            )}
          </View>
          <View
            style={{
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: sc.bg,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                color: sc.text,
              }}
            >
              {item.status.replace(/-/g, " ")}
            </Text>
          </View>
        </View>

        {/* Customer + address */}
        <View style={{ marginBottom: 8 }}>
          {item.user_info?.name && (
            <Text
              style={{ fontSize: 13, fontWeight: "600", color: "#334155" }}
              numberOfLines={1}
            >
              {item.user_info.name}
            </Text>
          )}
          <Text
            style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}
            numberOfLines={1}
          >
            📍 {item.user_info?.address}, {item.user_info?.city}
          </Text>
        </View>

        {/* Middle row: tracking status + date + total */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#f1f5f9",
          }}
        >
          {item.trackingStatus && (
            <View
              style={{
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor:
                  TRACKING_STATUS_CONFIG[item.trackingStatus]?.bg || "#f1f5f9",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  textTransform: "capitalize",
                  color:
                    TRACKING_STATUS_CONFIG[item.trackingStatus]?.color ||
                    "#64748b",
                }}
              >
                {item.trackingStatus.replace(/-/g, " ")}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 12, color: "#94a3b8" }}>
            {format(new Date(item.createdAt), "MMM dd, yyyy")}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#1e293b" }}>
            ${item.total?.toFixed(2)}
          </Text>
        </View>

        {/* Action buttons row */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            gap: 8,
          }}
        >
          {/* View Detail */}
          <Pressable
            onPress={() => router.push(`/delivery/order/${item._id}`)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8fafc",
              borderRadius: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <Feather name="eye" size={14} color="#64748b" />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 12,
                fontWeight: "600",
                color: "#475569",
              }}
            >
              View
            </Text>
          </Pressable>

          {/* History */}
          <Pressable
            onPress={() => setHistoryOrderId(item._id)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8fafc",
              borderRadius: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <Feather name="clock" size={14} color="#64748b" />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 12,
                fontWeight: "600",
                color: "#475569",
              }}
            >
              History
            </Text>
          </Pressable>

          {/* Update Status (only for active orders) */}
          {isActive && (
            <Pressable
              onPress={() =>
                setUpdateOrder({
                  id: item._id,
                  trackingStatus: item.trackingStatus || "order-placed",
                  invoice: item.invoice,
                })
              }
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: DELIVERY_COLORS.accentBg,
                borderRadius: 12,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: DELIVERY_COLORS.accentBorder,
              }}
            >
              <Feather name="send" size={14} color={DELIVERY_COLORS.primary} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 12,
                  fontWeight: "600",
                  color: DELIVERY_COLORS.primary,
                }}
              >
                Update
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fafafa",
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b" }}>
          My Orders
        </Text>
        <Text style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          {data?.totalDoc ?? 0} total • {data?.currentOrders ?? 0} active
        </Text>
      </View>

      {/* Filters */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {STATUS_FILTERS.map((f) => (
          <Pressable
            key={f.label}
            onPress={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            style={{
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              backgroundColor:
                statusFilter === f.value ? DELIVERY_COLORS.primary : "#f1f5f9",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: statusFilter === f.value ? "white" : "#475569",
              }}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={data?.orders ?? []}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ alignItems: "center", paddingVertical: 80 }}>
              <Feather name="inbox" size={48} color="#cbd5e1" />
              <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 12 }}>
                No orders found
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 80 }}>
              <ActivityIndicator color={DELIVERY_COLORS.primaryLight} />
            </View>
          )
        }
        onEndReached={() => {
          if (data && page < Math.ceil(data.totalDoc / data.limits)) {
            setPage((p) => p + 1);
          }
        }}
        onEndReachedThreshold={0.5}
      />

      {/* ─── Tracking History Modal ─── */}
      <TrackingHistoryModal
        orderId={historyOrderId}
        onClose={() => setHistoryOrderId(null)}
      />

      {/* ─── Update Status Modal ─── */}
      <UpdateStatusModal
        order={updateOrder}
        onClose={() => setUpdateOrder(null)}
        onSuccess={() => {
          setUpdateOrder(null);
          refetch();
        }}
      />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Tracking History Bottom Sheet (matches web admin history modal)
// ═══════════════════════════════════════════════════════════════════

function TrackingHistoryModal({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useOrderTrackingHistory(orderId || "");
  const order = data?.order;
  const tracking = data?.tracking;
  const history = tracking?.history || [];

  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <Modal
      visible={!!orderId}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
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
            maxHeight: "80%",
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#e2e8f0",
              alignSelf: "center",
              marginTop: 12,
            }}
          />

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="clock" size={18} color="#1e293b" />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 17,
                  fontWeight: "800",
                  color: "#1e293b",
                }}
              >
                Delivery History
              </Text>
              {order?.invoice && (
                <View
                  style={{
                    marginLeft: 10,
                    backgroundColor: "#f1f5f9",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: "#64748b",
                      fontFamily: "monospace",
                    }}
                  >
                    #{order.invoice}
                  </Text>
                </View>
              )}
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Feather name="x" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          {isLoading ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 60,
              }}
            >
              <ActivityIndicator
                size="large"
                color={DELIVERY_COLORS.primaryLight}
              />
            </View>
          ) : sortedHistory.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 60,
                paddingHorizontal: 40,
              }}
            >
              <Feather name="package" size={40} color="#cbd5e1" />
              <Text
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                No tracking history available
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 40,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Current status bar */}
              {order && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#f8fafc",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: "500",
                      }}
                    >
                      Current Status
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#1e293b",
                        textTransform: "capitalize",
                        marginTop: 2,
                      }}
                    >
                      {(tracking?.status || "order placed").replace(/-/g, " ")}
                    </Text>
                  </View>
                  {order.deliveryBoyName && (
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          fontWeight: "500",
                        }}
                      >
                        Delivery Boy
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#1e293b",
                          marginTop: 2,
                        }}
                      >
                        {order.deliveryBoyName}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Timeline */}
              {sortedHistory.map((entry, index) => {
                const config =
                  TRACKING_STATUS_CONFIG[entry.status] ||
                  TRACKING_STATUS_CONFIG["order-placed"];
                const isLast = index === sortedHistory.length - 1;

                return (
                  <View
                    key={index}
                    style={{ flexDirection: "row", marginBottom: 4 }}
                  >
                    {/* Timeline dot + line */}
                    <View
                      style={{
                        alignItems: "center",
                        marginRight: 14,
                        width: 36,
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          backgroundColor: config.bg,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Feather
                          name={config.icon}
                          size={16}
                          color={config.color}
                        />
                      </View>
                      {!isLast && (
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

                    {/* Content */}
                    <View style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "#1e293b",
                            textTransform: "capitalize",
                          }}
                        >
                          {entry.status.replace(/-/g, " ")}
                        </Text>
                        <Text style={{ fontSize: 11, color: "#94a3b8" }}>
                          {format(
                            new Date(entry.timestamp),
                            "MMM dd, yyyy, hh:mm a",
                          )}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          marginTop: 3,
                        }}
                      >
                        {entry.message}
                      </Text>
                      {entry.updatedBy && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <Feather name="user" size={11} color="#94a3b8" />
                          <Text
                            style={{
                              marginLeft: 4,
                              fontSize: 11,
                              color: "#94a3b8",
                              textTransform: "capitalize",
                            }}
                          >
                            {entry.updatedBy === "delivery-boy"
                              ? "Delivery Boy"
                              : entry.updatedBy}
                          </Text>
                        </View>
                      )}
                      {entry.location?.address && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <Feather name="map-pin" size={11} color="#94a3b8" />
                          <Text
                            style={{
                              marginLeft: 4,
                              fontSize: 11,
                              color: "#94a3b8",
                            }}
                          >
                            {entry.location.address}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Update Tracking Status Bottom Sheet (matches web admin update modal)
// ═══════════════════════════════════════════════════════════════════

function UpdateStatusModal({
  order,
  onClose,
  onSuccess,
}: {
  order: { id: string; trackingStatus: string; invoice?: number } | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const updateStatus = useUpdateTrackingStatus();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter available statuses based on current
  const currentIndex = STATUS_ORDER.indexOf(order?.trackingStatus || "");
  const availableStatuses = UPDATE_STATUSES.filter((s) => {
    if (s.value === "cancelled") return true;
    const sIndex = STATUS_ORDER.indexOf(s.value);
    return sIndex > currentIndex;
  });

  const handleSubmit = async () => {
    if (!selectedStatus || !order) return;
    setIsSubmitting(true);
    try {
      await updateStatus.mutateAsync({
        orderId: order.id,
        trackingStatus: selectedStatus,
        message: comment.trim() || undefined,
      });
      setSelectedStatus("");
      setComment("");
      onSuccess();
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setComment("");
    onClose();
  };

  return (
    <Modal
      visible={!!order}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <Pressable
          onPress={handleClose}
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
              maxHeight: "85%",
            }}
          >
            {/* Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#e2e8f0",
                alignSelf: "center",
                marginTop: 12,
              }}
            />

            <ScrollView
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Feather name="send" size={18} color="#1e293b" />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 17,
                      fontWeight: "800",
                      color: "#1e293b",
                    }}
                  >
                    Update Delivery Status
                  </Text>
                </View>
                <Pressable onPress={handleClose} hitSlop={12}>
                  <Feather name="x" size={20} color="#94a3b8" />
                </Pressable>
              </View>

              {/* Current status */}
              {order && (
                <View
                  style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                    Current:{" "}
                    <Text
                      style={{
                        fontWeight: "700",
                        color: "#1e293b",
                        textTransform: "capitalize",
                      }}
                    >
                      {(order.trackingStatus || "order placed").replace(
                        /-/g,
                        " ",
                      )}
                    </Text>
                  </Text>
                </View>
              )}

              {/* Status options */}
              <View style={{ gap: 8, marginBottom: 20 }}>
                {availableStatuses.map((status) => {
                  const isSelected = selectedStatus === status.value;
                  return (
                    <Pressable
                      key={status.value}
                      onPress={() => setSelectedStatus(status.value)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderRadius: 16,
                        padding: 14,
                        backgroundColor: status.bg,
                        borderWidth: 2,
                        borderColor: isSelected
                          ? status.activeBorder
                          : "transparent",
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          backgroundColor: "rgba(255,255,255,0.6)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Feather
                          name={status.icon}
                          size={18}
                          color={status.color}
                        />
                      </View>
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "#1e293b",
                          }}
                        >
                          {status.label}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            marginTop: 2,
                          }}
                        >
                          {status.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <Feather
                          name="check-circle"
                          size={20}
                          color={status.color}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Comment */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: 8,
                  }}
                >
                  Comment{" "}
                  <Text style={{ fontWeight: "400", color: "#94a3b8" }}>
                    (optional)
                  </Text>
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Add a note about this status update..."
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
                  style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}
                >
                  This comment will be sent as a notification to the customer.
                </Text>
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={handleClose}
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
                  onPress={handleSubmit}
                  disabled={!selectedStatus || isSubmitting}
                  style={{
                    flex: 2,
                    borderRadius: 16,
                    overflow: "hidden",
                    opacity: !selectedStatus ? 0.5 : 1,
                  }}
                >
                  <LinearGradient
                    colors={
                      selectedStatus === "cancelled"
                        ? (["#ef4444", "#dc2626"] as const)
                        : selectedStatus === "delivered"
                          ? (["#22c55e", "#16a34a"] as const)
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
                    {isSubmitting ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "white",
                        }}
                      >
                        Update Status
                      </Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
