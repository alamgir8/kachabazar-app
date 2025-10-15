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

  const cardWidth = layout === "carousel" ? 200 : undefined;
  return (
    <View
      style={{
        width: cardWidth,
        flex: cardWidth ? undefined : 1,
        borderRadius: 28,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(12, 70, 65, 0.16)",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.09,
        shadowRadius: 20,
        elevation: 8,
        marginRight: layout === "carousel" ? 16 : 0,
        marginLeft: layout === "carousel" ? 0 : 0,
      }}
    >
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable className="active:opacity-95">
          {/* Product Image Container */}
          <View className="relative h-44 w-full overflow-hidden rounded-t-[28px] bg-slate-50">
            <LinearGradient
              colors={["#e8f5f1", "#f0fdf4", "#ffffff"]}
              className="h-full w-full items-center justify-center p-3"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
                  <Feather
                    name="image"
                    size={32}
                    color={theme.colors.primary[500]}
                  />
                </View>
              )}
            </LinearGradient>

            {/* Discount Badge */}
            {discount > 0 ? (
              <View className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1.5 shadow-lg">
                <Text className="text-xs font-bold text-white">
                  -{discount}%
                </Text>
              </View>
            ) : null}
          </View>

          {/* Product Info */}
          <View className="space-y-2 px-4 pb-5 pt-4">
            <Text
              numberOfLines={2}
              className="min-h-[40px] text-[15px] font-semibold leading-tight text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>

            <Text className="text-xs text-slate-500">
              {variantLabel ? variantLabel : `${product.stock ?? 0} in stock`}
            </Text>

            {/* Price and Add Button */}
            <View className="flex-row items-center justify-between pt-1">
              <View className="flex-1">
                <Text className="font-display text-lg font-bold text-primary-600">
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
                className="h-11 w-11 items-center justify-center rounded-2xl active:scale-95"
                style={{
                  backgroundColor: theme.colors.primary[500],
                  shadowColor: theme.colors.primary[700],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.24,
                  shadowRadius: 6,
                  elevation: 6,
                }}
                accessibilityLabel="Add to cart"
              >
                <Feather
                  name="plus"
                  size={20}
                  color={theme.colors.text.inverse}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};
