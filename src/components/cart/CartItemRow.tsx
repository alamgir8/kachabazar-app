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

  const lineTotal = item.price * item.quantity;

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <View className="relative">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="h-20 w-20 rounded-xl bg-slate-50"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-xl bg-primary-50">
            <Feather name="shopping-bag" size={28} color="#22c55e" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text
              className="text-base font-semibold leading-snug text-slate-900"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {item.variant ? (
              <Text className="mt-1 text-xs text-slate-500">
                {item.variant}
              </Text>
            ) : null}
          </View>

          <Pressable
            onPress={() => removeItem(item.id)}
            className="rounded-full bg-red-50 p-2 active:bg-red-100"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="trash-2" size={16} color="#ef4444" />
          </Pressable>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-primary-600">
              {formatCurrency(lineTotal, currency)}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <QuantityStepper
              value={item.quantity}
              onDecrement={() => decrement(item.id)}
              onIncrement={() => increment(item.id)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
