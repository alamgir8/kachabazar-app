import { useState, useMemo, useCallback } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

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

  const cartItem = useMemo(
    () => items.find((item: CartItem) => item.product._id === product._id),
    [items, product._id]
  );
  const cartQuantity = cartItem?.quantity ?? 0;

  const totalReviews = product.total_reviews ?? 0;
  const averageRating = product.average_rating ?? 0;

  const handleAdd = useCallback(() => {
    addItem({ product, variantLabel });
    onPressAdd?.();
  }, [addItem, product, variantLabel, onPressAdd]);

  const handleIncrement = useCallback(() => {
    if (cartItem) increment(cartItem.id);
  }, [cartItem, increment]);

  const handleDecrement = useCallback(() => {
    if (cartItem) decrement(cartItem.id);
  }, [cartItem, decrement]);

  const handleCardPress = useCallback(() => {
    setModalVisible(true);
  }, []);

  const image = getProductImage(product);

  const cardWidth = layout === "carousel" ? 240 : undefined;
  const imageContainerHeight = layout === "carousel" ? 180 : 180;

  const hasDiscount = discount > 0;
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  return (
    <>
      {/* CARD WRAPPER */}
      <View
        style={{
          width: cardWidth,
          flex: cardWidth ? undefined : 1,
        }}
        className={[
          "flex overflow-hidden rounded-3xl bg-white",
          hasDiscount
            ? "border-2 border-accent-300 shadow-product-discount"
            : "border border-slate-200 shadow-product-regular",
        ].join(" ")}
      >
        <Pressable
          onPress={handleCardPress}
          className="flex-1 active:opacity-95"
        >
          {/* IMAGE CONTAINER */}
          <View
            className={`relative w-full ${
              hasDiscount ? "bg-accent-50" : "bg-slate-50"
            }`}
            style={{ height: imageContainerHeight }}
          >
            {/* DISCOUNT OVERLAY */}
            {hasDiscount && (
              <LinearGradient
                colors={["rgba(251,146,60,0.08)", "rgba(249,115,22,0.12)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
              />
            )}

            {/* PRODUCT IMAGE */}
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

            {/* STOCK BADGE (TOP LEFT) */}
            <View className="absolute left-0 top-0">
              <View
                className={[
                  "rounded-br-2xl px-3 py-1.5 shadow-badge-soft",
                  isOutOfStock ? "bg-rose-500" : "bg-emerald-500",
                ].join(" ")}
              >
                <Text className="text-xs font-black text-white">
                  {isOutOfStock ? "Out of stock" : `${stock} in stock`}
                </Text>
              </View>
            </View>

            {/* DISCOUNT BADGE (TOP RIGHT) */}
            {hasDiscount && (
              <View className="absolute right-0 top-0">
                <View className="rounded-bl-2xl bg-red-500 px-3 py-1.5 shadow-badge-soft">
                  <Text className="text-xs font-black text-white">
                    {discount}% Off
                  </Text>
                </View>
              </View>
            )}

            {/* LOW STOCK BADGE */}
            {stock < 10 && stock > 0 && (
              <View className="absolute left-2 top-2 rounded-lg bg-emerald-500 px-2.5 py-1 shadow-badge-soft">
                <Text className="text-[10px] font-bold text-white">
                  {stock} left
                </Text>
              </View>
            )}

            {/* CART QUANTITY CONTROLS */}
            {cartQuantity > 0 && (
              <View
                className="absolute right-0 top-1/2 rounded-md shadow-lg"
                style={{ transform: [{ translateY: -28 }] }}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="items-center rounded-l-full px-2 py-1.5 gap-2"
                >
                  <Pressable
                    onPress={handleDecrement}
                    className="h-8 w-8 items-center justify-center rounded-full bg-white/30 active:bg-white/50"
                    hitSlop={10}
                  >
                    <Feather name="minus" size={16} color="#fff" />
                  </Pressable>

                  <Text className="text-base font-black text-white">
                    {cartQuantity}
                  </Text>

                  <Pressable
                    onPress={handleIncrement}
                    className="h-8 w-8 items-center justify-center rounded-full bg-white/30 active:bg-white/50"
                    hitSlop={10}
                  >
                    <Feather name="plus" size={16} color="#fff" />
                  </Pressable>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* TEXT CONTENT SECTION */}
          <View
            className={[
              "flex-1 px-3 pb-3 pt-2.5",
              hasDiscount ? "bg-accent-50/30" : "bg-white",
            ].join(" ")}
          >
            {/* TITLE */}
            <Text
              numberOfLines={2}
              className="text-[14px] font-bold leading-snug text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>

            {/* RATING */}
            {totalReviews > 0 && (
              <View className="mt-1.5 flex-row items-center gap-1">
                <View className="flex-row items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= Math.round(averageRating);

                    return isFilled ? (
                      <FontAwesome
                        key={star}
                        name="star"
                        size={14}
                        color="#fcb501"
                      />
                    ) : (
                      <Feather
                        key={star}
                        name="star"
                        size={14}
                        color="#b9ccf1"
                      />
                    );
                  })}
                </View>
                <Text className="text-[12px] font-medium text-slate-500">
                  {averageRating.toFixed(1)} ({totalReviews})
                </Text>
              </View>
            )}

            {/* VARIANT LABEL */}
            {variantLabel && (
              <View className="mt-2 self-start rounded-full bg-slate-100 px-2.5 py-1">
                <Text className="text-[10px] font-semibold text-slate-600">
                  {variantLabel}
                </Text>
              </View>
            )}

            {/* PRICE */}
            <View className="mt-auto pt-2">
              {hasDiscount ? (
                <View className="flex-row items-center justify-between">
                  <Text className="text-[18px] font-black text-red-600">
                    {formatCurrency(price, currency)}
                  </Text>
                  <Text className="text-[12px] font-semibold text-slate-400 line-through">
                    {formatCurrency(originalPrice, currency)}
                  </Text>
                </View>
              ) : (
                <Text className="text-[18px] font-black text-primary-600">
                  {formatCurrency(price, currency)}
                </Text>
              )}
            </View>
          </View>
        </Pressable>

        {/* ADD TO CART BUTTON */}
        <View
          className={[
            "px-3 pb-3",
            hasDiscount ? "bg-accent-50/30" : "bg-white",
          ].join(" ")}
        >
          <Pressable
            onPress={handleAdd}
            disabled={isOutOfStock}
            className={[
              "flex-row items-center justify-center rounded-full py-2.5 shadow-md",
              isOutOfStock
                ? "bg-slate-300"
                : hasDiscount
                  ? "bg-rose-500"
                  : "bg-primary-500",
            ].join(" ")}
          >
            <Feather
              name={isOutOfStock ? "x-circle" : "plus"}
              size={16}
              color="#fff"
            />
            <Text className="ml-1.5 text-sm font-bold text-white">
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* PRODUCT MODAL */}
      <ProductModal
        product={product}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        attributes={attributes}
      />
    </>
  );
};
