import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Product } from "@/types";
import {
  calculateDiscountPercentage,
  formatCurrency,
  getLocalizedValue,
  getProductImage,
} from "@/utils";

interface ProductCardProps {
  product: Product;
  variantLabel?: string;
  onPressAdd?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variantLabel,
  onPressAdd,
}) => {
  const { addItem } = useCart();
  const { globalSetting } = useSettings();
  const price = product.prices?.price ?? 0;
  const currency = globalSetting?.default_currency ?? "$";
  const originalPrice = product.prices?.originalPrice ?? price;
  const discount = calculateDiscountPercentage(originalPrice, price);

  const handleAdd = () => {
    addItem({
      product,
      variantLabel,
    });
    onPressAdd?.();
  };

  const image = getProductImage(product);

  return (
    <View
      className="w-44 overflow-hidden rounded-3xl bg-white"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable>
          <LinearGradient
            colors={["#f0fdf4", "#ffffff"]}
            className="h-36 w-full items-center justify-center p-3"
          >
            <View className="relative h-full w-full items-center justify-center">
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full rounded-2xl"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-28 w-28 items-center justify-center rounded-2xl bg-green-100">
                  <Feather name="image" size={32} color="#16a34a" />
                </View>
              )}
              {discount > 0 ? (
                <View className="absolute right-0 top-0 rounded-full bg-red-500 px-2.5 py-1">
                  <Text className="text-xs font-bold text-white">
                    -{discount}%
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          <View className="p-4">
            <Text
              numberOfLines={2}
              className="mb-1 text-base font-bold leading-tight text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>
            <Text className="mb-3 text-xs text-slate-500">
              {variantLabel ? variantLabel : `${product.stock ?? 0} available`}
            </Text>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-display text-xl font-bold text-green-600">
                  {formatCurrency(price, currency)}
                </Text>
                {originalPrice > price ? (
                  <Text className="text-xs text-slate-400 line-through">
                    {formatCurrency(originalPrice, currency)}
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={handleAdd}
                className="h-11 w-11 items-center justify-center rounded-xl bg-green-600"
                style={{
                  shadowColor: "#16a34a",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                accessibilityLabel="Add to cart"
              >
                <Feather name="plus" size={20} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};
