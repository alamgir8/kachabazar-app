import { useMemo } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/layout/AppHeader";
import { Screen } from "@/components/layout/Screen";
import { Highlights } from "@/components/home/Highlights";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useCategories } from "@/hooks/queries/useCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { useSettings } from "@/contexts/SettingsContext";

export default function HomeScreen() {
  const router = useRouter();
  const { refetch: refetchSettings } = useSettings();
  const categoriesQuery = useCategories();
  const productsQuery = useProducts();

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
    <Screen className="px-0" scrollable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
        contentContainerStyle={{
          paddingBottom: 160,
          paddingHorizontal: 20
        }}
      >
        <AppHeader />
        <SearchBar
          placeholder="Search for fruits, veggies, snacks..."
          onSubmitSearch={onSearchSubmit}
          containerClassName="mb-6"
        />
        <Hero onExplorePress={handleExplorePress} />
        <CategoryStrip
          categories={categoriesQuery.data ?? []}
          onSeeAll={handleExplorePress}
        />
        <Highlights />
        <ProductCarousel
          title="Trending now"
          subtitle="Loved by our community"
          products={popularProducts}
          onSeeAll={() =>
            router.push({ pathname: "/search", params: { sort: "popular" } })
          }
        />
        <ProductCarousel
          title="Limited time offers"
          subtitle="Grab them before they are gone"
          products={discountedProducts}
          onSeeAll={() => router.push("/offers")}
        />
        <Button
          title="Browse all products"
          onPress={() => router.push("/search")}
          className="mt-4 self-stretch"
          variant="ghost"
        />
      </ScrollView>
    </Screen>
  );
}
