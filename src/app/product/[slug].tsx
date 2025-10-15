import { useState } from "react";
import { Image, ScrollView, Text, View, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton } from "@/components/ui";
import { BackButton } from "@/components/ui/BackButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useProduct, useProducts } from "@/hooks/queries/useProducts";
import { useSettings } from "@/contexts/SettingsContext";
import { useCart } from "@/contexts/CartContext";
import {
  calculateDiscountPercentage,
  formatCurrency,
  getLocalizedValue,
  getProductImage,
} from "@/utils";
import { theme } from "@/theme";

const { width } = Dimensions.get("window");

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const productQuery = useProduct(slug);
  const relatedQuery = useProducts({ slug });
  const { addItem } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";
  const [quantity, setQuantity] = useState(1);

  if (productQuery.isLoading || relatedQuery.isLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <Screen className="px-5 pt-20">
        <ErrorState
          title="Product not found"
          message="We could not load this product. Try exploring other collections."
          onRetry={() => {
            productQuery.refetch();
            relatedQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  const product = productQuery.data;
  const displayName = getLocalizedValue(product.title);
  const description = getLocalizedValue(product.description);
  const price = product.prices?.price ?? 0;
  const originalPrice = product.prices?.originalPrice ?? price;
  const discount = calculateDiscountPercentage(originalPrice, price);
  const imagesRaw = product.image?.length
    ? product.image
    : [getProductImage(product)];
  const images = (imagesRaw ?? []).filter(Boolean) as string[];
  const carouselImages = images.length ? images : [undefined];

  const handleAddToCart = () => {
    addItem({ product, quantity });
  };

  const reviews = relatedQuery.data?.reviews ?? [];
  const relatedProducts = relatedQuery.data?.relatedProducts ?? [];

  return (
    <Screen innerClassName="px-0" scrollable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="px-4 pt-6">
          <BackButton />
        </View>

        {/* Product Images Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ width }}
        >
          {carouselImages.map((img, index) => (
            <View
              key={`${img}-${index}`}
              style={{ width }}
              className="items-center justify-center bg-slate-50 py-12"
            >
              {img ? (
                <Image
                  source={{ uri: img }}
                  className="h-72 w-72"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-48 w-48 items-center justify-center rounded-2xl bg-primary-50">
                  <Feather name="image" size={48} color="#10b981" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Product Info Card */}
        <View className="px-4">
          <View className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
            {/* Category & Title */}
            <View>
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                {product.category && typeof product.category === "object"
                  ? getLocalizedValue(
                      product.category.name as Record<string, string>
                    )
                  : "Fresh Pick"}
              </Text>
              <Text className="mt-1.5 text-2xl font-bold text-slate-900 leading-tight">
                {displayName}
              </Text>
            </View>

            {/* Price & Stock */}
            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-bold text-primary-600">
                    {formatCurrency(price, currency)}
                  </Text>
                  {originalPrice > price && (
                    <Text className="ml-2 text-lg text-slate-400 line-through">
                      {formatCurrency(originalPrice, currency)}
                    </Text>
                  )}
                </View>
                {discount > 0 && (
                  <View className="mt-2 self-start rounded-lg bg-red-50 px-2.5 py-1">
                    <Text className="text-xs font-bold text-red-600">
                      Save {discount}%
                    </Text>
                  </View>
                )}
              </View>
              <View className="items-end">
                <View
                  className={`rounded-lg px-3 py-1.5 ${(product.stock ?? 0) > 0 ? "bg-emerald-50" : "bg-red-50"}`}
                >
                  <Text
                    className={`text-xs font-semibold ${(product.stock ?? 0) > 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {(product.stock ?? 0) > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quantity & Add to Cart */}
            <View className="mt-5 flex-row items-center gap-3">
              <QuantityStepper
                value={quantity}
                onIncrement={() => setQuantity((prev) => prev + 1)}
                onDecrement={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              />
              <EnhancedButton
                title="Add to cart"
                onPress={handleAddToCart}
                className="flex-1"
                size="lg"
                gradient
                disabled={(product.stock ?? 0) === 0}
              />
            </View>
          </View>

          {/* Description */}
          <View className="mt-4 rounded-2xl bg-white p-5 border border-slate-100">
            <Text className="text-sm font-bold uppercase tracking-wider text-slate-700">
              About this product
            </Text>
            <Text className="mt-3 text-sm text-slate-600 leading-relaxed">
              {description ||
                "Detailed description will appear here once added from the dashboard."}
            </Text>

            {/* Product Tags */}
            <View className="mt-4 flex-row flex-wrap gap-2">
              {product.average_rating && product.average_rating > 0 && (
                <View className="flex-row items-center rounded-lg bg-amber-50 px-2.5 py-1.5">
                  <Feather name="star" size={14} color="#f59e0b" />
                  <Text className="ml-1.5 text-xs font-semibold text-amber-700">
                    {product.average_rating.toFixed(1)} rating
                  </Text>
                </View>
              )}
              {product.tag && product.tag.length > 0 && (
                <View className="flex-row items-center rounded-lg bg-blue-50 px-2.5 py-1.5">
                  <Feather name="tag" size={14} color="#3b82f6" />
                  <Text className="ml-1.5 text-xs font-semibold text-blue-700">
                    {product.tag[0]}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <View className="mt-6">
              <View className="mb-3 flex-row items-center justify-between px-1">
                <Text className="text-lg font-bold text-slate-900">
                  Customer Reviews
                </Text>
                <Text className="text-sm text-slate-500">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <View className="space-y-3">
                {reviews.slice(0, 3).map((review: any) => (
                  <View
                    key={review._id}
                    className="rounded-xl bg-white p-4 border border-slate-100"
                  >
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-slate-900">
                        {review.user?.name ?? "Anonymous"}
                      </Text>
                      <View className="flex-row items-center rounded-md bg-amber-50 px-2 py-1">
                        <Feather name="star" size={12} color="#f59e0b" />
                        <Text className="ml-1 text-xs font-bold text-amber-700">
                          {review.rating}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-slate-600 leading-relaxed">
                      {review.review}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View className="mt-8 -mx-4">
              <ProductCarousel
                title="You might also like"
                subtitle="Complementary picks curated for you"
                products={relatedProducts}
                onSeeAll={() => router.push("/search")}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
