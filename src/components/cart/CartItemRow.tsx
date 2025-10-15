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
    <View className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50/30 shadow-[0_8px_30px_rgba(15,118,110,0.12)]">
      {/* Decorative gradient bar */}
      <View className="h-1.5 w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

      {/* Main content */}
      <View className="flex-row items-start p-4">
        {/* Product Image with Badge */}
        <View className="relative mr-4">
          {item.image ? (
            <View className="overflow-hidden rounded-2xl border-2 border-primary-100 shadow-lg">
              <Image
                source={{ uri: item.image }}
                className="h-28 w-28 bg-slate-50"
                resizeMode="cover"
              />
            </View>
          ) : (
            <View className="h-28 w-28 items-center justify-center rounded-2xl border-2 border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100/50">
              <Feather name="shopping-bag" size={36} color="#10b981" />
            </View>
          )}

          {/* Quantity Badge with modern design */}
          <View className="absolute -top-2 -right-2 min-w-[32px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary-500 to-primary-600 px-2.5 py-1.5 shadow-xl">
            <Text className="text-xs font-bold text-white">
              ×{item.quantity}
            </Text>
          </View>
        </View>

        {/* Product Details */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text
                className="font-display text-[16px] font-semibold leading-snug text-slate-900"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              {item.variant ? (
                <View className="mt-2 inline-flex self-start rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/60 px-3 py-1.5">
                  <Text className="text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                    {item.variant}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Delete Button */}
            <Pressable
              onPress={() => removeItem(item.id)}
              className="items-center justify-center rounded-2xl bg-red-50 p-2.5 active:bg-red-100"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="trash-2" size={18} color="#ef4444" />
            </Pressable>
          </View>

          {/* Price and Quantity Controls */}
          <View className="mt-4 flex-row items-end justify-between">
            <View>
              <Text className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Total
              </Text>
              <Text className="mt-0.5 font-display text-2xl font-bold text-slate-900">
                {formatCurrency(lineTotal, currency)}
              </Text>
              <Text className="mt-0.5 text-[12px] text-slate-400">
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

      {/* Bottom Info Bar with gradient */}
      <View className="flex-row items-center justify-between border-t border-primary-100/50 bg-gradient-to-r from-primary-50/80 to-emerald-50/60 px-4 py-3">
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-primary-500/20 p-1">
            <Feather name="check-circle" size={14} color="#10b981" />
          </View>
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-primary-700">
            Fresh & Quality Guaranteed
          </Text>
        </View>
        <View className="rounded-full bg-white px-3 py-1 shadow-sm">
          <Text className="text-[12px] font-bold text-primary-600">
            {formatCurrency(lineTotal, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};
