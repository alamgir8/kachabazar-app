import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";

import { useDeliveryOrders } from "@/hooks/queries/useDelivery";
import type { DeliveryOrder } from "@/services/delivery";
import { DELIVERY_COLORS } from "@/constants/deliveryTheme";

const HISTORY_FILTERS = [
  { label: "All Completed", value: "delivered" },
  { label: "Cancelled", value: "cancel" },
] as const;

const STATUS_ICON: Record<string, { icon: string; color: string; bg: string }> =
  {
    delivered: { icon: "check-circle", color: "#16a34a", bg: "#f0fdf4" },
    cancel: { icon: "x-circle", color: "#dc2626", bg: "#fef2f2" },
  };

export default function OrderHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("delivered");
  const { data, isLoading, refetch } = useDeliveryOrders(page, filter);

  const renderOrder = ({ item }: { item: DeliveryOrder }) => {
    const isDelivered = item.status === "delivered";
    const statusInfo = STATUS_ICON[item.status] || STATUS_ICON.delivered;

    return (
      <Pressable
        onPress={() => router.push(`/delivery/order/${item._id}`)}
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
        {/* Header row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: statusInfo.bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                name={statusInfo.icon as any}
                size={16}
                color={statusInfo.color}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                #{item.invoice}
              </Text>
              <Text style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                {format(new Date(item.createdAt), "MMM dd, yyyy 'at' h:mm a")}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "800",
              color: "#1e293b",
            }}
          >
            ${item.total?.toFixed(2)}
          </Text>
        </View>

        {/* Address */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f8fafc",
            borderRadius: 12,
            padding: 10,
            marginBottom: 8,
          }}
        >
          <Feather name="map-pin" size={13} color="#64748b" />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: "#475569",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.user_info?.address}, {item.user_info?.city}
          </Text>
        </View>

        {/* Bottom row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: isDelivered ? "#dcfce7" : "#fee2e2",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                color: isDelivered ? "#166534" : "#991b1b",
              }}
            >
              {isDelivered ? "Delivered" : "Cancelled"}
            </Text>
          </View>
          {item.deliveredAt && (
            <Text style={{ fontSize: 11, color: "#94a3b8" }}>
              {isDelivered ? "Delivered" : "Cancelled"}{" "}
              {format(new Date(item.deliveredAt), "MMM dd")}
            </Text>
          )}
          {item.trackingId && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="navigation" size={10} color="#94a3b8" />
              <Text
                style={{
                  marginLeft: 4,
                  fontSize: 10,
                  color: "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {item.trackingId}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
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
          Order History
        </Text>
        <Text style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          {data?.totalDoc ?? 0} completed deliveries
        </Text>
      </View>

      {/* Filters */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {HISTORY_FILTERS.map((f) => (
          <Pressable
            key={f.label}
            onPress={() => {
              setFilter(f.value);
              setPage(1);
            }}
            style={{
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor:
                filter === f.value ? DELIVERY_COLORS.primary : "#f1f5f9",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: filter === f.value ? "white" : "#475569",
              }}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Summary stats */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: "#f0fdf4",
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 10, color: "#64748b", fontWeight: "500" }}>
            Completed
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#166534",
              marginTop: 4,
            }}
          >
            {filter === "delivered" ? (data?.totalDoc ?? 0) : "—"}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: "#fef2f2",
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 10, color: "#64748b", fontWeight: "500" }}>
            Cancelled
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#991b1b",
              marginTop: 4,
            }}
          >
            {filter === "cancel" ? (data?.totalDoc ?? 0) : "—"}
          </Text>
        </View>
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
              <Feather
                name={filter === "delivered" ? "check-circle" : "x-circle"}
                size={48}
                color="#cbd5e1"
              />
              <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 12 }}>
                {filter === "delivered"
                  ? "No completed deliveries yet"
                  : "No cancelled deliveries"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#cbd5e1",
                  marginTop: 4,
                  textAlign: "center",
                  paddingHorizontal: 40,
                }}
              >
                {filter === "delivered"
                  ? "Your completed deliveries will appear here"
                  : "Cancelled orders will show up here"}
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
    </View>
  );
}
