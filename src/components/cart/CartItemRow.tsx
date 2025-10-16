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
    <View
      className="rounded-[32px] border border-white/70 bg-white/96 px-4 py-4"
      style={{
        shadowColor: "rgba(15, 118, 110, 0.12)",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.16,
        shadowRadius: 24,
        elevation: 10,
      }}
    >
      <View className="flex-row items-start gap-4">
        <View className="relative">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="h-24 w-24 rounded-[24px] bg-slate-50"
              resizeMode="cover"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-[24px] bg-emerald-50">
              <Feather name="shopping-bag" size={32} color="#10b981" />
            </View>
          )}
          <View className="absolute -right-2 -top-2 rounded-full bg-emerald-500 px-3 py-1 shadow-lg">
            <Text className="text-[11px] font-bold text-white">
              ×{item.quantity}
            </Text>
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text
                className="font-display text-[16px] font-semibold leading-snug text-slate-900"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              {item.variant ? (
                <View className="mt-2 self-start rounded-full bg-emerald-100 px-3 py-1">
                  <Text className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
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
              <Text className="text-[13px] font-semibold text-emerald-600">
                {formatCurrency(lineTotal, currency)}
              </Text>
              <Text className="mt-1 text-[11px] text-slate-400">
                {formatCurrency(item.price, currency)} × {item.quantity}
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
    </View>
  );
};
