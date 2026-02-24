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
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Hero Header - Full width, handles safe area itself */}
        <LinearGradient
          colors={["#ea580c", "#f97316", "#fb923c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 28,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                Welcome back
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
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
          <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
            {[
              {
                label: "Today",
                value: stats?.todayDeliveries ?? 0,
                sub: "deliveries",
              },
              {
                label: "Active",
                value: stats?.activeOrders ?? 0,
                sub: "orders",
              },
              {
                label: "Rating",
                value: stats?.averageRating?.toFixed(1) ?? "—",
                sub: `${stats?.totalRatings ?? 0} reviews`,
              },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  padding: 14,
                }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11,
                    fontWeight: "500",
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    fontWeight: "800",
                    marginTop: 4,
                  }}
                >
                  {item.value}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>
                  {item.sub}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Content Area */}
        <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
          {/* Current Active Order Card */}
          {currentOrderData?.order && (
            <Pressable
              onPress={() =>
                router.push(`/delivery/order/${currentOrderData.order!._id}`)
              }
              style={{
                marginTop: 16,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#fed7aa",
                backgroundColor: "#fff7ed",
                padding: 16,
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
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: 12,
              }}
            >
              Performance
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
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
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: 12,
              }}
            >
              Quick Actions
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => router.push("/delivery/(tabs)/orders")}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  backgroundColor: "white",
                  padding: 16,
                  alignItems: "center",
                  shadowColor: "#94a3b8",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#dbeafe",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="list" size={20} color="#3b82f6" />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#334155",
                    marginTop: 8,
                  }}
                >
                  All Orders
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/delivery/(tabs)/active")}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  backgroundColor: "white",
                  padding: 16,
                  alignItems: "center",
                  shadowColor: "#94a3b8",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#ffedd5",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="bike-fast"
                    size={22}
                    color="#ea580c"
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#334155",
                    marginTop: 8,
                  }}
                >
                  Active Order
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/delivery/(tabs)/profile")}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  backgroundColor: "white",
                  padding: 16,
                  alignItems: "center",
                  shadowColor: "#94a3b8",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#f3e8ff",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="user" size={20} color="#a855f7" />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#334155",
                    marginTop: 8,
                  }}
                >
                  My Profile
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Ratings */}
          {stats?.recentRatings && stats.recentRatings.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: 12,
                }}
              >
                Recent Ratings
              </Text>
              {stats.recentRatings.map((r, i) => (
                <View
                  key={i}
                  style={{
                    marginBottom: 8,
                    borderRadius: 16,
                    backgroundColor: "white",
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                    style={{
                      marginLeft: 12,
                      flex: 1,
                      fontSize: 12,
                      color: "#64748b",
                    }}
                    numberOfLines={1}
                  >
                    {r.review || "No review"}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
      style={{
        backgroundColor: bgColor,
        borderRadius: 16,
        padding: 14,
        width: "48%",
        flexGrow: 1,
      }}
    >
      <Feather name={icon} size={18} color={color} />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          color: "#1e293b",
          marginTop: 8,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: "500",
          color: "#64748b",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
