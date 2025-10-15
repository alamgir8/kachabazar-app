import { useState } from "react";
import { Image, ScrollView, Text, View, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
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
  getProductImage
} from "@/utils";

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
    <Screen className="px-0" scrollable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
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
              className="items-center justify-center bg-[#e3f7e8] pb-10 pt-16"
            >
              {img ? (
                <Image
                  source={{ uri: img }}
                  className="h-64 w-64 rounded-3xl"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-40 w-40 items-center justify-center rounded-3xl bg-primary-100">
                  <Feather name="image" size={32} color="#1c7646" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View className="mt-[-32] rounded-t-3xl bg-white px-6 pb-12 pt-8 shadow-[0_-20px_60px_rgba(15,118,110,0.12)]">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-6">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                {product.category && typeof product.category === "object"
                  ? getLocalizedValue(
                      product.category.name as Record<string, string>
                    )
                  : "Fresh Pick"}
              </Text>
              <Text className="mt-2 font-display text-3xl text-slate-900">
                {displayName}
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-display text-2xl text-slate-900">
                {formatCurrency(price, currency)}
              </Text>
              {originalPrice > price ? (
                <Text className="text-sm text-slate-400 line-through">
                  {formatCurrency(originalPrice, currency)}
                </Text>
              ) : null}
              {discount > 0 ? (
                <View className="mt-2 rounded-full bg-accent-500/90 px-3 py-1">
                  <Text className="text-xs font-semibold text-white">
                    Save {discount}%
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View className="mt-5 flex-row items-center space-x-3">
            <QuantityStepper
              value={quantity}
              onIncrement={() => setQuantity((prev) => prev + 1)}
              onDecrement={() =>
                setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
              }
            />
            <Button
              title="Add to cart"
              onPress={handleAddToCart}
              className="flex-1"
            />
          </View>

          <View className="mt-6 rounded-3xl bg-slate-50 p-5">
            <Text className="text-sm font-semibold uppercase text-slate-500">
              About this item
            </Text>
            <Text className="mt-3 text-base text-slate-700 leading-relaxed">
              {description ||
                "Detailed description will appear here once added from the dashboard."}
            </Text>
            <View className="mt-4 flex-row flex-wrap gap-3">
              <Tag icon="package">
                {product.stock && product.stock > 0
                  ? `${product.stock} available`
                  : "Currently sold out"}
              </Tag>
              {product.average_rating ? (
                <Tag icon="star">
                  {product.average_rating.toFixed(1)} rating
                </Tag>
              ) : null}
              <Tag icon="tag">
                {product.tag?.slice(0, 1).join(", ") ?? "Everyday essential"}
              </Tag>
            </View>
          </View>

          {reviews.length ? (
            <View className="mt-8">
              <SectionHeader title="What shoppers say" />
              <View className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <View
                    key={review._id}
                    className="rounded-3xl bg-white p-5 shadow-[0_12px_30px_rgba(15,118,110,0.08)]"
                  >
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-slate-900">
                        {review.user?.name ?? "Anonymous"}
                      </Text>
                      <View className="flex-row items-center">
                        <Feather name="star" size={16} color="#f59e0b" />
                        <Text className="ml-1 text-sm font-semibold text-slate-700">
                          {review.rating}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-slate-600">
                      {review.review}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {relatedProducts.length ? (
            <View className="mt-10">
              <ProductCarousel
                title="Pairs beautifully with"
                subtitle="Complementary picks curated for you"
                products={relatedProducts}
                onSeeAll={() => router.push("/search")}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const Tag: React.FC<{ icon: React.ComponentProps<typeof Feather>["name"] }> = ({
  icon,
  children
}) => (
  <View className="flex-row items-center rounded-full bg-white px-3 py-2 shadow-[0_10px_25px_rgba(15,118,110,0.08)]">
    <Feather name={icon} size={14} color="#1c7646" />
    <Text className="ml-2 text-xs font-semibold text-slate-600">{children}</Text>
  </View>
);
