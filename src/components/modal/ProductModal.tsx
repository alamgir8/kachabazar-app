import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

import { Product } from "@/types";
import { useProductAction } from "@/hooks/useProductAction";
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
import Tags from "../common/Tags";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MODAL_WIDTH = SCREEN_WIDTH - 32;

interface ProductModalProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
  attributes?: any[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  visible,
  onClose,
  attributes = [],
}) => {
  const router = useRouter();
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
              className="max-h-[90%] rounded-t-[40px] bg-white"
              style={{ width: SCREEN_WIDTH }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {/* Close Button */}
                <View className="absolute right-4 top-4 z-10">
                  <Pressable
                    onPress={onClose}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg"
                  >
                    <Feather name="x" size={20} color="#475569" />
                  </Pressable>
                </View>

                {/* Product Image (smaller) */}
                <View className="relative h-64 w-full items-center justify-center bg-slate-50">
                  <OptimizedImage
                    source={productImage}
                    style={{ width: MODAL_WIDTH - 180, height: 220 }}
                    cachePolicy="memory-disk"
                    priority="high"
                  />

                  {/* Stock Badge */}
                  <View className="absolute left-4 top-4">
                    <View
                      className={`rounded-full px-3 py-1.5 ${
                        stock > 0 ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    >
                      <Text className={`text-xs font-bold text-white`}>
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
                        <View className="flex-row items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5">
                          <Feather name="tag" size={12} color="#10b981" />
                          <Text className="text-xs font-bold uppercase tracking-wider text-primary-700">
                            {getLocalizedValue(
                              product?.category?.name as Record<string, string>
                            )}
                          </Text>
                        </View>
                      )}

                    {product.average_rating && product.average_rating > 0 && (
                      <View className="flex-row items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5">
                        <FontAwesome name="star" size={14} color="#f59e0b" />
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

                  {/* Short Description */}
                  {productDescription && (
                    <Text
                      className="mb-4 text-sm leading-relaxed text-slate-600"
                      numberOfLines={3}
                    >
                      {productDescription}
                    </Text>
                  )}

                  {/* Variants */}
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
                                        ? "border-primary-500 bg-primary-50"
                                        : "border-slate-200 bg-white"
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

                  {/* Quantity (left) & Discount (right) */}
                  <View className="mb-4 flex-row items-center justify-between gap-3">
                    {/* Quantity */}
                    <View>
                      <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Quantity
                      </Text>
                      <QuantityStepper
                        value={quantity}
                        onDecrement={() =>
                          setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                        }
                        onIncrement={() => setQuantity((prev) => prev + 1)}
                      />
                    </View>

                    {/* Discount */}
                    {discountPercentage > 0 && (
                      <View className="rounded-lg mt-6 px-4 py-0.5 shadow-lg bg-rose-500">
                        <Text className="text-[11px] font-semibold uppercase tracking-wide text-white">
                          Limited Offer
                        </Text>
                        <Text className="text-base font-extrabold text-white">
                          {discountPercentage}% OFF
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Actions: same row, aligned */}
                  <View className="mb-6 flex-row items-center gap-3">
                    <Button
                      title={stock > 0 ? "Add to cart" : "Out of stock"}
                      onPress={handleAddToCartClick}
                      variant="cyan"
                      disabled={stock <= 0}
                      className="flex-1"
                    />
                    <Button
                      title="View full details"
                      onPress={handleViewDetails}
                      variant="outline"
                      className="flex-1"
                    />
                  </View>

                  {/* Tags */}
                  {product.tag && product.tag.length > 0 && (
                    <Tags product={product} />
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
