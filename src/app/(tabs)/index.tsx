import { useMemo } from "react";
import { RefreshControl, View } from "react-native";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/layout/AppHeader";
import { Screen } from "@/components/layout/Screen";
import { Highlights } from "@/components/home/Highlights";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useCategories } from "@/hooks/queries/useCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { useAttributes } from "@/hooks/queries/useAttributes";
import { useSettings } from "@/contexts/SettingsContext";
import Button from "@/components/ui/Button";

export default function HomeScreen() {
  const router = useRouter();
  const { refetch: refetchSettings } = useSettings();
  const categoriesQuery = useCategories();
  const productsQuery = useProducts();
  const attributesQuery = useAttributes();

  // console.log(
  //   "productsQuery.data",
  //   productsQuery.data,
  //   "categoriesQuery.data",
  //   categoriesQuery.data
  // );

  const isLoading = productsQuery.isLoading || categoriesQuery.isLoading;
  const isError = productsQuery.isError || categoriesQuery.isError;

  const onSearchSubmit = (value: string) => {
    if (!value) return;
    router.push({ pathname: "/search", params: { q: value } });
  };

  const handleExplorePress = () => {
    router.push("/(tabs)/categories");
  };

  const refresh = () => {
    refetchSettings();
    productsQuery.refetch();
    categoriesQuery.refetch();
  };

  const popularProducts = useMemo(
    () => productsQuery.data?.popularProducts ?? [],
    [productsQuery.data?.popularProducts]
  );

  const discountedProducts = useMemo(
    () => productsQuery.data?.discountedProducts ?? [],
    [productsQuery.data?.discountedProducts]
  );

  // console.log("categoriesQuery?.data", categoriesQuery?.data);

  if (isLoading) {
    return <LoadingState message="Curating fresh picks..." />;
  }

  if (isError) {
    return (
      <Screen className="px-5 pt-20">
        <ErrorState
          message="We could not load the freshest picks. Pull to refresh or try again shortly."
          onRetry={refresh}
        />
      </Screen>
    );
  }

  return (
    <Screen
      scrollable
      edges={["bottom"]}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refresh}
          tintColor="#10b981"
        />
      }
      contentContainerClassName="gap-8 pb-24"
    >
      <AppHeader />

      <Hero onExplorePress={handleExplorePress} />

      <View className="gap-8">
        <CategoryStrip
          onSeeAll={handleExplorePress}
          categories={categoriesQuery?.data ?? []}
        />

        <Highlights />

        <ProductCarousel
          title="Trending now"
          subtitle="Loved by our community"
          products={popularProducts}
          attributes={attributesQuery.data || []}
          onSeeAll={() =>
            router.push({ pathname: "/search", params: { sort: "popular" } })
          }
          badgeLabel="Featured"
        />

        <ProductCarousel
          title="Limited time offers"
          subtitle="Grab them before they are gone"
          products={discountedProducts}
          attributes={attributesQuery.data || []}
          onSeeAll={() => router.push("/offers")}
          badgeLabel="Offers"
        />
      </View>

      <View className="mt-20">
        <Button
          title="Browse all products"
          onPress={() => router.push("/search")}
          variant="teal"
        />
      </View>
    </Screen>
  );
}
