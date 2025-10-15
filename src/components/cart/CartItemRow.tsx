import { Image, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/types";
import { formatCurrency } from "@/utils";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useSettings } from "@/contexts/SettingsContext";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { increment, decrement, removeItem } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  return (
    <View className="mb-4 flex-row items-center rounded-3xl bg-white p-4 shadow-[0_12px_40px_rgba(15,118,110,0.08)]">
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          className="h-16 w-16 rounded-2xl"
          resizeMode="contain"
        />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
          <Feather name="image" size={20} color="#199060" />
        </View>
      )}
      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-slate-900">
          {item.name}
        </Text>
        {item.variant ? (
          <Text className="text-xs text-slate-500">{item.variant}</Text>
        ) : null}
        <Text className="mt-1 text-sm font-semibold text-primary-600">
          {formatCurrency(item.price, currency)} ·{" "}
          <Text className="text-slate-500">{item.quantity} pcs</Text>
        </Text>
      </View>
      <View className="items-end space-y-2">
        <QuantityStepper
          value={item.quantity}
          onIncrement={() => increment(item.id)}
          onDecrement={() => decrement(item.id)}
        />
        <Pressable
          onPress={() => removeItem(item.id)}
          className="flex-row items-center"
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
          <Text className="ml-1 text-xs font-semibold text-rose-500">Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};
