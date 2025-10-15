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

  const cardWidth = layout === "carousel" ? 180 : undefined;
  return (
    <View
      style={{
        width: cardWidth,
        flex: cardWidth ? undefined : 1,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(12, 70, 65, 0.12)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginRight: layout === "carousel" ? 12 : 0,
        marginLeft: layout === "carousel" ? 0 : 0,
      }}
    >
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable className="active:opacity-95">
          {/* Product Image Container */}
          <View className="relative h-44 w-full overflow-hidden rounded-t-[20px] bg-slate-50">
            <LinearGradient
              colors={["#f0fdf4", "#ecfdf5", "#ffffff"]}
              className="h-full w-full items-center justify-center p-4"
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
                <View className="h-24 w-24 items-center justify-center rounded-2xl bg-primary-100">
                  <Feather
                    name="image"
                    size={40}
                    color={theme.colors.primary[500]}
                  />
                </View>
              )}
            </LinearGradient>

            {/* Discount Badge */}
            {discount > 0 ? (
              <View className="absolute right-2.5 top-2.5 rounded-full bg-red-500 px-2.5 py-1.5 shadow-lg">
                <Text className="text-[11px] font-bold text-white">
                  -{discount}%
                </Text>
              </View>
            ) : null}
          </View>

          {/* Product Info */}
          <View className="space-y-1.5 px-3.5 pb-4 pt-3">
            <Text
              numberOfLines={2}
              className="min-h-[42px] text-[14px] font-semibold leading-snug text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>

            <Text className="text-[11px] text-slate-500">
              {variantLabel ? variantLabel : `${product.stock ?? 0} in stock`}
            </Text>

            {/* Price and Add Button */}
            <View className="flex-row items-center justify-between pt-1.5">
              <View className="flex-1">
                <Text className="font-display text-[17px] font-bold text-primary-600">
                  {formatCurrency(price, currency)}
                </Text>
                {originalPrice > price ? (
                  <Text className="text-[11px] text-slate-400 line-through">
                    {formatCurrency(originalPrice, currency)}
                  </Text>
                ) : null}
              </View>

              <Pressable
                onPress={handleAdd}
                className="h-10 w-10 items-center justify-center rounded-xl active:scale-95"
                style={{
                  backgroundColor: theme.colors.primary[500],
                  shadowColor: theme.colors.primary[700],
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                accessibilityLabel="Add to cart"
              >
                <Feather
                  name="plus"
                  size={18}
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
