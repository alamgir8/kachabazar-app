import { View, Text, Pressable, ScrollView, Image, Alert } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import {
  useDeliveryAuth,
  getDeliveryBoyDisplayName,
} from "@/contexts/DeliveryAuthContext";
import { useAppMode } from "@/contexts/AppModeContext";
import {
  useDeliveryProfile,
  useDeliveryStats,
} from "@/hooks/queries/useDelivery";

const VEHICLE_ICONS: Record<string, string> = {
  bike: "motorbike",
  bicycle: "bicycle",
  car: "car",
  van: "van-utility",
  scooter: "moped",
  other: "truck-delivery",
};

export default function DeliveryProfileScreen() {
  const router = useRouter();
  const { user, logout } = useDeliveryAuth();
  const { setMode } = useAppMode();
  const { data: profile } = useDeliveryProfile();
  const { data: stats } = useDeliveryStats();

  const displayName = getDeliveryBoyDisplayName(user?.name);

  const handleSwitchToStore = () => {
    Alert.alert(
      "Switch to Store",
      "Switch to the shopping store app? You can come back to delivery mode anytime.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: async () => {
            await setMode("store");
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/delivery/login");
        },
      },
    ]);
  };

  return (
    <Screen scrollable edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
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
          <View className="flex-row items-center">
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                className="h-16 w-16 rounded-3xl border-2 border-white/30"
              />
            ) : (
              <View className="h-16 w-16 items-center justify-center rounded-3xl border-2 border-white/30 bg-white/20">
                <Text className="text-2xl font-bold text-white">
                  {displayName[0] ?? "D"}
                </Text>
              </View>
            )}
            <View className="ml-4 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Delivery Partner
              </Text>
              <Text className="mt-1 text-lg font-bold text-white">
                {displayName}
              </Text>
              <Text className="text-sm text-white/80">{user?.email}</Text>
            </View>
          </View>

          {/* Rating & Stats Row */}
          <View className="flex-row mt-5 gap-3">
            <View className="flex-1 rounded-2xl bg-white/15 p-3 items-center">
              <Text className="text-white/70 text-xs">Rating</Text>
              <View className="flex-row items-center mt-1">
                <Feather name="star" size={14} color="#fbbf24" />
                <Text className="text-white text-base font-bold ml-1">
                  {stats?.averageRating?.toFixed(1) ?? "—"}
                </Text>
              </View>
            </View>
            <View className="flex-1 rounded-2xl bg-white/15 p-3 items-center">
              <Text className="text-white/70 text-xs">Completed</Text>
              <Text className="text-white text-base font-bold mt-1">
                {stats?.completedDeliveries ?? 0}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white/15 p-3 items-center">
              <Text className="text-white/70 text-xs">Earnings</Text>
              <Text className="text-white text-base font-bold mt-1">
                ${stats?.totalEarnings?.toFixed(0) ?? 0}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Vehicle Info */}
        {profile && (
          <View
            className="mt-5 rounded-2xl bg-white p-4"
            style={{
              shadowColor: "#94a3b8",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text className="text-sm font-bold text-slate-800 mb-3">
              Vehicle Info
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 rounded-2xl bg-orange-100 items-center justify-center">
                <MaterialCommunityIcons
                  name={
                    (VEHICLE_ICONS[profile.vehicleType] ||
                      "truck-delivery") as any
                  }
                  size={24}
                  color="#ea580c"
                />
              </View>
              <View>
                <Text className="text-sm font-semibold text-slate-700 capitalize">
                  {profile.vehicleType}
                </Text>
                {profile.vehicleNumber && (
                  <Text className="text-xs text-slate-500">
                    {profile.vehicleNumber}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Contact Info */}
        {profile && (
          <View
            className="mt-4 rounded-2xl bg-white p-4"
            style={{
              shadowColor: "#94a3b8",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text className="text-sm font-bold text-slate-800 mb-3">
              Contact Details
            </Text>
            <View className="gap-2.5">
              <InfoRow icon="phone" label="Phone" value={profile.phone} />
              <InfoRow icon="mail" label="Email" value={profile.email} />
              {profile.address && (
                <InfoRow
                  icon="map-pin"
                  label="Address"
                  value={profile.address}
                />
              )}
              {(profile.city || profile.country) && (
                <InfoRow
                  icon="globe"
                  label="Location"
                  value={[profile.city, profile.country]
                    .filter(Boolean)
                    .join(", ")}
                />
              )}
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="mt-6 gap-3">
          <Pressable
            onPress={handleSwitchToStore}
            className="flex-row items-center rounded-2xl bg-teal-50 border border-teal-200 p-4"
          >
            <View className="h-10 w-10 rounded-2xl bg-teal-100 items-center justify-center">
              <Feather name="shopping-bag" size={20} color="#0d9488" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-sm font-bold text-teal-800">
                Switch to Store
              </Text>
              <Text className="text-xs text-teal-600 mt-0.5">
                Browse products & place orders
              </Text>
            </View>
            <Feather name="arrow-right" size={18} color="#0d9488" />
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="flex-row items-center rounded-2xl bg-red-50 border border-red-200 p-4"
          >
            <View className="h-10 w-10 rounded-2xl bg-red-100 items-center justify-center">
              <Feather name="log-out" size={20} color="#ef4444" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-sm font-bold text-red-700">Log Out</Text>
              <Text className="text-xs text-red-500 mt-0.5">
                Sign out of delivery account
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center">
      <Feather name={icon} size={14} color="#64748b" />
      <Text className="ml-2 text-xs text-slate-400 w-16">{label}</Text>
      <Text className="text-sm text-slate-700 flex-1">{value}</Text>
    </View>
  );
}
