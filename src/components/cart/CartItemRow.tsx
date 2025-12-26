import { memo, useCallback } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { CartItem } from "@/types";
import { formatCurrency } from "@/utils";
import { useCart } from "@/contexts/CartContext";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useSettings } from "@/contexts/SettingsContext";

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRowComponent: React.FC<CartItemRowProps> = ({ item }) => {
  const { increment, decrement, removeItem } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const lineTotal = item.price * item.quantity;

  return (
    <View className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_20px_40px_rgba(15,118,110,0.08)]">
      <LinearGradient
        colors={["rgba(240,253,244,0.5)", "rgba(255,255,255,0.9)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0.6,
        }}
      />
      <View className="flex-row items-center gap-4 px-4 py-4">
        <View className="relative">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="h-20 w-20 rounded-2xl bg-slate-50"
              resizeMode="cover"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-50">
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

          <View className="mt-4 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-primary-600">
                {formatCurrency(lineTotal, currency)}
              </Text>
            </View>

            <QuantityStepper
              value={item.quantity}
              height="h-10"
              width="w-10"
              onDecrement={() => decrement(item.id)}
              onIncrement={() => increment(item.id)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

// Memoize to prevent unnecessary re-renders in FlatList
export const CartItemRow = memo(
  CartItemRowComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.quantity === nextProps.item.quantity &&
      prevProps.item.price === nextProps.item.price
    );
  }
);
