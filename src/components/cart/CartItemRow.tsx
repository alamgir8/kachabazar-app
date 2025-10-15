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
      className="flex-row rounded-2xl bg-white p-4 border border-slate-100"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Product Image */}
      <View className="mr-3">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="h-24 w-24 rounded-xl bg-slate-50"
            resizeMode="cover"
          />
        ) : (
          <View className="h-24 w-24 items-center justify-center rounded-xl bg-primary-50">
            <Feather name="image" size={32} color="#10b981" />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="flex-1 justify-between">
        <View className="flex-1">
          <Text
            className="text-base font-bold text-slate-900 leading-tight"
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {item.variant ? (
            <View className="mt-1.5 inline-flex self-start rounded-md bg-slate-100 px-2 py-0.5">
              <Text className="text-xs font-medium text-slate-600">
                {item.variant}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-primary-600">
              {formatCurrency(item.price * item.quantity, currency)}
            </Text>
            <Text className="text-xs text-slate-500">
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

      {/* Remove Button */}
      <View className="ml-2 justify-start">
        <Pressable
          onPress={() => removeItem(item.id)}
          className="rounded-lg bg-red-50 p-2 active:bg-red-100"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={18} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
};
