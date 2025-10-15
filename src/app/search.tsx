import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { ProductCard } from "@/components/cards/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChip } from "@/components/ui/FilterChip";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useProducts } from "@/hooks/queries/useProducts";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { Category } from "@/types";
import { getLocalizedValue } from "@/utils";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price ↑", value: "price-asc" },
  { label: "Price ↓", value: "price-desc" },
  { label: "Latest", value: "latest" }
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
  const [sort, setSort] = useState<SortOption>(params.sort ?? "relevance");

  const debouncedSearch = useDebounce(search, 350);

  const productsQuery = useProducts({
    title: debouncedSearch,
    category: selectedCategory
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

  const handleCategoryPress = (category?: Category) => {
    if (!category) {
      setSelectedCategory(undefined);
      router.setParams({ category: undefined, title: undefined });
      return;
    }

    setSelectedCategory(category._id);
    router.setParams({
      category: category._id,
      title: getLocalizedValue(category.name as Record<string, string>)
    });
  };

  const headerTitle =
    params.title ??
    (selectedCategory
      ? getLocalizedValue(
          categoriesQuery.data?.find((item) => item._id === selectedCategory)
            ?.name as Record<string, string>
        )
      : debouncedSearch
      ? `Results for "${debouncedSearch}"`
      : "Discover everything");

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
    <Screen innerClassName="px-0">
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={productsQuery.isFetching}
            onRefresh={() => productsQuery.refetch()}
          />
        }
        ListHeaderComponent={
          <View className="px-5 pt-16">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Explore
            </Text>
            <Text className="mt-2 font-display text-3xl text-slate-900">
              {headerTitle || "Discover everything"}
            </Text>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search for avocado, snacks, beverages..."
              onSubmitSearch={handleSubmit}
              containerClassName="mt-5"
            />
            <View className="mt-4 flex-row flex-wrap">
              <FilterChip
                label="All"
                active={!selectedCategory}
                onPress={() => handleCategoryPress(undefined)}
              />
              {categoriesQuery.data?.slice(0, 6).map((category) => (
                <FilterChip
                  key={category._id}
                  label={getLocalizedValue(
                    category.name as Record<string, string>
                  )}
                  active={selectedCategory === category._id}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </View>
            <View className="mt-4 flex-row flex-wrap">
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
        renderItem={({ item }) => (
          <View className="px-5 pb-6">
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <View className="px-5 py-20">
            {productsQuery.isFetching ? (
              <ActivityIndicator size="large" color="#35b06f" />
            ) : (
              <Text className="text-center text-sm text-slate-500">
                We could not find anything that matches your search. Try another
                keyword or filters.
              </Text>
            )}
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 160,
          paddingHorizontal: 4
        }}
      />
    </Screen>
  );
}
