import { useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/layout/AppHeader";
import { Screen } from "@/components/layout/Screen";
import { Highlights } from "@/components/home/Highlights";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Button, EnhancedButton } from "@/components/ui";
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

  console.log("categoriesQuery?.data", categoriesQuery?.data);

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
    <Screen innerClassName="px-0" scrollable edges={["bottom"]} bgColor="white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View className="pt-4">
          <AppHeader />
        </View>

        <View className="mt-2">
          <SearchBar
            placeholder="Search for fruits, veggies, snacks..."
            onSubmitSearch={onSearchSubmit}
            containerClassName="mb-4"
          />
        </View>

        <View className="mb-5">
          <Hero onExplorePress={handleExplorePress} />
        </View>

        <View className="mb-6">
          <CategoryStrip
            onSeeAll={handleExplorePress}
            categories={categoriesQuery?.data ?? []}
          />
        </View>

        <View className="mb-6">
          <Highlights />
        </View>

        <View className="mb-6">
          <ProductCarousel
            title="Trending now"
            subtitle="Loved by our community"
            products={popularProducts}
            onSeeAll={() =>
              router.push({ pathname: "/search", params: { sort: "popular" } })
            }
            badgeLabel="Featured"
          />
        </View>

        <View className="mb-6">
          <ProductCarousel
            title="Limited time offers"
            subtitle="Grab them before they are gone"
            products={discountedProducts}
            onSeeAll={() => router.push("/offers")}
            badgeLabel="Offers"
          />
        </View>

        <View className="px-4">
          <Button
            title="Browse all products"
            size="md"
            onPress={() => router.push("/search")}
            className="self-start"
            fullWidth
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
