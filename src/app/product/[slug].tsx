import { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Dimensions,
  Pressable,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton } from "@/components/ui";
import { BackButton } from "@/components/ui/BackButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useProduct, useProducts } from "@/hooks/queries/useProducts";
import { useAttributes } from "@/hooks/queries/useAttributes";
import { useSettings } from "@/contexts/SettingsContext";
import { useCart } from "@/contexts/CartContext";
import { useProductAction } from "@/hooks/useProductAction";
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
  const attributesQuery = useAttributes();
  const { globalSetting } = useSettings();

  // All hooks must be called before any early returns
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  const product = productQuery.data;
  const attributes = attributesQuery.data || [];
  const reviews = relatedQuery.data?.reviews ?? [];
  const relatedProducts = relatedQuery.data?.relatedProducts ?? [];

  // Use the product action hook (must be called unconditionally)
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
    handleAddToCart: addToCartAction,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
  });

  // NOW we can do conditional rendering
  if (
    productQuery.isLoading ||
    relatedQuery.isLoading ||
    attributesQuery.isLoading
  ) {
    return <LoadingState message="Loading product..." />;
  }

  if (productQuery.isError || !product) {
    return (
      <Screen>
        <ErrorState
          title="Product not found"
          message="We could not load this product. Try exploring other collections."
          onRetry={() => {
            productQuery.refetch();
            relatedQuery.refetch();
            attributesQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  const displayName = getLocalizedValue(product.title);
  const description = getLocalizedValue(product.description);
  const currency = globalSetting?.default_currency ?? "$";
  const imagesRaw = product.image?.length
    ? product.image
    : [getProductImage(product)];
  const images = (imagesRaw ?? []).filter(Boolean) as string[];
  const carouselImages = images.length ? images : [undefined];

  // Override with selected image if variant has one
  const displayImages = selectedImage
    ? [selectedImage, ...images.filter((img) => img !== selectedImage)]
    : images;
  const displayCarouselImages = displayImages.length
    ? displayImages
    : [undefined];

  const handleAddToCartClick = () => {
    const result = addToCartAction(quantity);
    if (!result.success) {
      Alert.alert("Error", result.message);
    } else {
      Alert.alert("Success", "Added to cart successfully!");
      setQuantity(1);
    }
  };

  // Calculate average rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Feather
            key={i}
            name="star"
            size={14}
            color="#f59e0b"
            style={{ marginRight: 2 }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i} style={{ marginRight: 2 }}>
            <Feather name="star" size={14} color="#fde68a" />
          </View>
        );
      } else {
        stars.push(
          <Feather
            key={i}
            name="star"
            size={14}
            color="#e5e7eb"
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    return stars;
  };

  // Handle image zoom
  const handleImageZoom = (images: string[], index: number) => {
    setZoomedImage(images[index]);
    setZoomedImageIndex(index);
  };

  const handleNextZoomImage = (images: string[]) => {
    const nextIndex = (zoomedImageIndex + 1) % images.length;
    setZoomedImage(images[nextIndex]);
    setZoomedImageIndex(nextIndex);
  };

  const handlePrevZoomImage = (images: string[]) => {
    const prevIndex = (zoomedImageIndex - 1 + images.length) % images.length;
    setZoomedImage(images[prevIndex]);
    setZoomedImageIndex(prevIndex);
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <Screen noHorizontalPadding scrollable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header with Back Button */}
        <View className="absolute top-6 left-4 z-10 flex-row items-center justify-between w-full pr-8">
          <BackButton />
          <View className="flex-row gap-2">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
              <Feather name="share-2" size={18} color="#475569" />
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
              <Feather name="heart" size={18} color="#475569" />
            </View>
          </View>
        </View>

        {/* Product Images Carousel with Indicators */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width }}
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {displayCarouselImages.map((img, index) => (
              <View
                key={`${img}-${index}`}
                style={{ width }}
                className="items-center justify-center bg-gradient-to-b from-slate-50 to-white py-16"
              >
                {img ? (
                  <Image
                    source={{ uri: img }}
                    className="h-80 w-80"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="h-64 w-64 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100">
                    <Feather name="image" size={64} color="#10b981" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {displayCarouselImages.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
              {displayCarouselImages.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === activeImageIndex
                      ? "w-8 bg-primary-600"
                      : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <View className="absolute top-4 right-4">
              <LinearGradient
                colors={["#ef4444", "#dc2626"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-full px-3.5 py-2 shadow-lg"
              >
                <Text className="text-xs font-bold text-white">
                  {discount}% OFF
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Product Info Card */}
        <View className="px-4 -mt-6">
          <View className="rounded-3xl bg-white p-5 shadow-xl border border-slate-100">
            {/* Category & Rating */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5">
                <Feather name="tag" size={12} color="#10b981" />
                <Text className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  {product.category && typeof product.category === "object"
                    ? getLocalizedValue(
                        product.category.name as Record<string, string>
                      )
                    : "Fresh Pick"}
                </Text>
              </View>

              {/* Rating Display */}
              {product.average_rating && product.average_rating > 0 && (
                <View className="flex-row items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
                  <View className="flex-row items-center">
                    {renderStars(product.average_rating)}
                  </View>
                  <Text className="text-xs font-bold text-amber-700 ml-1">
                    {product.average_rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-slate-900 leading-tight mb-1">
              {displayName}
            </Text>

            {/* Reviews Count */}
            {reviews.length > 0 && (
              <Text className="text-sm text-slate-500 mb-4">
                {reviews.length} customer review
                {reviews.length !== 1 ? "s" : ""}
              </Text>
            )}

            {/* Price & Stock Row */}
            <View className="mt-4 flex-row items-end justify-between pb-4 border-b border-slate-100">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Price
                </Text>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-3xl font-bold text-primary-600">
                    {formatCurrency(price, currency)}
                  </Text>
                  {originalPrice > price && (
                    <Text className="text-base text-slate-400 line-through">
                      {formatCurrency(originalPrice, currency)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Stock Badge */}
              <View className="items-end">
                <View
                  className={`rounded-xl px-4 py-2.5 ${stock > 0 ? "bg-emerald-50" : "bg-red-50"}`}
                >
                  <View className="flex-row items-center gap-1.5">
                    <Feather
                      name={stock > 0 ? "check-circle" : "x-circle"}
                      size={14}
                      color={stock > 0 ? "#059669" : "#dc2626"}
                    />
                    <Text
                      className={`text-xs font-bold ${stock > 0 ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {stock > 0 ? `${stock} in stock` : "Out of stock"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quantity & Add to Cart */}
            <View className="mt-5 gap-3">
              {/* Product Variants/Combinations */}
              {variantTitle && variantTitle.length > 0 && (
                <View className="mb-3">
                  {variantTitle.map((att: any) => (
                    <View key={att._id} className="mb-3">
                      <Text className="text-sm font-semibold text-slate-700 mb-2">
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
                                }}
                                className={`px-4 py-2.5 rounded-xl border-2 ${
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

              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold text-slate-700">
                  Qty:
                </Text>
                <QuantityStepper
                  value={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                />
                <EnhancedButton
                  title="Add to Cart"
                  onPress={handleAddToCartClick}
                  className="flex-1"
                  size="lg"
                  disabled={stock === 0}
                />
              </View>
            </View>
          </View>

          {/* Description with Toggle */}
          <View className="mt-4 rounded-3xl bg-white p-6 shadow-lg border border-slate-100">
            <View className="flex-row items-center gap-2 mb-3">
              <Feather name="file-text" size={16} color="#10b981" />
              <Text className="text-base font-bold text-slate-900">
                Product Details
              </Text>
            </View>

            <Text
              className="text-sm text-slate-600 leading-relaxed"
              numberOfLines={showFullDescription ? undefined : 3}
            >
              {description ||
                "Detailed description will appear here once added from the dashboard."}
            </Text>

            {description && description.length > 100 && (
              <Pressable
                onPress={() => setShowFullDescription(!showFullDescription)}
                className="mt-3"
              >
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-semibold text-primary-600">
                    {showFullDescription ? "Show less" : "Read more"}
                  </Text>
                  <Feather
                    name={showFullDescription ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#10b981"
                  />
                </View>
              </Pressable>
            )}

            {/* Product Tags */}
            {product.tag && product.tag.length > 0 && (
              <View className="mt-4 pt-4 border-t border-slate-100">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Tags
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {product.tag.slice(0, 5).map((tag: string, idx: number) => (
                    <View
                      key={idx}
                      className="flex-row items-center rounded-lg bg-blue-50 px-3 py-1.5"
                    >
                      <Feather name="tag" size={12} color="#3b82f6" />
                      <Text className="ml-1.5 text-xs font-semibold text-blue-700">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <View className="mt-4">
              <View className="mb-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Customer Reviews
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <View className="flex-row items-center">
                        {renderStars(product.average_rating || 0)}
                      </View>
                      <Text className="text-sm font-semibold text-slate-600">
                        {product.average_rating?.toFixed(1) || "0.0"} out of 5
                      </Text>
                    </View>
                  </View>
                  <View className="items-center justify-center h-14 w-14 rounded-full bg-white shadow-sm">
                    <Text className="text-2xl font-bold text-amber-600">
                      {reviews.length}
                    </Text>
                    <Text className="text-xs text-slate-500 -mt-1">
                      {reviews.length === 1 ? "review" : "reviews"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="space-y-3">
                {displayedReviews.map((review: any) => (
                  <View
                    key={review._id}
                    className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm"
                  >
                    <View className="mb-3 flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                            <Text className="text-sm font-bold text-primary-700">
                              {(review.user?.name ?? "A")
                                .charAt(0)
                                .toUpperCase()}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-bold text-slate-900">
                              {review.user?.name ?? "Anonymous"}
                            </Text>
                            <View className="flex-row items-center mt-0.5">
                              {renderStars(review.rating)}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View className="rounded-lg bg-amber-50 px-2.5 py-1.5">
                        <Text className="text-xs font-bold text-amber-700">
                          {review.rating}.0
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-slate-600 leading-relaxed pl-12">
                      {review.review || review.comment}
                    </Text>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <View className="flex-row flex-wrap gap-2 mt-3 pl-12">
                        {review.images.map((img: string, idx: number) => (
                          <Pressable
                            key={idx}
                            onPress={() => handleImageZoom(review.images, idx)}
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200"
                          >
                            <Image
                              source={{ uri: img }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {reviews.length > 3 && (
                <Pressable
                  className="mt-3"
                  onPress={() => setShowAllReviews(!showAllReviews)}
                >
                  <View className="rounded-xl bg-slate-50 border border-slate-200 p-4 items-center">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-semibold text-slate-700">
                        {showAllReviews
                          ? "Show less"
                          : `View all ${reviews.length} reviews`}
                      </Text>
                      <Feather
                        name={showAllReviews ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#334155"
                      />
                    </View>
                  </View>
                </Pressable>
              )}
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

      {/* Image Zoom Modal */}
      <Modal
        visible={!!zoomedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomedImage(null)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            onPress={() => setZoomedImage(null)}
            className="absolute top-12 right-6 z-10 bg-red-500 p-3 rounded-full"
          >
            <Feather name="x" size={24} color="#ffffff" />
          </TouchableOpacity>

          {zoomedImage && (
            <View className="w-full items-center justify-center px-4">
              <Image
                source={{ uri: zoomedImage }}
                className="w-full h-96"
                resizeMode="contain"
              />

              {/* Navigation Buttons */}
              <View className="flex-row gap-4 mt-6">
                <TouchableOpacity
                  onPress={() => {
                    const currentReview: any = reviews.find((r: any) =>
                      r.images?.includes(zoomedImage)
                    );
                    if (currentReview?.images) {
                      handlePrevZoomImage(currentReview.images);
                    }
                  }}
                  className="bg-white/20 p-4 rounded-full"
                >
                  <Feather name="chevron-left" size={24} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const currentReview: any = reviews.find((r: any) =>
                      r.images?.includes(zoomedImage)
                    );
                    if (currentReview?.images) {
                      handleNextZoomImage(currentReview.images);
                    }
                  }}
                  className="bg-white/20 p-4 rounded-full"
                >
                  <Feather name="chevron-right" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </Screen>
  );
}
