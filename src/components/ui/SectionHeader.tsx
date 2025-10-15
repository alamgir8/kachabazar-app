import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  className
}) => (
  <View className={cn("mb-5 flex-row items-center justify-between", className)}>
    <View className="flex-1">
      <View className="mb-1 self-start rounded-full bg-white/70 px-3 py-1">
        <Text className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
          Featured
        </Text>
      </View>
      <Text className="font-display text-[22px] text-slate-900">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>
      ) : null}
    </View>
    {actionLabel ? (
      <Pressable
        className="flex-row items-center rounded-full bg-white/80 px-4 py-2"
        onPress={onActionPress}
      >
        <Text className="mr-2 text-sm font-semibold text-primary-600">
          {actionLabel}
        </Text>
        <Feather
          name="arrow-right"
          size={16}
          color={theme.colors.primary[600]}
        />
      </Pressable>
    ) : null}
  </View>
);
