import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface ScreenHeaderProps {
  /** Screen title displayed next to the back button */
  title: string;
  /** Optional smaller label above the title */
  subtitle?: string;
  /** Custom back handler — defaults to router.back() */
  onBack?: () => void;
  /** Hide the back button (e.g. for root-level tabs) */
  hideBack?: boolean;
  /** Optional right-side actions */
  rightContent?: React.ReactNode;
  /** Extra className on the outer container */
  className?: string;
  /** Tint color for the back arrow icon */
  tint?: string;
}

/**
 * Unified screen header used across the entire app.
 * Provides a consistent 56px-tall row with back button + title.
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  hideBack = false,
  rightContent,
  className,
  tint = theme.colors.primary[700],
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View className={cn("h-14 flex-row items-center gap-3 mb-2", className)}>
      {/* Back button */}
      {!hideBack && (
        <Pressable
          onPress={handleBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-sm active:bg-white/95"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={20} color={tint} />
        </Pressable>
      )}

      {/* Title area */}
      <View className="flex-1 justify-center">
        {subtitle ? (
          <Text className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-500 mb-0.5">
            {subtitle}
          </Text>
        ) : null}
        <Text className="text-lg font-bold text-slate-900" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right actions */}
      {rightContent ? (
        <View className="flex-row items-center gap-2">{rightContent}</View>
      ) : null}
    </View>
  );
};
