import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useUnreadNotificationCount } from "@/hooks/queries/useNotifications";
import { MenuDrawer } from "./MenuDrawer";
import { theme } from "@/theme";

export const AppHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { storeCustomization } = useSettings();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: unreadCount } = useUnreadNotificationCount();

  return (
    <>
      <View className="pb-2">
        {/* Search Bar Row */}
        <View
          className="flex-row items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2"
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

          {/* Tracking Icon */}
          <Pressable
            onPress={() => router.push("/tracking")}
            className="h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 active:bg-emerald-100"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather name="navigation" size={17} color="#16a34a" />
          </Pressable>

          {/* Notification Bell */}
          <Pressable
            onPress={() => router.push("/notifications")}
            className="relative h-9 w-9 items-center justify-center rounded-xl bg-slate-50 active:bg-slate-100"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather name="bell" size={17} color="#64748b" />
            {(unreadCount ?? 0) > 0 && (
              <View
                className="absolute -right-1 -top-1 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1"
                style={{ height: 16 }}
              >
                <Text className="text-[9px] font-bold text-white">
                  {(unreadCount ?? 0) > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Menu Icon */}
          <Pressable
            onPress={() => setMenuOpen(true)}
            className="h-9 w-9 items-center justify-center rounded-xl bg-slate-50 active:bg-slate-100"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather name="menu" size={18} color={theme.colors.slate[700]} />
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
