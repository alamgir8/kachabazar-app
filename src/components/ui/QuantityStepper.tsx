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
  min = 1,
}) => (
  <View
    className={cn(
      "flex-row items-center rounded-2xl border-2 border-slate-200 bg-white shadow-sm",
      className
    )}
  >
    <Pressable
      accessibilityRole="button"
      className="rounded-l-2xl bg-slate-100 px-3.5 py-2.5 active:bg-slate-200"
      onPress={onDecrement}
      disabled={value <= min}
    >
      <Feather
        name="minus"
        size={18}
        color={value <= min ? "#cbd5e1" : "#0f172a"}
      />
    </Pressable>
    <View className="w-12 bg-white">
      <Text className="text-center text-base font-bold text-slate-900">
        {value}
      </Text>
    </View>
    <Pressable
      accessibilityRole="button"
      className="rounded-r-2xl bg-primary-500 px-3.5 py-2.5 active:bg-primary-600"
      onPress={onIncrement}
    >
      <Feather name="plus" size={18} color="#ffffff" />
    </Pressable>
  </View>
);
