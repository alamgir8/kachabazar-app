import { useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";

import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Product, CartItem } from "@/types";
import {
  formatCurrency,
  getLocalizedValue,
  getProductImage,
  calculateDiscountPercentage,
} from "@/utils";
import { ProductModal } from "../modal/ProductModal";
import Button from "@components/ui/Button";

interface ProductCardProps {
  product: Product;
  variantLabel?: string;
  onPressAdd?: () => void;
  layout?: "grid" | "carousel";
  attributes?: any[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variantLabel,
  onPressAdd,
  layout = "grid",
  attributes = [],
}) => {
  const { addItem, items, increment, decrement } = useCart();
  const { globalSetting } = useSettings();
  const [modalVisible, setModalVisible] = useState(false);
  const price = product.prices?.price ?? 0;
  const currency = globalSetting?.default_currency ?? "$";
  const originalPrice = product.prices?.originalPrice ?? price;
  const discount = calculateDiscountPercentage(originalPrice, price);

  // Get cart item quantity
  const cartItem = items.find(
    (item: CartItem) => item.product._id === product._id
  );
  const cartQuantity = cartItem?.quantity ?? 0;

  // Calculate average rating from product
  const totalReviews = product.total_reviews ?? 0;
  const averageRating = product.average_rating ?? 0;

  const handleAdd = () => {
    addItem({
      product,
      variantLabel,
    });
    onPressAdd?.();
  };

  const handleIncrement = () => {
    if (cartItem) {
      increment(cartItem.id);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      decrement(cartItem.id);
    }
  };

  const handleCardPress = () => {
    setModalVisible(true);
  };

  const image = getProductImage(product);

  const cardWidth = layout === "carousel" ? 240 : undefined;
  const imageContainerHeight = layout === "carousel" ? 140 : 180;
  const hasDiscount = discount > 0;

  return (
    <>
      <View
        style={[
          {
            width: cardWidth,
            flex: cardWidth ? undefined : 1,
          },
          hasDiscount ? styles.discountCardShadow : styles.regularCardShadow,
        ]}
        className={`flex overflow-hidden rounded-3xl ${
          hasDiscount ? "border-2 border-orange-300" : "border border-slate-200"
        } bg-white`}
      >
        <Pressable
          onPress={handleCardPress}
          className="active:opacity-95 flex-1"
        >
          {/* Image Container with different gradient based on discount */}
          <View
            className="relative w-full"
            style={{
              height: imageContainerHeight,
              backgroundColor: hasDiscount ? "#fff7ed" : "#f8fafc",
            }}
          >
            {/* Decorative gradient overlay for discount items */}
            {hasDiscount && (
              <LinearGradient
                colors={[
                  "rgba(251, 146, 60, 0.08)",
                  "rgba(249, 115, 22, 0.12)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}

            <View className="h-full w-full items-center justify-center p-4">
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Feather name="image" size={28} color="#94a3b8" />
                </View>
              )}
            </View>

            {/* Discount Badge - Top Right Corner */}
            {hasDiscount && (
              <View className="absolute right-0 top-0">
                <View
                  className="rounded-bl-2xl bg-red-500 px-3 py-1.5"
                  style={{
                    shadowColor: "#dc2626",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Text className="text-xs font-black text-white">
                    {discount} % Off
                  </Text>
                </View>
              </View>
            )}

            {/* Stock Badge */}
            {(product.stock ?? 0) < 10 && (product.stock ?? 0) > 0 && (
              <View className="absolute left-2 top-2 rounded-lg bg-emerald-500 px-2.5 py-1">
                <Text className="text-[10px] font-bold text-white">
                  {product.stock} left
                </Text>
              </View>
            )}

            {/* Cart Quantity Controls - Right side vertically centered */}
            {cartQuantity > 0 && (
              <View
                className="absolute right-0 top-1/2"
                style={{
                  transform: [{ translateY: -28 }],
                  shadowColor: "#10b981",
                  shadowOffset: { width: -2, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="items-center rounded-l-full py-1.5 px-2"
                  style={{ gap: 8 }}
                >
                  <Pressable
                    onPress={handleDecrement}
                    className="h-8 w-8 items-center justify-center rounded-full bg-white/30 active:bg-white/50"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="minus" size={16} color="#fff" />
                  </Pressable>
                  <Text className="text-base font-black text-white">
                    {cartQuantity}
                  </Text>
                  <Pressable
                    onPress={handleIncrement}
                    className="h-8 w-8 items-center justify-center rounded-full bg-white/30 active:bg-white/50"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="plus" size={16} color="#fff" />
                  </Pressable>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Content Section */}
          <View
            className={`flex-1 px-3 pb-3 pt-2.5 ${hasDiscount ? "bg-orange-50/30" : "bg-white"}`}
          >
            <Text
              numberOfLines={2}
              className="text-[14px] font-bold leading-snug text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>

            {/* Rating - with filled stars */}
            {totalReviews > 0 && (
              <View className="mt-1.5 flex-row items-center gap-1">
                <View className="flex-row items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= Math.round(averageRating);
                    return (
                      <View key={star}>
                        {isFilled ? (
                          <Text style={{ fontSize: 14, color: "#fbbf24" }}>
                            <FontAwesome
                              name="star"
                              size={14}
                              color="#fcb501"
                            />
                          </Text>
                        ) : (
                          <Text>
                            <Feather name="star" size={14} color="#b9ccf1" />
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
                <Text className="text-[12px] font-medium text-slate-500">
                  {averageRating.toFixed(1)} ({totalReviews})
                </Text>
              </View>
            )}

            {variantLabel && (
              <View className="mt-2 self-start rounded-full bg-slate-100 px-2.5 py-1">
                <Text className="text-[10px] font-semibold text-slate-600">
                  {variantLabel}
                </Text>
              </View>
            )}

            {/* Price Section */}
            <View className="mt-auto pt-2">
              {hasDiscount ? (
                <View className="gap-0.5 flex-row items-center justify-between">
                  <Text className="text-[18px] font-black text-red-600">
                    {formatCurrency(price, currency)}
                  </Text>
                  <Text className="text-[12px] font-semibold text-slate-400 line-through">
                    {formatCurrency(originalPrice, currency)}
                  </Text>
                </View>
              ) : (
                <Text className="text-[18px] font-black text-emerald-600">
                  {formatCurrency(price, currency)}
                </Text>
              )}
            </View>
          </View>
        </Pressable>

        {/* Add Button - Always at bottom */}
        <View
          className={`px-3 pb-3 ${hasDiscount ? "bg-orange-50/30" : "bg-white"}`}
        >
          <Pressable
            onPress={handleAdd}
            className={`flex-row items-center justify-center rounded-full py-2.5 ${hasDiscount ? "bg-rose-500" : "bg-emerald-500"}`}
            style={{
              shadowColor: hasDiscount ? "#ef4444" : "#10b981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text className="ml-1.5 text-sm font-bold text-white">
              Add to Cart
            </Text>
          </Pressable>
        </View>
      </View>

      <ProductModal
        product={product}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        attributes={attributes}
      />
    </>
  );
};

const styles = StyleSheet.create({
  regularCardShadow: {
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  discountCardShadow: {
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
});
