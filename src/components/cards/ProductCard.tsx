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
  layout?: "grid" | "carousel";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variantLabel,
  onPressAdd,
  layout = "grid",
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

  const cardWidth = layout === "carousel" ? 170 : undefined;
  const imageContainerHeight = layout === "carousel" ? 140 : 180;

  return (
    <View
      style={{
        width: cardWidth,
        flex: cardWidth ? undefined : 1,
      }}
      className="rounded-2xl bg-white border border-slate-100 overflow-hidden"
    >
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable className="active:opacity-90">
          {/* Product Image Container with modern gradient */}
          <View
            className="relative w-full bg-gradient-to-b from-slate-50 to-white"
            style={{ height: imageContainerHeight }}
          >
            <View className="h-full w-full items-center justify-center p-3">
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-xl bg-primary-50">
                  <Feather name="image" size={28} color="#10b981" />
                </View>
              )}
            </View>

            {/* Discount Badge - Top Right */}
            {discount > 0 ? (
              <View className="absolute right-2 top-2">
                <LinearGradient
                  colors={["#ef4444", "#dc2626"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-lg px-2 py-1 shadow-lg"
                  style={{
                    shadowColor: "#dc2626",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}
                >
                  <Text className="text-xs font-bold text-white">
                    -{discount}%
                  </Text>
                </LinearGradient>
              </View>
            ) : null}

            {/* Stock badge - Top Left */}
            {(product.stock ?? 0) < 10 && (product.stock ?? 0) > 0 ? (
              <View className="absolute left-2 top-2 rounded-lg bg-amber-500 px-2 py-1">
                <Text className="text-xs font-semibold text-white">
                  Only {product.stock} left
                </Text>
              </View>
            ) : null}
          </View>

          {/* Product Info with improved spacing */}
          <View className="px-3 pb-3 pt-2.5">
            <Text
              numberOfLines={2}
              className="mb-1 min-h-[36px] text-sm font-semibold leading-tight text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>

            {variantLabel && (
              <View className="mb-2 inline-flex self-start rounded-md bg-slate-100 px-1.5 py-0.5">
                <Text className="text-[10px] font-medium text-slate-600">
                  {variantLabel}
                </Text>
              </View>
            )}

            {/* Price Row with better alignment */}
            <View className="flex-row items-end justify-between mt-1">
              <View className="flex-1">
                <View className="flex-row items-baseline">
                  <Text className="text-lg font-bold text-primary-600">
                    {formatCurrency(price, currency)}
                  </Text>
                  {originalPrice > price && (
                    <Text className="ml-1.5 text-xs text-slate-400 line-through">
                      {formatCurrency(originalPrice, currency)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Add to Cart Button */}
              <Pressable
                onPress={handleAdd}
                className="active:scale-95"
                accessibilityLabel="Add to cart"
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    shadowColor: "#059669",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Feather name="plus" size={18} color="#ffffff" />
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};
