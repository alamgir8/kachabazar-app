import { Tabs } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useCart } from "@/contexts/CartContext";
import { theme } from "@/theme";

const TabBarIcon = ({
  color,
  name,
  size = 22
}: {
  color: string;
  name: React.ComponentProps<typeof Feather>["name"];
  size?: number;
}) => <Feather name={name} size={size} color={color} />;

export default function TabsLayout() {
  const { totalItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 6
        },
        tabBarStyle: {
          height: 68,
          borderTopWidth: 0,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(15,118,110,0.08)",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 20
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
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
          )
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
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} size={23} />
          )
        }}
      />
    </Tabs>
  );
}
