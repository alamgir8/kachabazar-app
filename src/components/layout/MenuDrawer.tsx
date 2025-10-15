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
  <Pressable onPress={onPress} className="mb-2.5 active:scale-[0.98]">
    <View
      className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3.5"
      style={{
        shadowColor: "#0c4641",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
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
    <View style={{ flex: 1, backgroundColor: "#f8fafb" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary[600], theme.colors.primary[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 50,
            paddingBottom: 24,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Pressable
            onPress={onClose}
            className="mb-5 h-9 w-9 items-center justify-center rounded-lg bg-white/20 active:bg-white/30"
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
                <View className="h-12 w-12 items-center justify-center rounded-xl border-2 border-white/30 bg-white/20">
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

        {/* Main Navigation */}
        <View className="px-4 py-4">
          <Text className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
          <View className="px-4 py-4">
            <Text className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
        <View className="px-4 py-4">
          <Text className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
        <View className="px-4 py-4">
          {isAuthenticated ? (
            <Pressable
              onPress={() => {
                logout();
                onClose();
              }}
              className="flex-row items-center justify-center rounded-xl bg-red-50 py-3.5"
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
                className="flex-row items-center justify-center rounded-xl bg-primary-600 py-3.5"
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
                className="flex-row items-center justify-center rounded-xl border-2 border-primary-600 bg-white py-3.5"
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

        {/* Footer */}
        <View className="mt-4 items-center px-4 pb-8">
          <Text className="text-[11px] text-slate-400">Version 1.0.0</Text>
          <Text className="mt-1.5 text-center text-[11px] text-slate-400">
            © 2024 KachaBazar. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
