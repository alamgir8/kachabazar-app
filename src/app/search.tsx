import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { ProductCard } from "@/components/cards/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChip } from "@/components/ui/FilterChip";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { CategoryDrawer } from "@/components/drawers/CategoryDrawer";
import { useProducts } from "@/hooks/queries/useProducts";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { Category, Product } from "@/types";
import { getLocalizedValue } from "@/utils";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price ↑", value: "price-asc" },
  { label: "Price ↓", value: "price-desc" },
  { label: "Latest", value: "latest" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

export default function SearchScreen() {
  const params = useLocalSearchParams<{
    q?: string;
    category?: string;
    title?: string;
    sort?: SortOption;
  }>();
  const router = useRouter();

  const [search, setSearch] = useState(params.q ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    params.category
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | undefined
  >(params.title);
  const [sort, setSort] = useState<SortOption>(params.sort ?? "relevance");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const productsQuery = useProducts({
    title: debouncedSearch,
    category: selectedCategory,
  });

  const categoriesQuery = useCategories();

  useEffect(() => {
    if (params.q && params.q !== search) {
      setSearch(params.q);
    }
    if (params.category && params.category !== selectedCategory) {
      setSelectedCategory(params.category);
    }
  }, [params.q, params.category]);

  const products = useMemo(() => {
    const dataset = productsQuery.data?.products ?? [];

    if (sort === "price-asc") {
      return [...dataset].sort(
        (a, b) => (a.prices?.price ?? 0) - (b.prices?.price ?? 0)
      );
    }
    if (sort === "price-desc") {
      return [...dataset].sort(
        (a, b) => (b.prices?.price ?? 0) - (a.prices?.price ?? 0)
      );
    }
    if (sort === "latest") {
      return [...dataset].sort((a, b) => {
        const aTime = new Date(a.createdAt ?? 0).getTime();
        const bTime = new Date(b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
    }
    return dataset;
  }, [productsQuery.data?.products, sort]);

  const handleSubmit = (query: string) => {
    setSearch(query);
    router.setParams({ q: query || undefined });
  };

  const handleCategorySelect = (categoryId?: string, categoryName?: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
    router.setParams({
      category: categoryId || undefined,
      title: categoryName || undefined,
    });
  };

  const headerTitle =
    selectedCategoryName ??
    (debouncedSearch
      ? `Results for "${debouncedSearch}"`
      : "Discover everything");

  // Optimized renderItem callback
  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    []
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: Product) => item._id, []);

  if (productsQuery.isLoading && !productsQuery.isFetching) {
    return <LoadingState message="Searching our catalogue..." />;
  }

  if (productsQuery.isError) {
    return (
      <Screen className="px-5 pt-20">
        <ErrorState
          message="We could not fetch products right now."
          onRetry={() => productsQuery.refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={["bottom"]}>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          gap: 12,
          paddingHorizontal: 8,
          paddingVertical: 6,
          justifyContent: "space-between",
        }}
        refreshControl={
          <RefreshControl
            refreshing={productsQuery.isFetching}
            onRefresh={() => productsQuery.refetch()}
          />
        }
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <View className="mb-4">
            {/* Back Button */}
            <BackButton
              subTitle="Explore"
              subDescription={headerTitle || "Discover everything"}
            />

            <View className="h-3" />
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search for avocado, snacks, beverages..."
              onSubmitSearch={handleSubmit}
              containerClassName="mt-5"
            />

            {/* Category Filter Button */}
            <View className="mt-5 flex-row items-center gap-3">
              <Pressable
                onPress={() => setDrawerVisible(true)}
                className="flex-1 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <Feather name="filter" size={20} color="#059669" />
                  <Text
                    className="flex-1 text-base font-semibold text-emerald-700"
                    numberOfLines={1}
                  >
                    {selectedCategoryName || "All Categories"}
                  </Text>
                </View>
                <Feather name="chevron-down" size={20} color="#059669" />
              </Pressable>

              {selectedCategory && (
                <Pressable
                  onPress={() => handleCategorySelect(undefined, undefined)}
                  className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50"
                >
                  <Feather name="x" size={20} color="#dc2626" />
                </Pressable>
              )}
            </View>

            {/* Sort Filters */}
            <View className="mt-3 flex-row flex-wrap gap-2">
              {sortOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  active={sort === option.value}
                  onPress={() => setSort(option.value)}
                />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="px-5 py-20">
            {productsQuery.isFetching ? (
              <ActivityIndicator size="large" color="#10b981" />
            ) : (
              <Text className="text-center text-sm text-slate-500">
                We could not find anything that matches your search. Try another
                keyword or filters.
              </Text>
            )}
          </View>
        }
      />

      {/* Category Drawer */}
      <CategoryDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        categories={categoriesQuery?.data ?? []}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
    </Screen>
  );
}
