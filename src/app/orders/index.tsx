import { useState, useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { useOrders } from "@/hooks/queries/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isRefetching } = useOrders(page);
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const hasMore = data ? page < (data.pages ?? 1) : false;
  const [loadingMore, setLoadingMore] = useState(false);

  // Refetch orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && user) {
        refetch();
      }
    }, [isAuthenticated, user, refetch])
  );

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !isRefetching) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      setTimeout(() => setLoadingMore(false), 500);
    }
  };

  if (!isAuthenticated) {
    return (
      <Screen className="bg-slate-50 px-5 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-lg">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <Feather name="package" size={28} color="#0f766e" />
          </View>
          <Text className="text-xl font-bold text-slate-900">
            Track your orders in one place
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-slate-600">
            Sign in to view order history and reorder favourites in a single
            tap.
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
      <Screen className="items-center justify-center bg-slate-50 px-5">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="mt-4 text-sm text-slate-500">
          Fetching your orders...
        </Text>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen className="bg-slate-50 px-5 pt-24">
        <BackButton subTitle="Orders" />
        <View className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Feather name="alert-circle" size={28} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-slate-900">
            Unable to load orders
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-slate-600">
            Please check your connection and try again.
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

  const orders = data?.orders ?? [];

  return (
    <Screen edges={["bottom"]} className="bg-slate-50">
      <FlatList
        data={orders}
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
          paddingBottom: 10,
          paddingTop: 8,
          paddingHorizontal: 8,
        }}
        ListHeaderComponent={
          <View className="mb-6 px-1">
            {/* Header */}
            <BackButton
              subTitle="Orders"
              subDescription="Check your order history"
            />
            <View className="h-3" />

            {/* Order Stats */}
            {data && data.totalDoc > 0 && (
              <View className="mb-4 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                  <Text className="text-2xl font-black text-teal-600">
                    {data.totalDoc}
                  </Text>
                  <Text className="mt-1 text-xs font-semibold text-slate-500">
                    Total Orders
                  </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                  <Text className="text-2xl font-black text-green-600">
                    {data.delivered ?? 0}
                  </Text>
                  <Text className="mt-1 text-xs font-semibold text-slate-500">
                    Delivered
                  </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                  <Text className="text-2xl font-black text-amber-600">
                    {data.pending ?? 0}
                  </Text>
                  <Text className="mt-1 text-xs font-semibold text-slate-500">
                    Pending
                  </Text>
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const placedDate = new Date(item.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          );

          const statusBg =
            item.status === "delivered"
              ? "bg-emerald-100"
              : item.status === "pending"
                ? "bg-amber-100"
                : item.status === "processing"
                  ? "bg-blue-100"
                  : "bg-slate-100";

          const statusText =
            item.status === "delivered"
              ? "text-emerald-700"
              : item.status === "pending"
                ? "text-amber-700"
                : item.status === "processing"
                  ? "text-blue-700"
                  : "text-slate-700";

          return (
            <View className="mb-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-600">
              <View className="px-5 py-4">
                {/* Row 1: Invoice + Status */}
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Invoice
                    </Text>
                    <Text className="mt-1 text-sm font-semibold text-slate-900">
                      #{item.invoice ?? "--"}
                    </Text>
                  </View>

                  <View className={`rounded-full px-3 py-1 ${statusBg}`}>
                    <Text
                      className={`text-[11px] font-semibold uppercase tracking-wide ${statusText}`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Row 2: Total amount */}
                <View className="mt-3">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total amount
                  </Text>
                  <Text className="mt-1 text-xl font-extrabold text-emerald-600">
                    {formatCurrency(item.total, currency)}
                  </Text>
                </View>

                {/* Row 3: Meta info */}
                <View className="mt-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Feather name="calendar" size={14} color="#64748b" />
                    <Text className="text-sm text-slate-600">{placedDate}</Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Feather name="shopping-bag" size={14} color="#64748b" />
                    <Text className="text-sm text-slate-600">
                      {item.cart.length}{" "}
                      {item.cart.length === 1 ? "item" : "items"}
                    </Text>
                  </View>
                </View>

                {/* CTA */}
                <Button
                  title="View details"
                  variant="outline"
                  className="mt-4"
                  onPress={() =>
                    router.push({
                      pathname: "/orders/[id]",
                      params: { id: item._id },
                    })
                  }
                />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="mt-20 items-center px-6">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Feather name="inbox" size={48} color="#94a3b8" />
            </View>
            <Text className="text-lg font-bold text-slate-900">
              No orders yet
            </Text>
            <Text className="mt-2 text-center text-sm leading-relaxed text-slate-500">
              Explore the store and add your favourite groceries to the cart.
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
          hasMore ? (
            <View className="items-center py-6">
              {loadingMore ? (
                <ActivityIndicator size="small" color="#0f766e" />
              ) : (
                <Button
                  title="Load More Orders"
                  variant="outline"
                  onPress={handleLoadMore}
                />
              )}
            </View>
          ) : data && data.orders.length > 0 ? (
            <View className="items-center py-6">
              <Text className="text-xs text-slate-400">
                You've reached the end
              </Text>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}
