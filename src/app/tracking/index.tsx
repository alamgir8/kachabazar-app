/**
 * Tracking Search Screen
 * Users can enter a tracking ID to track their order
 */

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { ScreenHeader } from "@/components/ui";

export default function TrackingSearchScreen() {
  const router = useRouter();
  const [searchId, setSearchId] = useState("");

  const handleSearch = () => {
    const trimmed = searchId.trim();
    if (trimmed) {
      router.push({
        pathname: "/tracking/[trackingId]",
        params: { trackingId: trimmed },
      });
    }
  };

  return (
    <Screen edges={["bottom"]} className="bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 40,
        }}
      >
        <ScreenHeader title="Track Order" />
        <View className="mt-6">
          {/* Hero card */}
          <View
            className="overflow-hidden rounded-3xl bg-white shadow-lg"
            style={{
              shadowColor: "#0f766e",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <View
              className="items-center px-6 py-10"
              style={{ backgroundColor: "#0f766e" }}
            >
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <Feather name="package" size={40} color="#fff" />
              </View>
              <Text className="text-center text-2xl font-black text-white">
                Track Your Order
              </Text>
              <Text className="mt-2 text-center text-sm text-white/70">
                Enter your tracking ID to see real-time delivery updates
              </Text>
            </View>

            <View className="px-6 py-6">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tracking ID
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Feather name="search" size={18} color="#94a3b8" />
                  <TextInput
                    value={searchId}
                    onChangeText={setSearchId}
                    placeholder="KB-20250101-A1B2C3"
                    placeholderTextColor="#cbd5e1"
                    className="ml-3 flex-1 py-4 text-sm text-slate-700"
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                    autoCapitalize="characters"
                  />
                </View>
                <Pressable
                  onPress={handleSearch}
                  className="h-14 w-14 items-center justify-center rounded-2xl active:opacity-80"
                  style={{ backgroundColor: "#0f766e" }}
                >
                  <Feather name="arrow-right" size={22} color="#fff" />
                </Pressable>
              </View>

              <Pressable
                onPress={() => router.push("/orders")}
                className="mt-5 flex-row items-center justify-center gap-2 active:opacity-60"
              >
                <Feather name="list" size={14} color="#0f766e" />
                <Text className="text-sm font-semibold text-teal-700">
                  Find tracking ID in your orders
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
