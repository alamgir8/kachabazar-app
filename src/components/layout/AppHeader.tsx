import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { MenuDrawer } from "./MenuDrawer";
import { theme } from "@/theme";

export const AppHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { storeCustomization } = useSettings();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View
        className="pb-2"
        // style={{
        //   paddingTop: Math.max(insets.top - theme.spacing.md, theme.spacing.sm),
        // }}
      >
        <View
          className="flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2"
          style={{
            shadowColor: "rgba(0, 0, 0, 0.08)",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Search Icon */}
          <View className="h-10 w-10 items-center justify-center">
            <Feather name="search" size={20} color="#64748b" />
          </View>

          {/* Search Input */}
          <Pressable onPress={() => router.push("/search")} className="flex-1">
            <Text className="text-sm text-slate-400">Search keywords...</Text>
          </Pressable>

          {/* Menu Icon */}
          <Pressable
            onPress={() => setMenuOpen(true)}
            className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 active:bg-slate-100"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="menu" size={20} color={theme.colors.slate[700]} />
          </Pressable>
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
