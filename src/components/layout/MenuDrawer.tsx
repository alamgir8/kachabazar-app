import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/theme";

type MenuItemProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  onPress: () => void;
  badge?: number;
};

const MenuItem = ({ icon, title, onPress, badge }: MenuItemProps) => (
  <Pressable
    onPress={onPress}
    className="mb-2 flex-row items-center rounded-2xl bg-white/70 px-4 py-4"
    style={{
      shadowColor: theme.colors.primary[900],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 3,
    }}
  >
    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-50">
      <Feather name={icon} size={20} color={theme.colors.primary[700]} />
    </View>
    <Text className="ml-4 flex-1 text-base font-medium text-slate-900">
      {title}
    </Text>
    {badge ? (
      <View className="mr-2 h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2">
        <Text className="text-xs font-bold text-white">{badge}</Text>
      </View>
    ) : null}
    <Feather name="chevron-right" size={20} color="#94a3b8" />
  </Pressable>
);

type MenuDrawerProps = {
  onClose: () => void;
};

export const MenuDrawer = ({ onClose }: MenuDrawerProps) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, "#ffffff"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary[600], theme.colors.accent[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 24, paddingVertical: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        >
          <Pressable
            onPress={onClose}
            className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Feather name="x" size={24} color="#fff" />
          </Pressable>

          {isAuthenticated ? (
            <View className="flex-row items-center">
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  className="h-16 w-16 rounded-full border-2 border-white/30"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/20">
                  <Text className="text-2xl font-bold text-white">
                    {user?.name?.[0] ?? "K"}
                  </Text>
                </View>
              )}
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-white">
                  {user?.name || "Guest User"}
                </Text>
                <Text className="mt-1 text-sm text-white/90">
                  {user?.email}
                </Text>
              </View>
            </View>
            ) : (
              <View>
                <Text className="mb-2 font-display text-2xl font-bold text-white">
                  Welcome to KachaBazar
                </Text>
                <Text className="text-sm text-white/90">
                  Sign in to access your account
                </Text>
              </View>
            )}
        </LinearGradient>

        {/* Main Navigation */}
        <View className="px-6 py-5">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </Text>
          <MenuItem
            icon="home"
            title="Home"
            onPress={() => navigate("/(tabs)")}
          />
          <MenuItem
            icon="grid"
            title="Categories"
            onPress={() => navigate("/(tabs)/categories")}
          />
          <MenuItem
            icon="search"
            title="Search"
            onPress={() => navigate("/search")}
          />
          <MenuItem
            icon="tag"
            title="Special Offers"
            onPress={() => navigate("/offers")}
          />
          <MenuItem
            icon="shopping-bag"
            title="My Orders"
            onPress={() => navigate("/orders")}
          />
          <MenuItem
            icon="shopping-cart"
            title="Cart"
            onPress={() => navigate("/(tabs)/cart")}
          />
        </View>

        {/* Account Section */}
        {isAuthenticated && (
          <View className="px-6 py-5">
            <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              My Account
            </Text>
            <MenuItem
              icon="user"
              title="Profile"
              onPress={() => navigate("/(tabs)/profile")}
            />
            <MenuItem
              icon="edit"
              title="Edit Profile"
              onPress={() => navigate("/profile/edit")}
            />
          </View>
        )}

        {/* Information */}
        <View className="px-6 py-5">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Information
          </Text>
          <MenuItem
            icon="info"
            title="About Us"
            onPress={() => navigate("/about-us")}
          />
          <MenuItem
            icon="phone"
            title="Contact Us"
            onPress={() => navigate("/contact-us")}
          />
          <MenuItem
            icon="help-circle"
            title="FAQs"
            onPress={() => navigate("/faq")}
          />
          <MenuItem
            icon="file-text"
            title="Terms & Conditions"
            onPress={() => navigate("/terms-and-conditions")}
          />
          <MenuItem
            icon="shield"
            title="Privacy Policy"
            onPress={() => navigate("/privacy-policy")}
          />
        </View>

        {/* Auth Actions */}
        <View className="px-6 py-6">
          {isAuthenticated ? (
            <Pressable
              onPress={() => {
                logout();
                onClose();
              }}
              className="flex-row items-center justify-center rounded-2xl bg-red-50 py-4"
            >
              <Feather name="log-out" size={20} color="#dc2626" />
              <Text className="ml-2 font-semibold text-red-600">Log Out</Text>
            </Pressable>
          ) : (
            <View className="gap-3">
              <Pressable
                onPress={() => navigate("/auth/login")}
                className="flex-row items-center justify-center rounded-2xl bg-primary-600 py-4"
              >
                <Feather name="log-in" size={20} color="#fff" />
                <Text className="ml-2 font-semibold text-white">Sign In</Text>
              </Pressable>
              <Pressable
                onPress={() => navigate("/auth/register")}
                className="flex-row items-center justify-center rounded-2xl border-2 border-primary-600 py-4"
              >
                <Feather name="user-plus" size={20} color="#1c7646" />
                <Text className="ml-2 font-semibold text-primary-600">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="mt-6 items-center px-6 pb-8">
          <Text className="text-xs text-slate-400">Version 1.0.0</Text>
          <Text className="mt-2 text-center text-xs text-slate-400">
            © 2024 KachaBazar. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
