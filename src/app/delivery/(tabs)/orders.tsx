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
import { format } from "date-fns";

import { Screen } from "@/components/layout/Screen";
import { useDeliveryOrders } from "@/hooks/queries/useDelivery";
import type { DeliveryOrder } from "@/services/delivery";

const STATUS_FILTERS = [
  { label: "All", value: undefined },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancel" },
] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700" },
  processing: { bg: "bg-blue-100", text: "text-blue-700" },
  "out-for-delivery": { bg: "bg-orange-100", text: "text-orange-700" },
  delivered: { bg: "bg-emerald-100", text: "text-emerald-700" },
  cancel: { bg: "bg-red-100", text: "text-red-700" },
};

export default function DeliveryOrdersScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data, isLoading, refetch } = useDeliveryOrders(page, statusFilter);

  const renderOrder = ({ item }: { item: DeliveryOrder }) => {
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
    return (
      <Pressable
        onPress={() => router.push(`/delivery/order/${item._id}`)}
        className="mb-3 rounded-2xl bg-white p-4"
        style={{
          shadowColor: "#94a3b8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Feather name="package" size={16} color="#64748b" />
            <Text className="ml-2 text-sm font-bold text-slate-800">
              #{item.invoice}
            </Text>
          </View>
          <View className={`rounded-full px-2.5 py-1 ${sc.bg}`}>
            <Text className={`text-[10px] font-bold uppercase ${sc.text}`}>
              {item.status.replace(/-/g, " ")}
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-500" numberOfLines={1}>
          📍 {item.user_info?.address}, {item.user_info?.city}
        </Text>

        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <Text className="text-xs text-slate-400">
            {format(new Date(item.createdAt), "MMM dd, yyyy")}
          </Text>
          <Text className="text-sm font-bold text-slate-800">
            ${item.total?.toFixed(2)}
          </Text>
        </View>

        {item.trackingId && (
          <View className="flex-row items-center mt-2">
            <Feather name="navigation" size={10} color="#64748b" />
            <Text className="ml-1 text-[10px] text-slate-400 font-mono">
              {item.trackingId}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Screen edges={["bottom"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-xl font-bold text-slate-800">My Orders</Text>
          <Text className="text-xs text-slate-500 mt-1">
            {data?.totalDoc ?? 0} total • {data?.currentOrders ?? 0} active
          </Text>
        </View>

        {/* Filters */}
        <View className="flex-row gap-2 mb-4">
          {STATUS_FILTERS.map((f) => (
            <Pressable
              key={f.label}
              onPress={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 ${
                statusFilter === f.value ? "bg-orange-500" : "bg-slate-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  statusFilter === f.value ? "text-white" : "text-slate-600"
                }`}
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
              <View className="items-center py-20">
                <Feather name="inbox" size={48} color="#cbd5e1" />
                <Text className="text-sm text-slate-400 mt-3">
                  No orders found
                </Text>
              </View>
            ) : (
              <View className="items-center py-20">
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
    </Screen>
  );
}
