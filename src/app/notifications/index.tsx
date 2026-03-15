/**
 * Notifications Screen
 * Shows customer notifications with beautiful design and real-time updates
 */

import React, { useState, useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { ScreenHeader } from "@/components/ui";
import Button from "@/components/ui/Button";
import { NotificationItem } from "@/components/notifications";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCustomerNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries/useNotifications";
import type { CustomerNotification } from "@/services/tracking";

export default function NotificationsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isRefetching } =
    useCustomerNotifications(page);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refetch();
      }
    }, [isAuthenticated, refetch]),
  );

  const handleNotificationPress = (notification: CustomerNotification) => {
    // Mark as read
    if (notification.status === "unread") {
      markRead(notification._id);
    }

    // Navigate to tracking if tracking ID exists
    if (notification.trackingId) {
      router.push({
        pathname: "/tracking/[trackingId]",
        params: { trackingId: notification.trackingId },
      });
    } else if (notification.orderId) {
      router.push({
        pathname: "/orders/[id]",
        params: { id: notification.orderId },
      });
    }
  };

  const handleMarkAllRead = () => {
    markAllRead();
  };

  if (!isAuthenticated) {
    return (
      <Screen className="bg-slate-50 px-5">
        <ScreenHeader title="Notifications" />
        <View className="mt-8 rounded-3xl bg-white p-10 shadow-lg">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <Feather name="bell" size={28} color="#0f766e" />
          </View>
          <Text className="text-xl font-bold text-slate-900">
            Stay in the loop
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-slate-600">
            Sign in to receive order updates, delivery tracking, and special
            offers.
          </Text>
          <Button
            variant="primary"
            title="Login"
            className="mt-6"
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen className="items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="mt-4 text-sm text-slate-500">
          Loading notifications...
        </Text>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen className="bg-slate-50 px-5">
        <ScreenHeader title="Notifications" />
        <View className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Feather name="alert-circle" size={28} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-slate-900">
            Something went wrong
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-slate-600">
            Could not load notifications. Please try again.
          </Text>
          <Button
            variant="outline"
            title="Retry"
            className="mt-6"
            onPress={() => refetch()}
          />
        </View>
      </Screen>
    );
  }

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Screen edges={["bottom"]} className="bg-slate-50">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              setPage(1);
              refetch();
            }}
          />
        }
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 8,
          paddingHorizontal: 12,
        }}
        ListHeaderComponent={
          <View className="mb-4 px-1">
            <ScreenHeader
              title={
                unreadCount > 0 ? `${unreadCount} unread` : "All caught up"
              }
              subtitle="Notifications"
            />

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <Pressable
                onPress={handleMarkAllRead}
                disabled={isMarkingAll}
                className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 py-3 active:opacity-70"
              >
                <Feather name="check-circle" size={16} color="#0f766e" />
                <Text className="text-sm font-semibold text-teal-700">
                  {isMarkingAll ? "Marking..." : "Mark all as read"}
                </Text>
              </Pressable>
            )}
            <View className="h-2" />
          </View>
        }
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
          />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center px-6">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Feather name="bell-off" size={48} color="#94a3b8" />
            </View>
            <Text className="text-lg font-bold text-slate-900">
              No notifications yet
            </Text>
            <Text className="mt-2 text-center text-sm leading-relaxed text-slate-500">
              When you place an order, you'll see delivery updates and tracking
              info here.
            </Text>
            <Button
              variant="primary"
              title="Start shopping"
              className="mt-6"
              onPress={() => router.push("/search")}
            />
          </View>
        }
        ListFooterComponent={
          notifications.length > 0 &&
          data &&
          page < Math.ceil(data.total / 20) ? (
            <View className="items-center py-4">
              <Button
                title="Load More"
                variant="outline"
                onPress={() => setPage((p) => p + 1)}
              />
            </View>
          ) : notifications.length > 0 ? (
            <View className="items-center py-4">
              <Text className="text-xs text-slate-400">
                You've seen all notifications
              </Text>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}
