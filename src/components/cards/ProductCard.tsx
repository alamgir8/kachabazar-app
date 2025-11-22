import { useState } from "react";
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
  const { addItem } = useCart();
  const { globalSetting } = useSettings();
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleCardPress = () => {
    setModalVisible(true);
  };

  const image = getProductImage(product);

  const cardWidth = layout === "carousel" ? 170 : undefined;
  const imageContainerHeight = layout === "carousel" ? 140 : 180;

  return (
    <>
      <View
        style={{
          width: cardWidth,
          flex: cardWidth ? undefined : 1,
          shadowColor: "rgba(22, 163, 74, 0.18)",
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.16,
          shadowRadius: 28,
          elevation: 12,
        }}
        className="overflow-hidden rounded-[32px] border border-teal-50 bg-white/95"
      >
        <Pressable onPress={handleCardPress} className="active:opacity-95">
          <LinearGradient
            colors={["rgba(255,255,255,0.98)", "rgba(240,253,244,0.95)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="relative w-full"
            style={{
              height: imageContainerHeight,
            }}
          >
            <View className="h-full w-full items-center justify-center p-4">
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              ) : (
                <LinearGradient
                  colors={["rgba(16,185,129,0.16)", "rgba(16,185,129,0.05)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-16 w-16 items-center justify-center rounded-2xl"
                >
                  <Feather name="image" size={28} color="#10b981" />
                </LinearGradient>
              )}
            </View>

            {discount > 0 ? (
              <LinearGradient
                colors={["#f97316", "#f59e0b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute right-3 top-3 rounded-full px-3 py-1.5"
              >
                <Text className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                  {discount}% OFF
                </Text>
              </LinearGradient>
            ) : null}

            {(product.stock ?? 0) < 10 && (product.stock ?? 0) > 0 ? (
              <View className="absolute left-3 top-3 rounded-full bg-emerald-100/90 px-3 py-1.5">
                <Text className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  {product.stock} left
                </Text>
              </View>
            ) : null}
          </LinearGradient>

          <View className="px-4 pb-4 pt-3 border-t border-teal-50">
            <Text
              numberOfLines={2}
              className="text-[15px] font-semibold leading-tight text-slate-900"
            >
              {getLocalizedValue(product.title)}
            </Text>

            {variantLabel ? (
              <View className="mt-2 self-start rounded-full bg-slate-100 px-3 py-1">
                <Text className="text-[11px] font-semibold text-slate-600">
                  {variantLabel}
                </Text>
              </View>
            ) : null}

            <View className="mt-3 flex-row items-end justify-between">
              <View className="flex-1 justify-between">
                <Text className="text-[16px] font-extrabold text-emerald-600">
                  {formatCurrency(price, currency)}
                </Text>
                {originalPrice > price ? (
                  <Text className="text-[12px] font-semibold text-slate-400 line-through">
                    {formatCurrency(originalPrice, currency)}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </Pressable>

        <Button
          title="Quick add"
          onPress={handleAdd}
          variant="cyan"
          height={32}
          className="mx-4 my-2 rounded-full"
        />
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
