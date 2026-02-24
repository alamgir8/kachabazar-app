/**
 * DeliveryPartnerCard — Shows delivery boy info with avatar, vehicle, rating
 */

import React from "react";
import { View, Text, Linking, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { DeliveryBoyInfo } from "@/services/tracking";

interface DeliveryPartnerCardProps {
  deliveryBoy: DeliveryBoyInfo;
}

const getNameString = (name: Record<string, string> | string): string => {
  if (typeof name === "string") return name;
  return name?.en || Object.values(name)[0] || "Delivery Partner";
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const vehicleIcons: Record<string, keyof typeof Feather.glyphMap> = {
  bike: "truck",
  bicycle: "wind",
  car: "truck",
  van: "truck",
  scooter: "zap",
};

export const DeliveryPartnerCard: React.FC<DeliveryPartnerCardProps> = ({
  deliveryBoy,
}) => {
  const name = getNameString(deliveryBoy.name);
  const initials = getInitials(name);
  const vehicleIcon =
    vehicleIcons[deliveryBoy.vehicleType ?? ""] ?? "navigation";

  const handleCall = () => {
    if (deliveryBoy.phone) {
      Linking.openURL(`tel:${deliveryBoy.phone}`);
    }
  };

  return (
    <View
      className="overflow-hidden rounded-3xl bg-white shadow-lg"
      style={{
        shadowColor: "#0f766e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Header gradient */}
      <View className="px-5 py-4" style={{ backgroundColor: "#0f766e" }}>
        <View className="flex-row items-center gap-2">
          <Feather name="user-check" size={16} color="rgba(255,255,255,0.8)" />
          <Text className="text-sm font-semibold text-white/90">
            Delivery Partner
          </Text>
        </View>
      </View>

      <View className="px-5 py-5">
        {/* Avatar and info */}
        <View className="flex-row items-center gap-4">
          {/* Avatar circle */}
          <View
            className="h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "#e0f2f1" }}
          >
            <Text className="text-xl font-black" style={{ color: "#0f766e" }}>
              {initials}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900">{name}</Text>

            {/* Rating */}
            {(deliveryBoy.averageRating ?? 0) > 0 && (
              <View className="mt-1 flex-row items-center gap-1.5">
                <Feather name="star" size={14} color="#eab308" />
                <Text className="text-sm font-semibold text-slate-700">
                  {deliveryBoy.averageRating?.toFixed(1)}
                </Text>
                <Text className="text-xs text-slate-400">
                  ({deliveryBoy.totalRatings}{" "}
                  {deliveryBoy.totalRatings === 1 ? "rating" : "ratings"})
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Info rows */}
        <View className="mt-4 gap-3">
          {/* Vehicle */}
          {deliveryBoy.vehicleType && (
            <View className="flex-row items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-teal-50">
                <Feather name={vehicleIcon} size={16} color="#0f766e" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-slate-400">
                  Vehicle
                </Text>
                <Text className="text-sm font-semibold capitalize text-slate-700">
                  {deliveryBoy.vehicleType}
                  {deliveryBoy.vehicleNumber
                    ? ` • ${deliveryBoy.vehicleNumber}`
                    : ""}
                </Text>
              </View>
            </View>
          )}

          {/* Phone with call button */}
          {deliveryBoy.phone && (
            <Pressable
              onPress={handleCall}
              className="flex-row items-center gap-3 rounded-2xl bg-green-50 p-3 active:opacity-80"
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-green-100">
                <Feather name="phone" size={16} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-green-600">
                  Tap to call
                </Text>
                <Text className="text-sm font-semibold text-green-800">
                  {deliveryBoy.phone}
                </Text>
              </View>
              <Feather name="phone-call" size={18} color="#16a34a" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};
