import { Feather } from "@expo/vector-icons";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
      <View style={{ paddingTop: insets.top > 0 ? insets.top + 12 : 12 }}>
        <View
          className="mb-6 overflow-hidden rounded-3xl"
          style={{
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.6)",
            backgroundColor: theme.colors.glass,
            shadowColor: theme.colors.primary[900],
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.12,
            shadowRadius: 28,
            elevation: 12,
          }}
        >
          <LinearGradient
            colors={["rgba(38, 189, 166, 0.25)", "rgba(162, 109, 255, 0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View className="flex-row items-center justify-between px-5 py-4">
            <Pressable
              onPress={() => setMenuOpen(true)}
              className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-white/70"
              style={{
                shadowColor: theme.colors.primary[700],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Feather name="menu" size={22} color={theme.colors.primary[700]} />
            </Pressable>

            <View className="flex-1 px-1">
              <Text className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                {greeting || "Welcome"}
              </Text>
              <Text className="mt-1 font-display text-[22px] leading-7 text-slate-900">
                {isAuthenticated
                  ? `Hi ${user?.name?.split(" ")[0] || "there"}, let’s shop!`
                  : "Fresh groceries, delivered beautifully."}
              </Text>
            </View>

            <Link href="/(tabs)/profile" asChild>
              <Pressable
                className="ml-3 h-12 w-12 items-center justify-center rounded-2xl bg-white/80"
                style={{
                  shadowColor: theme.colors.accent[500],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.18,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                {user?.image ? (
                  <Image
                    source={{ uri: user.image }}
                    className="h-12 w-12 rounded-2xl"
                  />
                ) : (
                  <Feather
                    name="user"
                    size={22}
                    color={theme.colors.accent[600]}
                  />
                )}
              </Pressable>
            </Link>
          </View>
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
