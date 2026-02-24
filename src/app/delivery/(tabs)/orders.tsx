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

const STATUS_FILTERS = [
  { label: "All", value: undefined },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancel" },
] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#fef3c7", text: "#92400e" },
  processing: { bg: "#dbeafe", text: "#1e40af" },
  "out-for-delivery": { bg: "#ffedd5", text: "#c2410c" },
  delivered: { bg: "#dcfce7", text: "#166534" },
  cancel: { bg: "#fee2e2", text: "#991b1b" },
};

export default function DeliveryOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data, isLoading, refetch } = useDeliveryOrders(page, statusFilter);

  const renderOrder = ({ item }: { item: DeliveryOrder }) => {
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
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

        <Text style={{ fontSize: 12, color: "#64748b" }} numberOfLines={1}>
          📍 {item.user_info?.address}, {item.user_info?.city}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#f1f5f9",
          }}
        >
          <Text style={{ fontSize: 12, color: "#94a3b8" }}>
            {format(new Date(item.createdAt), "MMM dd, yyyy")}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#1e293b" }}>
            ${item.total?.toFixed(2)}
          </Text>
        </View>

        {item.trackingId && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Feather name="navigation" size={10} color="#64748b" />
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
              backgroundColor: statusFilter === f.value ? "#ea580c" : "#f1f5f9",
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
              <ActivityIndicator color="#f97316" />
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
