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
  getProductImage
} from "@/utils";

interface ProductCardProps {
  product: Product;
  variantLabel?: string;
  onPressAdd?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variantLabel,
  onPressAdd
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
      variantLabel
    });
    onPressAdd?.();
  };

  const image = getProductImage(product);

  return (
    <View className="w-40 rounded-3xl bg-white p-4 shadow-[0_15px_35px_rgba(15,118,110,0.1)]">
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable className="space-y-4">
          <LinearGradient
            colors={["#effaf3", "#ffffff"]}
            className="h-32 w-full items-center justify-center rounded-2xl"
          >
            <View className="items-center justify-center">
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-28 w-28 rounded-2xl"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-24 w-24 items-center justify-center rounded-2xl bg-primary-100">
                  <Feather name="image" size={28} color="#199060" />
                </View>
              )}
              {discount > 0 ? (
                <View className="absolute left-2 top-2 rounded-full bg-accent-500/90 px-3 py-1">
                  <Text className="text-xs font-semibold text-white">
                    -{discount}%
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>
          <View>
            <Text
              numberOfLines={2}
              className="font-semibold text-slate-800"
            >
              {getLocalizedValue(product.title)}
            </Text>
            <Text className="mt-1 text-sm text-slate-400">
              {variantLabel
                ? variantLabel
                : `${product.stock ?? 0} in stock`}
            </Text>
          </View>
        </Pressable>
      </Link>
      <View className="mt-4 flex-row items-center justify-between">
        <View>
          <Text className="font-display text-lg text-slate-900">
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
          className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
          accessibilityLabel="Add to cart"
        >
          <Feather name="plus" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
};
