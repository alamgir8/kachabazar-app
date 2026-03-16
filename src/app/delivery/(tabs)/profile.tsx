import { View, Text, Pressable, ScrollView, Image, Alert } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useDeliveryAuth,
  getDeliveryBoyDisplayName,
} from "@/contexts/DeliveryAuthContext";
import { useAppMode } from "@/contexts/AppModeContext";
import {
  useDeliveryProfile,
  useDeliveryStats,
} from "@/hooks/queries/useDelivery";
import { DELIVERY_COLORS } from "@/constants/deliveryTheme";
import { showToast } from "@/utils/toast";

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
  const insets = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header - Full width */}
        <LinearGradient
          colors={DELIVERY_COLORS.gradient}
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              />
            ) : (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.3)",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 26, fontWeight: "800", color: "white" }}
                >
                  {displayName[0] ?? "D"}
                </Text>
              </View>
            )}
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Delivery Partner
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 20,
                  fontWeight: "800",
                  color: "white",
                }}
              >
                {displayName}
              </Text>
              <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                {user?.email}
              </Text>
            </View>
          </View>

          {/* Rating & Stats Row */}
          <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
            <View
              style={{
                flex: 1,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                Rating
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Feather name="star" size={14} color="#fbbf24" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "800",
                    marginLeft: 4,
                  }}
                >
                  {stats?.averageRating?.toFixed(1) ?? "—"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                Completed
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
                {stats?.completedDeliveries ?? 0}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                Earnings
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
                ${stats?.totalEarnings?.toFixed(0) ?? 0}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content Area */}
        <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
          {/* Vehicle Info */}
          {profile && (
            <View
              style={{
                marginTop: 16,
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
                Vehicle Info
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: DELIVERY_COLORS.accentBgLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      (VEHICLE_ICONS[profile.vehicleType] ||
                        "truck-delivery") as any
                    }
                    size={24}
                    color={DELIVERY_COLORS.primary}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#334155",
                      textTransform: "capitalize",
                    }}
                  >
                    {profile.vehicleType}
                  </Text>
                  {profile.vehicleNumber && (
                    <Text style={{ fontSize: 12, color: "#64748b" }}>
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
                Contact Details
              </Text>
              <View style={{ gap: 10 }}>
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
          <View style={{ marginTop: 24, gap: 12 }}>
            <Pressable
              onPress={handleSwitchToStore}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "#f0fdfa",
                borderWidth: 1,
                borderColor: "#99f6e4",
                padding: 16,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#ccfbf1",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="shopping-bag" size={20} color="#0d9488" />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: "#115e59" }}
                >
                  Switch to Store
                </Text>
                <Text style={{ fontSize: 12, color: "#0d9488", marginTop: 2 }}>
                  Browse products & place orders
                </Text>
              </View>
              <Feather name="arrow-right" size={18} color="#0d9488" />
            </Pressable>

            <Pressable
              onPress={handleLogout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "#fef2f2",
                borderWidth: 1,
                borderColor: "#fecaca",
                padding: 16,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#fee2e2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="log-out" size={20} color="#ef4444" />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: "#b91c1c" }}
                >
                  Log Out
                </Text>
                <Text style={{ fontSize: 12, color: "#ef4444", marginTop: 2 }}>
                  Sign out of delivery account
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#ef4444" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
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
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Feather name={icon} size={14} color="#64748b" />
      <Text
        style={{ marginLeft: 8, fontSize: 12, color: "#94a3b8", width: 60 }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 14, color: "#334155", flex: 1 }}>{value}</Text>
    </View>
  );
}
