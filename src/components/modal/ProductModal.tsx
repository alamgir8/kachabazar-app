import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

import { Product } from "@/types";
import { useProductAction } from "@/hooks/useProductAction";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import {
  formatCurrency,
  getLocalizedValue,
  getProductImage,
  calculateDiscountPercentage,
} from "@/utils";
import { HapticFeedback } from "@/utils/accessibility";
import { analytics } from "@/utils/analytics";
import Button from "../ui/Button";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MODAL_WIDTH = SCREEN_WIDTH - 32;

interface ProductModalProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
  attributes?: any[];
}

/**
 * Product Modal Component
 * Displays product details in a beautiful modal with variants/combinations
 * Similar to web version but optimized for mobile
 */
export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  visible,
  onClose,
  attributes = [],
}) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { globalSetting } = useSettings();
  const [quantity, setQuantity] = useState(1);

  const {
    price,
    stock,
    discount,
    selectedImage,
    originalPrice,
    selectVariant,
    setSelectVariant,
    setValue,
    variantTitle,
    handleAddToCart,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
  });

  const currency = globalSetting?.default_currency ?? "$";
  const productImage = selectedImage || getProductImage(product);
  const productName = getLocalizedValue(product.title);
  const productDescription = getLocalizedValue(product.description);
  const discountPercentage = calculateDiscountPercentage(originalPrice, price);

  const handleAddToCartClick = () => {
    const result = handleAddToCart(quantity);
    if (result.success) {
      HapticFeedback.success();
      analytics.trackAddToCart(product._id, productName, price, quantity);
      Alert.alert("Success", "Added to cart!", [
        { text: "Continue Shopping", onPress: onClose },
        {
          text: "View Cart",
          onPress: () => {
            onClose();
            router.push("/(tabs)/cart");
          },
        },
      ]);
    } else {
      HapticFeedback.error();
      Alert.alert("Error", result.message);
    }
  };

  const handleViewDetails = () => {
    onClose();
    router.push(`/product/${product.slug}`);
  };

  console.log("product.tag", product.tag);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <BlurView intensity={20} className="flex-1">
          <Pressable className="flex-1 justify-end" onPress={onClose}>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[40px] max-h-[90%]"
              style={{ width: SCREEN_WIDTH }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {/* Close Button */}
                <View className="absolute top-4 right-4 z-10">
                  <Pressable
                    onPress={onClose}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg"
                  >
                    <Feather name="x" size={20} color="#475569" />
                  </Pressable>
                </View>

                {/* Product Image */}
                <View className="relative h-80 w-full items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                  <OptimizedImage
                    source={productImage}
                    style={{ width: MODAL_WIDTH - 64, height: 280 }}
                    cachePolicy="memory-disk"
                    priority="high"
                  />

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <View className="absolute top-4 left-4">
                      <LinearGradient
                        colors={["#ef4444", "#dc2626"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-full px-4 py-2 shadow-lg"
                      >
                        <Text className="text-xs font-bold text-white">
                          {discountPercentage}% OFF
                        </Text>
                      </LinearGradient>
                    </View>
                  )}

                  {/* Stock Badge */}
                  <View className="absolute top-4 right-16">
                    <View
                      className={`rounded-full px-3 py-1.5 ${
                        stock > 0 ? "bg-emerald-50" : "bg-red-50"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          stock > 0 ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Product Info */}
                <View className="px-5 pt-4">
                  {/* Category & Rating */}
                  <View className="mb-3 flex-row items-center justify-between">
                    {product?.category &&
                      typeof product.category === "object" && (
                        <View className="flex-row items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5">
                          <Feather name="tag" size={12} color="#10b981" />
                          <Text className="text-xs font-bold uppercase tracking-wider text-primary-700">
                            {getLocalizedValue(
                              product?.category?.name as Record<string, string>
                            )}
                          </Text>
                        </View>
                      )}

                    {product.average_rating && product.average_rating > 0 && (
                      <View className="flex-row items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
                        <Feather name="star" size={12} color="#f59e0b" />
                        <Text className="text-xs font-bold text-amber-700">
                          {product.average_rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Title */}
                  <Text className="mb-2 text-2xl font-extrabold leading-tight text-slate-900">
                    {productName}
                  </Text>

                  {/* Price */}
                  <View className="mb-4 flex-row items-baseline gap-2">
                    <Text className="text-3xl font-extrabold text-emerald-600">
                      {formatCurrency(price, currency)}
                    </Text>
                    {originalPrice > price && (
                      <Text className="text-base font-semibold text-slate-400 line-through">
                        {formatCurrency(originalPrice, currency)}
                      </Text>
                    )}
                  </View>

                  {/* Description */}
                  {productDescription && (
                    <Text
                      className="mb-4 text-sm leading-relaxed text-slate-600"
                      numberOfLines={3}
                    >
                      {productDescription}
                    </Text>
                  )}

                  {/* Product Variants/Combinations */}
                  {variantTitle && variantTitle.length > 0 && (
                    <View className="mb-4">
                      {variantTitle.map((att: any) => (
                        <View key={att._id} className="mb-4">
                          <Text className="mb-2 text-sm font-semibold text-slate-700">
                            {getLocalizedValue(att.name)}:
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {att.variants
                              ?.filter((v: any) => v.status === "show")
                              .map((variant: any) => {
                                const isSelected =
                                  selectVariant[att._id] === variant._id;
                                return (
                                  <Pressable
                                    key={variant._id}
                                    onPress={() => {
                                      setValue(variant._id);
                                      setSelectVariant({
                                        ...selectVariant,
                                        [att._id]: variant._id,
                                      });
                                      HapticFeedback.selection();
                                    }}
                                    className={`rounded-xl border-2 px-4 py-2.5 ${
                                      isSelected
                                        ? "bg-primary-50 border-primary-500"
                                        : "bg-white border-slate-200"
                                    }`}
                                  >
                                    <Text
                                      className={`text-sm font-semibold ${
                                        isSelected
                                          ? "text-primary-700"
                                          : "text-slate-600"
                                      }`}
                                    >
                                      {getLocalizedValue(variant.name)}
                                    </Text>
                                  </Pressable>
                                );
                              })}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Quantity & Actions */}
                  <View className="mb-4 gap-4">
                    <View className="flex-row items-center gap-3">
                      <View className="">
                        <QuantityStepper
                          value={quantity}
                          onDecrement={() =>
                            setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                          }
                          onIncrement={() => setQuantity((prev) => prev + 1)}
                        />
                      </View>

                      <Button
                        title="Add to cart"
                        onPress={handleAddToCartClick}
                        variant="cyan"
                        disabled={stock <= 0}
                      />
                    </View>

                    <Button
                      title="View full details"
                      onPress={handleViewDetails}
                      variant="outline"
                      className="mt-2"
                    />
                  </View>

                  {/* Tags */}
                  {product.tag && product.tag.length > 0 && (
                    <View className="pt-4 border-t border-slate-100 mb-10">
                      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tags
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {JSON.parse(product?.tag)?.map(
                          (tag: string, idx: number) => (
                            <View
                              key={idx}
                              className="flex-row items-center rounded-lg bg-blue-50 px-3 py-1.5"
                            >
                              <Feather name="tag" size={12} color="#3b82f6" />
                              <Text className="ml-1.5 text-xs font-semibold text-blue-700">
                                {tag}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
};
