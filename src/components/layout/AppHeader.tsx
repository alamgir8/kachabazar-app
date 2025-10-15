import { Feather } from "@expo/vector-icons";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";
import { MenuDrawer } from "./MenuDrawer";
import { theme } from "@/theme";

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
      <View className="pb-2">
        <View className="flex-row items-center justify-between py-2">
          <Pressable
            onPress={() => setMenuOpen(true)}
            className="h-11 w-11 items-center justify-center rounded-xl bg-white active:scale-95"
            style={{
              shadowColor: "rgba(22, 163, 74, 0.12)",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Feather name="menu" size={22} color="#22c55e" />
          </Pressable>

          <View className="flex-1 px-4">
            <Text className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {greeting || "Welcome"}
            </Text>
            <Text className="mt-0.5 text-[17px] font-extrabold text-slate-900">
              {isAuthenticated
                ? `Hi ${user?.name?.split(" ")[0] || "there"}!`
                : "Let's shop fresh"}
            </Text>
          </View>

          <Link href="/(tabs)/profile" asChild>
            <Pressable
              className="h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white active:scale-95"
              style={{
                shadowColor: "rgba(22, 163, 74, 0.12)",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  className="h-11 w-11"
                  resizeMode="cover"
                />
              ) : (
                <Feather name="user" size={22} color="#22c55e" />
              )}
            </Pressable>
          </Link>
        </View>
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
