import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View, Modal } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";
import { MenuDrawer } from "./MenuDrawer";

export const AppHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { storeCustomization } = useSettings();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const greeting =
    storeCustomization?.navbar &&
    getLocalizedValue(
      storeCustomization.navbar.greeting as Record<string, string>
    );

  return (
    <>
      <View
        className="mb-6 flex-row items-center justify-between px-1"
        style={{ paddingTop: insets.top > 0 ? insets.top + 8 : 8 }}
      >
        <Pressable
          onPress={() => setMenuOpen(true)}
          className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-slate-100"
        >
          <Feather name="menu" size={22} color="#1c7646" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-sm text-slate-400">
            {greeting || "Welcome to KachaBazar"}
          </Text>
          <Text className="font-display text-2xl text-slate-900">
            {isAuthenticated
              ? `Hello, ${user?.name?.split(" ")[0] || "there"}!`
              : "Fresh groceries, delivered."}
          </Text>
        </View>

        <Link href="/(tabs)/profile" asChild>
          <Pressable className="ml-4 h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <Feather name="user" size={22} color="#1c7646" />
            )}
          </Pressable>
        </Link>
      </View>

      <Modal
        visible={menuOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setMenuOpen(false)}
      >
        <MenuDrawer onClose={() => setMenuOpen(false)} />
      </Modal>
    </>
  );
};
