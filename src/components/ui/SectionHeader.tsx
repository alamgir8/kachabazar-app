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
  badgeLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  className,
  badgeLabel = "Featured",
}) => (
  <View className={cn("mb-4 flex-row items-center justify-between", className)}>
    <View className="flex-1">
      {badgeLabel ? (
        <View className="mb-1.5 self-start rounded-full bg-primary-50 px-2.5 py-1">
          <Text className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600">
            {badgeLabel}
          </Text>
        </View>
      ) : null}
      <Text className="font-display text-[20px] font-bold text-slate-900">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-0.5 text-[13px] text-slate-500">{subtitle}</Text>
      ) : null}
    </View>
    {actionLabel ? (
      <Pressable
        className="flex-row items-center rounded-full px-2.5 py-1.5 active:bg-primary-50"
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
