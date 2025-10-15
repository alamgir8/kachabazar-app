import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/queries/useOrders";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";
import { theme } from "@/theme";
import { useEffect } from "react";

type MenuItemProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  badge?: number;
};

const MenuItem = ({ icon, title, subtitle, onPress, badge }: MenuItemProps) => (
  <Pressable
    onPress={onPress}
    className="mb-3 flex-row items-center rounded-2xl bg-white/80 px-4 py-4"
    style={{
      shadowColor: "rgba(12, 70, 65, 0.3)",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 4,
    }}
  >
    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-50">
      <Feather name={icon} size={20} color="#147d71" />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-base font-semibold text-slate-900">{title}</Text>
      {subtitle && (
        <Text className="mt-0.5 text-xs text-slate-500">{subtitle}</Text>
      )}
    </View>
    {badge ? (
      <View className="mr-2 h-6 min-w-[24px] items-center justify-center rounded-full bg-accent-500 px-2">
        <Text className="text-xs font-bold text-white">{badge}</Text>
      </View>
    ) : null}
    <Feather name="chevron-right" size={20} color="#8c9ab5" />
  </Pressable>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, shippingAddress } = useAuth();
  const ordersQuery = useOrders();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, []);

  const stats = ordersQuery.data;

  return (
    <Screen scrollable edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 10,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-8">
          <LinearGradient
            colors={[theme.colors.primary[100], "#ffffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 16,
              borderRadius: 32,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: theme.colors.primary[800],
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 10,
            }}
          >
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                className="h-16 w-16 rounded-3xl"
              />
            ) : (
              <View className="h-16 w-16 items-center justify-center rounded-3xl bg-white/70">
                <Text className="text-xl font-bold text-primary-600">
                  {user?.name?.[0] ?? "K"}
                </Text>
              </View>
            )}
            <View className="ml-4 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                Member
              </Text>
              <Text className="mt-1 text-lg font-semibold text-slate-900">
                {user?.name}
              </Text>
              <Text className="text-sm text-slate-500">{user?.email}</Text>
            </View>
          </LinearGradient>

          <View
            className="mt-6 rounded-3xl bg-white/85 p-6"
            style={{
              shadowColor: "rgba(12, 70, 65, 0.25)",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.08,
              shadowRadius: 18,
              elevation: 7,
            }}
          >
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
            <EnhancedButton
              title="View order history"
              className="mt-5"
              onPress={() => router.push("/orders")}
            />
          </View>

          <View
            className="mt-6 rounded-3xl bg-white/85 p-6"
            style={{
              shadowColor: "rgba(12, 70, 65, 0.25)",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.08,
              shadowRadius: 18,
              elevation: 7,
            }}
          >
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
            <EnhancedButton
              title="Update profile"
              variant="ghost"
              className="mt-4"
              onPress={() => router.push("/profile/edit")}
            />
          </View>

          {/* Menu Items */}
          <View className="mt-6 rounded-3xl bg-white px-6 py-2 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
            <MenuItem
              icon="shopping-bag"
              title="My Orders"
              subtitle="View all your orders"
              badge={stats?.pending}
              onPress={() => router.push("/orders")}
            />
            <MenuItem
              icon="tag"
              title="Special Offers"
              subtitle="Exclusive deals for you"
              onPress={() => router.push("/offers")}
            />
            <MenuItem
              icon="info"
              title="About Us"
              subtitle="Learn more about KachaBazar"
              onPress={() => router.push("/about-us")}
            />
            <MenuItem
              icon="phone"
              title="Contact Us"
              subtitle="Get in touch with support"
              onPress={() => router.push("/contact-us")}
            />
            <MenuItem
              icon="help-circle"
              title="FAQs"
              subtitle="Frequently asked questions"
              onPress={() => router.push("/faq")}
            />
            <MenuItem
              icon="file-text"
              title="Terms & Conditions"
              subtitle="Read our terms of service"
              onPress={() => router.push("/terms-and-conditions")}
            />
            <MenuItem
              icon="shield"
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => router.push("/privacy-policy")}
            />
          </View>

          <EnhancedButton title="Log out" className="mt-6" onPress={logout} />
        </View>
      </ScrollView>
    </Screen>
  );
}
