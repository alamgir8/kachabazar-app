import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

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
      <Text className="font-display text-xl text-slate-900">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>
      ) : null}
    </View>
    {actionLabel ? (
      <Pressable
        className="flex-row items-center rounded-full bg-primary-50 px-3 py-2"
        onPress={onActionPress}
      >
        <Text className="mr-1 text-sm font-semibold text-primary-500">
          {actionLabel}
        </Text>
        <Feather name="arrow-right" size={16} color="#35b06f" />
      </Pressable>
    ) : null}
  </View>
);
