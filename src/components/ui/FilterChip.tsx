import { Pressable, Text } from "react-native";

import { cn } from "@/utils/cn";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  onPress
}) => (
  <Pressable
    className={cn(
      "mr-3 mb-3 rounded-full border px-4 py-2",
      active
        ? "border-transparent bg-primary-500"
        : "border-slate-200 bg-white"
    )}
    onPress={onPress}
  >
    <Text
      className={cn(
        "text-sm font-semibold",
        active ? "text-white" : "text-slate-600"
      )}
    >
      {label}
    </Text>
  </Pressable>
);
