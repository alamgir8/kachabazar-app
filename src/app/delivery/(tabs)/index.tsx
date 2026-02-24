import { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import {
  useDeliveryAuth,
  getDeliveryBoyDisplayName,
} from "@/contexts/DeliveryAuthContext";
import {
  useDeliveryStats,
  useCurrentOrder,
  useUpdateAvailability,
} from "@/hooks/queries/useDelivery";

const AVAILABILITY_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  available: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  "on-delivery": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  offline: { bg: "bg-slate-200", text: "text-slate-600", dot: "bg-slate-400" },
};

export default function DeliveryDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useDeliveryAuth();
  const { data: stats, isLoading, refetch } = useDeliveryStats();
  const { data: currentOrderData } = useCurrentOrder();
  const availabilityMutation = useUpdateAvailability();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/delivery/login");
    }
  }, [isAuthenticated]);

  const availability = stats?.availability || "offline";
  const avColors =
    AVAILABILITY_COLORS[availability] || AVAILABILITY_COLORS.offline;

  const cycleAvailability = () => {
    const next =
      availability === "available"
        ? "offline"
        : availability === "offline"
          ? "available"
          : "available";
    availabilityMutation.mutate(next);
  };

  const displayName = getDeliveryBoyDisplayName(user?.name);

  return (
    <Screen scrollable edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Hero Header */}
        <LinearGradient
          colors={["#ea580c", "#f97316", "#fb923c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginHorizontal: -16,
            marginTop: -16,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Welcome back
              </Text>
              <Text className="text-white text-xl font-bold mt-1">
                {displayName}
              </Text>
            </View>
            {/* Availability Toggle */}
            <Pressable
              onPress={cycleAvailability}
              className={`flex-row items-center rounded-full px-3 py-1.5 ${avColors.bg}`}
            >
              <View className={`h-2 w-2 rounded-full mr-1.5 ${avColors.dot}`} />
              <Text className={`text-xs font-bold capitalize ${avColors.text}`}>
                {availability}
              </Text>
            </Pressable>
          </View>

          {/* Stats Cards */}
          <View className="flex-row mt-5 gap-3">
            <View className="flex-1 rounded-2xl bg-white/15 p-4">
              <Text className="text-white/70 text-xs font-medium">Today</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {stats?.todayDeliveries ?? 0}
              </Text>
              <Text className="text-white/60 text-[10px]">deliveries</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white/15 p-4">
              <Text className="text-white/70 text-xs font-medium">Active</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {stats?.activeOrders ?? 0}
              </Text>
              <Text className="text-white/60 text-[10px]">orders</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white/15 p-4">
              <Text className="text-white/70 text-xs font-medium">Rating</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {stats?.averageRating?.toFixed(1) ?? "—"}
              </Text>
              <Text className="text-white/60 text-[10px]">
                {stats?.totalRatings ?? 0} reviews
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Current Active Order Card */}
        {currentOrderData?.order && (
          <Pressable
            onPress={() =>
              router.push(`/delivery/order/${currentOrderData.order!._id}`)
            }
            className="mt-5 rounded-2xl border-2 border-orange-200 bg-orange-50 p-4"
            style={{
              shadowColor: "#f97316",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="bike-fast"
                  size={20}
                  color="#ea580c"
                />
                <Text className="ml-2 text-sm font-bold text-orange-800">
                  Active Delivery
                </Text>
              </View>
              <View className="rounded-full bg-orange-500 px-3 py-1">
                <Text className="text-[10px] font-bold text-white uppercase">
                  {currentOrderData.tracking?.status?.replace(/-/g, " ") ||
                    currentOrderData.order.status}
                </Text>
              </View>
            </View>
            <Text className="text-sm font-semibold text-slate-800">
              Order #{currentOrderData.order.invoice}
            </Text>
            <Text className="text-xs text-slate-500 mt-1" numberOfLines={1}>
              📍 {currentOrderData.order.user_info?.address || "No address"}
            </Text>
            <View className="flex-row items-center mt-3">
              <Text className="text-xs text-orange-600 font-semibold">
                Tap to manage →
              </Text>
            </View>
          </Pressable>
        )}

        {/* Quick Stats Grid */}
        <View className="mt-6">
          <Text className="text-base font-bold text-slate-800 mb-3">
            Performance
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              icon="check-circle"
              label="Completed"
              value={stats?.completedDeliveries ?? 0}
              color="#22c55e"
              bgColor="#f0fdf4"
            />
            <StatCard
              icon="x-circle"
              label="Cancelled"
              value={stats?.cancelledDeliveries ?? 0}
              color="#ef4444"
              bgColor="#fef2f2"
            />
            <StatCard
              icon="trending-up"
              label="This Month"
              value={stats?.thisMonthDeliveries ?? 0}
              color="#3b82f6"
              bgColor="#eff6ff"
            />
            <StatCard
              icon="dollar-sign"
              label="Earnings (Month)"
              value={`$${(stats?.thisMonthEarnings ?? 0).toFixed(0)}`}
              color="#a855f7"
              bgColor="#faf5ff"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-6">
          <Text className="text-base font-bold text-slate-800 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/delivery/(tabs)/orders")}
              className="flex-1 rounded-2xl bg-white p-4 items-center"
              style={{
                shadowColor: "#94a3b8",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <View className="h-10 w-10 rounded-2xl bg-blue-100 items-center justify-center">
                <Feather name="list" size={20} color="#3b82f6" />
              </View>
              <Text className="text-xs font-semibold text-slate-700 mt-2">
                All Orders
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/delivery/(tabs)/active")}
              className="flex-1 rounded-2xl bg-white p-4 items-center"
              style={{
                shadowColor: "#94a3b8",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <View className="h-10 w-10 rounded-2xl bg-orange-100 items-center justify-center">
                <MaterialCommunityIcons
                  name="bike-fast"
                  size={22}
                  color="#ea580c"
                />
              </View>
              <Text className="text-xs font-semibold text-slate-700 mt-2">
                Active Order
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/delivery/(tabs)/profile")}
              className="flex-1 rounded-2xl bg-white p-4 items-center"
              style={{
                shadowColor: "#94a3b8",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <View className="h-10 w-10 rounded-2xl bg-purple-100 items-center justify-center">
                <Feather name="user" size={20} color="#a855f7" />
              </View>
              <Text className="text-xs font-semibold text-slate-700 mt-2">
                My Profile
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Ratings */}
        {stats?.recentRatings && stats.recentRatings.length > 0 && (
          <View className="mt-6">
            <Text className="text-base font-bold text-slate-800 mb-3">
              Recent Ratings
            </Text>
            {stats.recentRatings.map((r, i) => (
              <View
                key={i}
                className="mb-2 rounded-2xl bg-white p-3 flex-row items-center"
              >
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Feather
                      key={star}
                      name="star"
                      size={14}
                      color={star <= r.rating ? "#f59e0b" : "#e2e8f0"}
                    />
                  ))}
                </View>
                <Text
                  className="ml-3 flex-1 text-xs text-slate-500"
                  numberOfLines={1}
                >
                  {r.review || "No review"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{
        backgroundColor: bgColor,
        width: "48%",
        flexGrow: 1,
      }}
    >
      <Feather name={icon} size={18} color={color} />
      <Text className="text-xl font-bold text-slate-800 mt-2">{value}</Text>
      <Text className="text-[10px] font-medium text-slate-500 mt-0.5">
        {label}
      </Text>
    </View>
  );
}
