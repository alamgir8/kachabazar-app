import type { ReactNode } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { theme } from "@/theme";

type MenuItemProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  onPress: () => void;
  badge?: number;
};

type DrawerMenuItemProps = MenuItemProps & { isLast?: boolean };

const MenuItem = ({
  icon,
  title,
  onPress,
  badge,
  isLast = false,
}: DrawerMenuItemProps) => (
  <Pressable onPress={onPress} className="active:bg-slate-50">
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={!isLast ? styles.itemDivider : undefined}
    >
      <View className="flex-row items-center">
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
          <Feather name={icon} size={18} color={theme.colors.primary[600]} />
        </View>
        <Text className="ml-3 text-[15px] font-semibold text-slate-800">
          {title}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {badge ? (
          <View className="mr-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1.5">
            <Text className="text-[11px] font-bold text-white">{badge}</Text>
          </View>
        ) : null}
        <Feather name="chevron-right" size={16} color="#94a3b8" />
      </View>
    </View>
  </Pressable>
);

type DrawerSectionProps = {
  title: string;
  children: ReactNode;
};

const DrawerSection = ({ title, children }: DrawerSectionProps) => (
  <View className="mb-7">
    <Text className="mb-3 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
      {title}
    </Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

type MenuDrawerProps = {
  onClose: () => void;
};

export const MenuDrawer = ({ onClose }: MenuDrawerProps) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { globalSetting } = useSettings();
  const supportPhone = globalSetting?.contact || "+099949343";

  const navigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const mainMenuItems: MenuItemProps[] = [
    { icon: "home", title: "Home", onPress: () => navigate("/(tabs)") },
    {
      icon: "grid",
      title: "Categories",
      onPress: () => navigate("/(tabs)/categories"),
    },
    { icon: "search", title: "Search", onPress: () => navigate("/search") },
    {
      icon: "tag",
      title: "Special Offers",
      onPress: () => navigate("/offers"),
    },
    {
      icon: "shopping-bag",
      title: "My Orders",
      onPress: () => navigate("/orders"),
    },
    {
      icon: "shopping-cart",
      title: "Cart",
      onPress: () => navigate("/(tabs)/cart"),
    },
  ];

  const accountMenuItems: MenuItemProps[] = [
    {
      icon: "user",
      title: "Profile",
      onPress: () => navigate("/(tabs)/profile"),
    },
    {
      icon: "edit",
      title: "Edit Profile",
      onPress: () => navigate("/profile/edit"),
    },
  ];

  const infoMenuItems: MenuItemProps[] = [
    { icon: "info", title: "About Us", onPress: () => navigate("/about-us") },
    {
      icon: "phone",
      title: "Contact Us",
      onPress: () => navigate("/contact-us"),
    },
    { icon: "help-circle", title: "FAQs", onPress: () => navigate("/faq") },
    {
      icon: "file-text",
      title: "Terms & Conditions",
      onPress: () => navigate("/terms-and-conditions"),
    },
    {
      icon: "shield",
      title: "Privacy Policy",
      onPress: () => navigate("/privacy-policy"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafb" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 56, paddingHorizontal: 20 }}
      >
        <LinearGradient
          colors={[theme.colors.primary[600], theme.colors.primary[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 12,
            borderRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
          }}
        >
          <Pressable
            onPress={onClose}
            className="mb-5 h-9 w-9 items-center justify-center rounded-lg bg-white/15 active:bg-white/25"
          >
            <Feather name="x" size={20} color="#fff" />
          </Pressable>

          {isAuthenticated ? (
            <View className="flex-row items-center">
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  className="h-12 w-12 rounded-xl border-2 border-white/30"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15">
                  <Text className="text-lg font-bold text-white">
                    {user?.name?.[0] ?? "K"}
                  </Text>
                </View>
              )}
              <View className="ml-3.5 flex-1">
                <Text className="text-[17px] font-bold text-white">
                  {user?.name || "Guest User"}
                </Text>
                <Text className="mt-0.5 text-[13px] text-white/80">
                  {user?.email}
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text className="mb-1 text-lg font-bold text-white">
                Welcome to KachaBazar
              </Text>
              <Text className="text-[13px] text-white/80">
                Sign in to access your account
              </Text>
            </View>
          )}
        </LinearGradient>

        <View className="py-6">
          <DrawerSection title="Main Menu">
            {mainMenuItems.map((item, index) => (
              <MenuItem
                key={item.title}
                {...item}
                isLast={index === mainMenuItems.length - 1}
              />
            ))}
          </DrawerSection>

          {isAuthenticated ? (
            <DrawerSection title="My Account">
              {accountMenuItems.map((item, index) => (
                <MenuItem
                  key={item.title}
                  {...item}
                  isLast={index === accountMenuItems.length - 1}
                />
              ))}
            </DrawerSection>
          ) : null}

          <DrawerSection title="Information">
            {infoMenuItems.map((item, index) => (
              <MenuItem
                key={item.title}
                {...item}
                isLast={index === infoMenuItems.length - 1}
              />
            ))}
          </DrawerSection>

          <View className="mb-8 overflow-hidden rounded-[32px]">
            <LinearGradient
              colors={["#10b981", "#0ea5e9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20 }}
            >
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Need help?
              </Text>
              <Text className="mt-2 text-2xl font-extrabold text-white">
                Talk with our shopper
              </Text>
              <Text className="mt-2 text-sm text-white/90">
                We are online 24/7 for urgent deliveries & support.
              </Text>
              <Pressable
                onPress={() => {
                  onClose();
                  router.push("/contact-us" as any);
                }}
                className="mt-4 inline-flex items-center self-start rounded-full bg-white/20 px-4 py-2"
              >
                <Feather name="phone-call" size={16} color="#fff" />
                <Text className="ml-2 text-sm font-semibold text-white">
                  {supportPhone}
                </Text>
              </Pressable>
            </LinearGradient>
          </View>

          <View style={[styles.authCard, { marginTop: 8 }]}>
            {isAuthenticated ? (
              <Pressable
                onPress={() => {
                  logout();
                  onClose();
                }}
                className="flex-row items-center justify-center rounded-full bg-red-50 py-3.5 active:bg-red-100"
              >
                <Feather name="log-out" size={18} color="#dc2626" />
                <Text className="ml-2 text-[15px] font-semibold text-red-600">
                  Log Out
                </Text>
              </Pressable>
            ) : (
              <View className="gap-2.5">
                <Pressable
                  onPress={() => navigate("/auth/login")}
                  className="flex-row items-center justify-center rounded-full bg-primary-600 py-3.5 active:bg-primary-700"
                  style={{
                    shadowColor: theme.colors.primary[700],
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Feather name="log-in" size={18} color="#fff" />
                  <Text className="ml-2 text-[15px] font-semibold text-white">
                    Sign In
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => navigate("/auth/register")}
                  className="flex-row items-center justify-center rounded-full border-2 border-primary-600 bg-white py-3.5 active:bg-primary-50"
                >
                  <Feather
                    name="user-plus"
                    size={18}
                    color={theme.colors.primary[600]}
                  />
                  <Text className="ml-2 text-[15px] font-semibold text-primary-600">
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          <View className="mt-8 items-center">
            <Text className="text-[11px] text-slate-400">Version 1.0.0</Text>
            <Text className="mt-1.5 text-center text-[11px] text-slate-400">
              © 2024 KachaBazar. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(22, 163, 74, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    overflow: "hidden",
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(148, 163, 184, 0.25)",
  },
  authCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "rgba(22, 163, 74, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
});
