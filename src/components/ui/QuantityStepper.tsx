import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { cn } from "@/utils/cn";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
  min?: number;
  height?: string;
  width?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  className,
  min = 1,
  height = "h-12",
  width = "w-16",
}) => (
  <View
    className={cn(
      "flex-row items-center rounded-full border border-slate-200 bg-white/90 shadow-sm",
      className
    )}
  >
    <Pressable
      accessibilityRole="button"
      className={cn(
        `${height} ${width} items-center justify-center rounded-full border border-slate-200 bg-white active:bg-slate-100`,
        value <= min && "opacity-50"
      )}
      onPress={onDecrement}
      disabled={value <= min}
    >
      <Feather
        name="minus"
        size={20}
        color={value <= min ? "#a8aeb6" : "#0f172a"}
      />
    </Pressable>
    <View className="mx-3 h-10 min-w-[48px] items-center justify-center">
      <Text className="text-base font-bold text-slate-900">{value}</Text>
    </View>
    <Pressable
      accessibilityRole="button"
      className={`${height} ${width} items-center justify-center rounded-full bg-emerald-500 active:bg-emerald-600 shadow-[0_6px_12px_rgba(16,185,129,0.4)]`}
      onPress={onIncrement}
    >
      <Feather name="plus" size={20} color="#ffffff" />
    </Pressable>
  </View>
);
