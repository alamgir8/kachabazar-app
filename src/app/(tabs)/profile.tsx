import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/queries/useOrders";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, shippingAddress } = useAuth();
  const ordersQuery = useOrders();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  if (!isAuthenticated) {
    return (
      <Screen className="px-0">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 80
          }}
        >
          <View className="items-center rounded-3xl bg-white p-12 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Hey there
            </Text>
            <Text className="mt-2 text-center font-display text-3xl text-slate-900">
              Sign in to unlock curated experiences
            </Text>
            <Text className="mt-4 text-center text-sm text-slate-500">
              Track orders, save multiple addresses, rate your favourites, and
              enjoy personalised deals tailored for you.
            </Text>
            <Button
              title="Login to your account"
              className="mt-6 w-full"
              onPress={() => router.push("/auth/login")}
            />
            <Button
              title="Create a new account"
              variant="ghost"
              className="mt-3 w-full"
              onPress={() => router.push("/auth/register")}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }

  const stats = ordersQuery.data;

  return (
    <Screen className="px-0" scrollable>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 flex-row items-center rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <Text className="text-xl font-bold text-primary-600">
                {user?.name?.[0] ?? "K"}
              </Text>
            </View>
          )}
          <View className="ml-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Member
            </Text>
            <Text className="mt-1 text-lg font-semibold text-slate-900">
              {user?.name}
            </Text>
            <Text className="text-sm text-slate-500">{user?.email}</Text>
          </View>
        </View>

        <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
          <Text className="text-base font-semibold text-slate-900">
            Quick stats
          </Text>
          <View className="mt-4 flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-slate-900">
                {stats?.orders.length ?? 0}
              </Text>
              <Text className="text-xs text-slate-500">Orders</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-slate-900">
                {stats?.pending ?? 0}
              </Text>
              <Text className="text-xs text-slate-500">Pending</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-slate-900">
                {stats?.delivered ?? 0}
              </Text>
              <Text className="text-xs text-slate-500">Delivered</Text>
            </View>
          </View>
          {stats?.orders[0] ? (
            <Text className="mt-4 text-xs text-slate-500">
              Recent total: {formatCurrency(stats.orders[0].total, currency)}
            </Text>
          ) : null}
          <Button
            title="View order history"
            className="mt-5"
            onPress={() => router.push("/orders")}
          />
        </View>

        <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
          <Text className="text-base font-semibold text-slate-900">
            Default delivery address
          </Text>
          {shippingAddress ? (
            <View className="mt-3 space-y-1">
              {shippingAddress.name ? (
                <Text className="text-sm text-slate-600">
                  {shippingAddress.name}
                </Text>
              ) : null}
              {shippingAddress.contact ? (
                <Text className="text-sm text-slate-600">
                  {shippingAddress.contact}
                </Text>
              ) : null}
              {shippingAddress.address ? (
                <Text className="text-sm text-slate-600">
                  {shippingAddress.address}
                </Text>
              ) : null}
              <Text className="text-sm text-slate-600">
                {[shippingAddress.city, shippingAddress.country]
                  .filter(Boolean)
                  .join(", ")}{" "}
                {shippingAddress.zipCode}
              </Text>
            </View>
          ) : (
            <Text className="mt-3 text-sm text-slate-500">
              Add an address during checkout to enjoy one tap ordering.
            </Text>
          )}
          <Button
            title="Update profile"
            variant="ghost"
            className="mt-4"
            onPress={() => router.push("/profile/edit")}
          />
        </View>

        <Button title="Log out" className="mt-6" onPress={logout} />
      </ScrollView>
    </Screen>
  );
}
