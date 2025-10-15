import { Pressable, Text } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  onPress,
}) => (
  <Pressable
    className={cn(
      "mr-2.5 mb-2.5 rounded-full px-5 py-2.5 active:scale-95",
      active ? "bg-primary-600" : "border border-slate-200 bg-white/90"
    )}
    style={
      active
        ? {
            shadowColor: theme.colors.primary[700],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
            elevation: 4,
          }
        : undefined
    }
    onPress={onPress}
  >
    <Text
      className={cn(
        "text-[13px] font-bold",
        active ? "text-white" : "text-slate-700"
      )}
    >
      {label}
    </Text>
  </Pressable>
);
