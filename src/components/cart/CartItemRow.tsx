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
    <View
      className="mb-4 flex-row rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(15,118,110,0.08)]"
      style={{
        shadowColor: "#0f7669",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
      }}
    >
      {/* Product Image */}
      <View className="mr-4">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="h-20 w-20 rounded-2xl bg-slate-50"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
            <Feather name="image" size={28} color="#10b981" />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="flex-1 justify-between py-1">
        <View>
          <Text
            className="text-base font-bold text-slate-900 leading-snug"
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {item.variant ? (
            <Text className="mt-1 text-xs text-slate-500">{item.variant}</Text>
          ) : null}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary-600">
            {formatCurrency(item.price, currency)}
          </Text>
          <Text className="text-sm text-slate-500">× {item.quantity}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="ml-3 items-end justify-between py-1">
        <Pressable
          onPress={() => removeItem(item.id)}
          className="rounded-full bg-red-50 p-2 active:bg-red-100"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
        </Pressable>
        <QuantityStepper
          value={item.quantity}
          onIncrement={() => increment(item.id)}
          onDecrement={() => decrement(item.id)}
        />
      </View>
    </View>
  );
};
