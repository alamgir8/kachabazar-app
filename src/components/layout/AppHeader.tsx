import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo, useState } from "react";

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
  const userName = useMemo(
    () => (user?.name ? user.name.split(" ")[0] : "there"),
    [user?.name]
  );

  return (
    <>
      <View
        className="pb-2"
        style={{
          paddingTop: Math.max(insets.top - theme.spacing.md, theme.spacing.sm),
        }}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.95)", "rgba(240,253,244,0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center rounded-3xl border border-white/60 px-4 py-4"
          style={{
            shadowColor: "rgba(22, 163, 74, 0.18)",
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          <Pressable
            onPress={() => setMenuOpen(true)}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 active:scale-95"
          >
            <Feather name="menu" size={24} color={theme.colors.primary[600]} />
          </Pressable>

          <View className="flex-1 px-4">
            <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500">
              {greeting || "Welcome"}
            </Text>
            <Text className="mt-1 text-[18px] font-extrabold text-slate-900">
              {isAuthenticated ? `Hi ${userName}!` : "Let's shop fresh"}
            </Text>
            <Text className="mt-1 text-[12px] text-slate-500">
              {isAuthenticated
                ? "Here are picks tailored for your kitchen today."
                : "Discover fresh produce and curated deals every day."}
            </Text>
          </View>

          <Link href="/(tabs)/profile" asChild>
            <Pressable className="h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white active:scale-95">
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  className="h-12 w-12"
                  resizeMode="cover"
                />
              ) : (
                <Feather
                  name="user"
                  size={22}
                  color={theme.colors.primary[600]}
                />
              )}
            </Pressable>
          </Link>
        </LinearGradient>
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
