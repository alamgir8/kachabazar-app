import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { theme } from "@/theme";
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
      style={{
        width: 188,
        borderRadius: theme.borderRadius["2xl"],
        backgroundColor: theme.colors.glass,
        shadowColor: theme.colors.primary[900],
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.12,
        shadowRadius: 22,
        elevation: 10,
      }}
    >
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable>
          <LinearGradient
            colors={[theme.colors.primary[50], "#ffffff"]}
            className="h-40 w-full items-center justify-center"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="relative h-[92%] w-[90%] items-center justify-center rounded-[26px] bg-white/75">
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full rounded-[22px]"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-24 w-24 items-center justify-center rounded-3xl bg-primary-100">
                  <Feather
                    name="image"
                    size={28}
                    color={theme.colors.primary[600]}
                  />
                </View>
              )}
              {discount > 0 ? (
                <View className="absolute right-2 top-2 rounded-full bg-accent-500/90 px-2.5 py-1">
                  <Text className="text-[11px] font-semibold text-white">
                    -{discount}%
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          <View className="space-y-3 px-4 pb-4 pt-3">
            <Text
              numberOfLines={2}
              className="text-base font-semibold leading-tight text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>
            <Text className="text-xs text-slate-500">
              {variantLabel ? variantLabel : `${product.stock ?? 0} available`}
            </Text>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-display text-xl font-bold text-primary-700">
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
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: theme.colors.primary[600],
                  shadowColor: theme.colors.primary[700],
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.24,
                  shadowRadius: 6,
                  elevation: 6,
                }}
                accessibilityLabel="Add to cart"
              >
                <Feather name="plus" size={20} color={theme.colors.text.inverse} />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};
