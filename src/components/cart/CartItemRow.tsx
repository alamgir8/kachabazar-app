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
    <View className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_35px_rgba(15,118,110,0.08)]">
      <View className="h-1 w-full bg-primary-100" />

      <View className="flex-row items-start px-4 py-4">
        <View className="relative mr-3">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="h-24 w-24 rounded-2xl bg-slate-50"
              resizeMode="cover"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-2xl bg-primary-50">
              <Feather name="image" size={32} color="#10b981" />
            </View>
          )}

          <View className="absolute -top-2 -left-2 rounded-full border border-white bg-primary-500 px-2 py-1 shadow-md">
            <Text className="text-[11px] font-semibold uppercase text-white">
              x{item.quantity}
            </Text>
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between">
            <View className="flex-1 pr-3">
              <Text
                className="text-[15px] font-semibold leading-tight text-slate-900"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              {item.variant ? (
                <View className="mt-1 inline-flex self-start rounded-full bg-primary-50 px-2.5 py-1">
                  <Text className="text-[11px] font-medium text-primary-600">
                    {item.variant}
                  </Text>
                </View>
              ) : null}
            </View>

            <Pressable
              onPress={() => removeItem(item.id)}
              className="rounded-full bg-red-50 p-2 active:bg-red-100"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="trash-2" size={18} color="#ef4444" />
            </Pressable>
          </View>

          <View className="mt-4 flex-row items-end justify-between">
            <View>
              <Text className="text-xl font-bold text-slate-900">
                {formatCurrency(lineTotal, currency)}
              </Text>
              <Text className="text-[12px] text-slate-500">
                {formatCurrency(item.price, currency)} each
              </Text>
            </View>

            <QuantityStepper
              value={item.quantity}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
            />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
        <Text className="text-[12px] font-medium uppercase tracking-wide text-slate-500">
          Freshness guarantee
        </Text>
        <Text className="text-[12px] font-semibold text-primary-600">
          {formatCurrency(lineTotal, currency)}
        </Text>
      </View>
    </View>
  );
};
