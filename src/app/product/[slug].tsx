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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Screen } from "@/components/layout/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useProduct, useProducts } from "@/hooks/queries/useProducts";
import { useAttributes } from "@/hooks/queries/useAttributes";
import { useSettings } from "@/contexts/SettingsContext";
import { useProductAction } from "@/hooks/useProductAction";
import {
  calculateDiscountPercentage,
  formatCurrency,
  getLocalizedValue,
  getProductImage,
} from "@/utils";
import { theme } from "@/theme";
import Button from "@/components/ui/Button";
import Tags from "@/components/common/Tags";
import VariantList from "@/components/variants/VariantList";
import { showToast } from "@/utils/toast";

const windowWidth = Dimensions.get("window").width;
const carouselWidth = Math.max(windowWidth - 48, 320);

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const productQuery = useProduct(slug);
  const relatedQuery = useProducts({ slug });
  const { globalSetting } = useSettings();

  // All hooks must be called before any early returns
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  const REVIEWS_PER_PAGE = 5;

  const product = productQuery.data;
  const reviews = relatedQuery.data?.reviews ?? [];
  const relatedProducts = relatedQuery.data?.relatedProducts ?? [];

  // Only fetch attributes if product has variants
  const hasVariants = !!(product?.variants && product.variants.length > 0);
  const attributesQuery = useAttributes({ enabled: hasVariants });
  const attributes = attributesQuery.data || [];

  // Check if attributes are still loading (including when query transitions from disabled to enabled)
  const attributesLoading =
    hasVariants && (attributesQuery.isLoading || attributesQuery.isPending);

  // Use the product action hook (must be called unconditionally)
  const {
    price,
    stock,
    discount,
    selectedImage,
    originalPrice,
    selectVariant,
    setSelectVariant,
    selectVa,
    setSelectVa,
    setValue,
    variantTitle,
    handleAddToCart: addToCartAction,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
  });

  // NOW we can do conditional rendering
  // Only show loading if product is loading, or if product has variants and attributes are loading
  if (productQuery.isLoading || relatedQuery.isLoading || attributesLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (productQuery.isError || !product) {
    return (
      <Screen edges={["bottom"]}>
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
      showToast.error("Error", result.message);
    } else {
      showToast.success("Added to Cart", "Added to cart successfully!");
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
          <FontAwesome
            key={i}
            name="star"
            size={14}
            color="#f59e0b"
            style={{ marginRight: 2 }}
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i} style={{ marginRight: 2 }}>
            <FontAwesome name="star-half-full" size={14} color="#f59e0b" />
          </View>,
        );
      } else {
        stars.push(
          <FontAwesome
            key={i}
            name="star-o"
            size={14}
            color="#e5e7eb"
            style={{ marginRight: 2 }}
          />,
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

  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );

  // Rating distribution for the summary bar
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => Math.round(r.rating) === star).length,
  }));

  return (
    <Screen
      edges={["bottom"]}
      noHorizontalPadding
      scrollable
      contentContainerClassName="pb-10 pt-4"
    >
      {/* Header with Back Button */}
      <View className="px-5">
        <ScreenHeader
          title="Product Details"
          rightContent={
            <View className="flex-row gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
                <Feather name="share-2" size={18} color="#475569" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
                <Feather name="heart" size={18} color="#475569" />
              </View>
            </View>
          }
        />
      </View>

      {/* Product Images Carousel with Indicators */}
      <View className="relative items-center">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ width: carouselWidth }}
          onScroll={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / carouselWidth,
            );
            setActiveImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {displayCarouselImages.map((img, index) => (
            <View
              key={`${img}-${index}`}
              style={{ width: carouselWidth }}
              className="items-center justify-center bg-gradient-to-b from-slate-50 to-white py-10 rounded-3xl"
            >
              {img ? (
                <Image
                  source={{ uri: img }}
                  className="h-48 w-48"
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
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: index === activeImageIndex ? 32 : 8,
                  backgroundColor:
                    index === activeImageIndex ? "#059669" : "#cbd5e1",
                }}
              />
            ))}
          </View>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <View className="absolute top-20 right-4 z-20">
            <LinearGradient
              colors={["#ef4444", "#dc2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-full px-3 py-1.5 shadow-sm"
            >
              <Text className="text-[10px] font-bold text-white">
                {Math.round(discount)}% OFF
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Product Info Card */}
      <View className="-mt-12 mx-4">
        <View
          className="rounded-[40px] border border-white/70 bg-white/96 px-5 py-6"
          style={{
            shadowColor: "rgba(15,118,110,0.16)",
            shadowOffset: { width: 0, height: 24 },
            shadowOpacity: 0.18,
            shadowRadius: 36,
            elevation: 16,
          }}
        >
          {/* Category & Rating */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5">
              <Feather name="tag" size={12} color="#10b981" />
              <Text className="text-xs font-bold uppercase tracking-wider text-primary-700">
                {product.category && typeof product.category === "object"
                  ? getLocalizedValue(
                      product.category.name as Record<string, string>,
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
          <Text className="mb-1 text-[28px] font-extrabold leading-tight text-slate-900">
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
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-bold text-emerald-700">
                {formatCurrency(price, currency)}
              </Text>
              {originalPrice > price && (
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm text-slate-400 line-through">
                    {formatCurrency(originalPrice, currency)}
                  </Text>
                  <View className="rounded-md bg-rose-100 px-1.5 py-0.5">
                    <Text className="text-[10px] font-bold text-rose-600">
                      -{Math.round(discount)}%
                    </Text>
                  </View>
                </View>
              )}
            </View>{" "}
            {/* Stock Badge */}
            <View
              className={`rounded-lg px-2.5 py-1 ${stock > 0 ? "bg-emerald-50" : "bg-red-50"}`}
            >
              <View className="flex-row items-center gap-1.5">
                <Feather
                  name={stock > 0 ? "check-circle" : "x-circle"}
                  size={12}
                  color={stock > 0 ? "#059669" : "#dc2626"}
                />
                <Text
                  className={`text-[10px] font-bold uppercase tracking-wide ${stock > 0 ? "text-emerald-700" : "text-red-700"}`}
                >
                  {stock > 0 ? `${stock} in stock` : "Out of stock"}
                </Text>
              </View>
            </View>
          </View>

          {/* Variants & Quantity Section */}
          <View className="mt-5 gap-5">
            {/* Product Variants/Combinations */}
            {!attributesLoading && variantTitle?.length > 0 && (
              <View>
                {variantTitle.map((att: any) => (
                  <View key={att._id} className="mb-3">
                    <Text className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      {getLocalizedValue(att.name)}
                    </Text>
                    <VariantList
                      att={att._id}
                      option={att.option}
                      variants={product?.variants || []}
                      varTitle={variantTitle}
                      setValue={setValue}
                      selectVariant={selectVariant}
                      setSelectVariant={setSelectVariant}
                      setSelectVa={setSelectVa}
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Quantity & Add to Cart Row */}
            <View className="flex-row items-center gap-3">
              <QuantityStepper
                value={quantity}
                onDecrement={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
                onIncrement={() => setQuantity((prev) => prev + 1)}
                height="h-11"
                width="w-11"
              />

              <Button
                title="Add to cart"
                onPress={handleAddToCartClick}
                variant="cyan"
                disabled={stock <= 0}
                className="flex-1"
                height={44}
              />
            </View>
          </View>
        </View>

        {/* Description with Toggle */}
        <View
          className="mt-6 mx-4 rounded-[32px] border border-white/70 bg-white/96 px-5 py-6"
          style={{
            shadowColor: "rgba(15,118,110,0.12)",
            shadowOffset: { width: 0, height: 18 },
            shadowOpacity: 0.16,
            shadowRadius: 28,
            elevation: 12,
          }}
        >
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
          {product.tag && product.tag.length > 0 ? (
            <View className="mt-4 pt-4 border-t border-slate-100">
              <Tags product={product} />
            </View>
          ) : null}
        </View>

        {/* Reviews Section — Collapsible Accordion */}
        {reviews.length > 0 && (
          <View className="mt-4 mx-4">
            {/* Accordion Header (always visible) */}
            <Pressable
              onPress={() => {
                setReviewsExpanded(!reviewsExpanded);
                if (!reviewsExpanded) setReviewPage(1);
              }}
              className="rounded-2xl bg-white border border-slate-100 overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="px-5 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-full bg-amber-50 items-center justify-center">
                    <FontAwesome name="star" size={18} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">
                      Customer Reviews
                    </Text>
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <View className="flex-row">
                        {renderStars(product.average_rating || 0)}
                      </View>
                      <Text className="text-xs font-semibold text-slate-500">
                        {(product.average_rating || 0).toFixed(1)} ·{" "}
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center">
                  <Feather
                    name={reviewsExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#475569"
                  />
                </View>
              </View>
            </Pressable>

            {/* Expanded Reviews Content */}
            {reviewsExpanded && (
              <View className="mt-3">
                {/* Rating Distribution */}
                <View className="rounded-2xl bg-white border border-slate-100 p-5 mb-3">
                  <View className="flex-row gap-5">
                    {/* Left: Big rating number */}
                    <View className="items-center justify-center">
                      <Text className="text-4xl font-extrabold text-slate-900">
                        {(product.average_rating || 0).toFixed(1)}
                      </Text>
                      <View className="flex-row mt-1">
                        {renderStars(product.average_rating || 0)}
                      </View>
                      <Text className="text-xs text-slate-400 mt-1">
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "rating" : "ratings"}
                      </Text>
                    </View>

                    {/* Right: Distribution bars */}
                    <View className="flex-1 justify-center gap-1.5">
                      {ratingDistribution.map(({ star, count }) => {
                        const pct =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;
                        return (
                          <View
                            key={star}
                            className="flex-row items-center gap-2"
                          >
                            <Text className="w-3 text-xs font-semibold text-slate-500 text-right">
                              {star}
                            </Text>
                            <FontAwesome
                              name="star"
                              size={10}
                              color="#f59e0b"
                            />
                            <View className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <View
                                className="h-full rounded-full bg-amber-400"
                                style={{ width: `${pct}%` }}
                              />
                            </View>
                            <Text className="w-6 text-[10px] font-semibold text-slate-400 text-right">
                              {count}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>

                {/* Page Info */}
                {totalReviewPages > 1 && (
                  <View className="mb-2 px-1">
                    <Text className="text-xs text-slate-400 font-medium">
                      Showing {(reviewPage - 1) * REVIEWS_PER_PAGE + 1}–
                      {Math.min(reviewPage * REVIEWS_PER_PAGE, reviews.length)}{" "}
                      of {reviews.length} reviews
                    </Text>
                  </View>
                )}

                {/* Review Cards */}
                <View className="gap-3">
                  {paginatedReviews.map((review: any) => (
                    <View
                      key={review._id}
                      className="rounded-2xl bg-white p-4 border border-slate-100"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.03,
                        shadowRadius: 4,
                        elevation: 1,
                      }}
                    >
                      <View className="flex-row items-center gap-3 mb-3">
                        {/* Avatar */}
                        <View className="h-10 w-10 rounded-full bg-primary-100 items-center justify-center">
                          <Text className="text-sm font-bold text-primary-700">
                            {(review.user?.name ?? "A").charAt(0).toUpperCase()}
                          </Text>
                        </View>

                        {/* Name & Date */}
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-slate-800">
                            {review.user?.name ?? "Anonymous"}
                          </Text>
                          {review.createdAt && (
                            <Text className="text-[11px] text-slate-400 mt-0.5">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </Text>
                          )}
                        </View>

                        {/* Rating badge */}
                        <View
                          className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${
                            review.rating >= 4
                              ? "bg-emerald-50"
                              : review.rating >= 3
                                ? "bg-amber-50"
                                : "bg-rose-50"
                          }`}
                        >
                          <FontAwesome
                            name="star"
                            size={11}
                            color={
                              review.rating >= 4
                                ? "#059669"
                                : review.rating >= 3
                                  ? "#d97706"
                                  : "#dc2626"
                            }
                          />
                          <Text
                            className={`text-xs font-bold ${
                              review.rating >= 4
                                ? "text-emerald-700"
                                : review.rating >= 3
                                  ? "text-amber-700"
                                  : "text-rose-700"
                            }`}
                          >
                            {review.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>

                      {/* Stars row */}
                      <View className="flex-row mb-2">
                        {renderStars(review.rating)}
                      </View>

                      {/* Review text */}
                      {review.review || review.comment ? (
                        <Text className="text-sm text-slate-600 leading-relaxed">
                          {review.review || review.comment}
                        </Text>
                      ) : null}

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <View className="flex-row flex-wrap gap-2 mt-3">
                          {review.images.map((img: string, idx: number) => (
                            <Pressable
                              key={idx}
                              onPress={() =>
                                handleImageZoom(review.images, idx)
                              }
                              className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200"
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

                {/* Pagination Controls */}
                {totalReviewPages > 1 && (
                  <View className="flex-row items-center justify-center gap-2 mt-4">
                    <Pressable
                      onPress={() => setReviewPage((p) => Math.max(1, p - 1))}
                      disabled={reviewPage === 1}
                      className={`h-9 w-9 rounded-full items-center justify-center ${
                        reviewPage === 1 ? "bg-slate-100" : "bg-primary-100"
                      }`}
                    >
                      <Feather
                        name="chevron-left"
                        size={18}
                        color={reviewPage === 1 ? "#cbd5e1" : "#059669"}
                      />
                    </Pressable>

                    {Array.from({ length: totalReviewPages }, (_, i) => i + 1)
                      .filter((p) => {
                        // Show first, last, current, and neighbors
                        if (p === 1 || p === totalReviewPages) return true;
                        if (Math.abs(p - reviewPage) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "dots")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1)
                          acc.push("dots");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, i) =>
                        item === "dots" ? (
                          <Text
                            key={`dots-${i}`}
                            className="text-xs text-slate-400 px-1"
                          >
                            ···
                          </Text>
                        ) : (
                          <Pressable
                            key={item}
                            onPress={() => setReviewPage(item as number)}
                            className={`h-9 w-9 rounded-full items-center justify-center ${
                              reviewPage === item
                                ? "bg-primary-500"
                                : "bg-slate-100"
                            }`}
                          >
                            <Text
                              className={`text-xs font-bold ${
                                reviewPage === item
                                  ? "text-white"
                                  : "text-slate-600"
                              }`}
                            >
                              {item}
                            </Text>
                          </Pressable>
                        ),
                      )}

                    <Pressable
                      onPress={() =>
                        setReviewPage((p) => Math.min(totalReviewPages, p + 1))
                      }
                      disabled={reviewPage === totalReviewPages}
                      className={`h-9 w-9 rounded-full items-center justify-center ${
                        reviewPage === totalReviewPages
                          ? "bg-slate-100"
                          : "bg-primary-100"
                      }`}
                    >
                      <Feather
                        name="chevron-right"
                        size={18}
                        color={
                          reviewPage === totalReviewPages
                            ? "#cbd5e1"
                            : "#059669"
                        }
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Related Products — outside mx-4 wrapper so the carousel can scroll full-width */}
      {relatedProducts.length > 0 && (
        <View className="mt-8">
          <ProductCarousel
            title="You might also like"
            subtitle="Complementary picks curated for you"
            products={relatedProducts}
            onSeeAll={() => router.push("/search")}
          />
        </View>
      )}

      {/* Sticky CTA */}
      {/* Removed as per request */}

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
                      r.images?.includes(zoomedImage),
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
                      r.images?.includes(zoomedImage),
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
