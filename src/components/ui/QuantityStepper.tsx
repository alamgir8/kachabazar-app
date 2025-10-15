import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { cn } from "@/utils/cn";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
  min?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  className,
  min = 1
}) => (
  <View
    className={cn(
      "flex-row items-center rounded-full border border-slate-200 bg-white",
      className
    )}
  >
    <Pressable
      accessibilityRole="button"
      className="rounded-l-full bg-slate-100 px-3 py-2"
      onPress={onDecrement}
      disabled={value <= min}
    >
      <Feather
        name="minus"
        size={16}
        color={value <= min ? "#cbd5f5" : "#0f172a"}
      />
    </Pressable>
    <Text className="w-10 text-center text-base font-semibold text-slate-900">
      {value}
    </Text>
    <Pressable
      accessibilityRole="button"
      className="rounded-r-full bg-primary-500 px-3 py-2"
      onPress={onIncrement}
    >
      <Feather name="plus" size={16} color="#ffffff" />
    </Pressable>
  </View>
);
