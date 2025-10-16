import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
  badgeLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  className,
  badgeLabel,
}) => (
  <View
    className={cn(
      "mb-6 flex-row items-end justify-between",
      className
    )}
  >
    <View className="flex-1">
      {badgeLabel ? (
        <LinearGradient
          colors={["rgba(34,197,94,0.16)", "rgba(34,197,94,0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mb-2 self-start rounded-full px-3 py-1.5"
        >
          <Text className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary-700">
            {badgeLabel}
          </Text>
        </LinearGradient>
      ) : null}
      <Text className="font-display text-[22px] font-bold text-slate-900">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-[13px] text-slate-500">{subtitle}</Text>
      ) : null}
    </View>
    {actionLabel ? (
      <Pressable
        className="flex-row items-center rounded-full border border-emerald-100/80 bg-white/80 px-3 py-1.5 active:bg-primary-50/60"
        onPress={onActionPress}
      >
        <Text className="mr-1 text-[13px] font-semibold text-primary-600">
          {actionLabel}
        </Text>
        <Feather
          name="arrow-right"
          size={14}
          color={theme.colors.primary[600]}
        />
      </Pressable>
    ) : null}
  </View>
);
