import { Tabs } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { useCart } from "@/contexts/CartContext";
import { theme } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadNotificationCount } from "@/hooks/queries/useNotifications";

const TabBarIcon = ({
  color,
  name,
  size = 22,
}: {
  color: string;
  name: React.ComponentProps<typeof Feather>["name"];
  size?: number;
}) => <Feather name={name} size={size} color={color} />;

export default function TabsLayout() {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: unreadCount } = useUnreadNotificationCount();

  const NotificationBell = () => (
    <Pressable
      onPress={() => router.push("/notifications")}
      className="relative mr-4"
      hitSlop={8}
    >
      <Feather name="bell" size={22} color="#64748b" />
      {(unreadCount ?? 0) > 0 && (
        <View
          className="absolute -right-1.5 -top-1.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1"
          style={{ height: 18 }}
        >
          <Text className="text-[10px] font-bold text-white">
            {(unreadCount ?? 0) > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 8,
          marginTop: -4,
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerRight: () => (
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.push("/tracking")}
                className="mr-2"
                hitSlop={8}
              >
                <Feather name="navigation" size={20} color="#64748b" />
              </Pressable>
              <NotificationBell />
            </View>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <TabBarIcon name="shopping-bag" color={color} />
              {totalItems > 0 && (
                <View className="absolute -right-1 -top-1 rounded-full bg-primary-500 px-1">
                  <Text className="text-[10px] font-semibold text-white">
                    {totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name={isAuthenticated ? "profile" : "profile"}
        options={{
          title: isAuthenticated ? "Profile" : "Login",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} size={23} />
          ),
        }}
      />
    </Tabs>
  );
}
