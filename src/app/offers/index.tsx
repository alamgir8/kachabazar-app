import { useCallback, useMemo } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { ProductCard } from "@/components/cards/ProductCard";
import { useProducts } from "@/hooks/queries/useProducts";
import { BackButton } from "@/components/ui/BackButton";
import { Product } from "@/types";

export default function OffersScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useProducts();
  const discounted = data?.discountedProducts ?? [];

  // Optimized renderItem callback
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View className="flex-1 pb-6">
        <ProductCard product={item} layout="grid" />
      </View>
    ),
    []
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: Product) => item._id, []);

  return (
    <Screen edges={["bottom"]}>
      <FlatList
        data={discounted}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 16, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <View className="mb-4">
            <BackButton
              subTitle="Offers"
              subDescription="Save more on essential"
            />

            {isError ? (
              <Text className="mt-3 text-sm text-red-200">
                Unable to load offers right now.
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View className="px-5 py-20">
            <Text className="text-center text-sm text-slate-500">
              {isLoading
                ? "Fetching fresh deals..."
                : "No offers available at the moment. Check back soon!"}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 4 }}
      />
    </Screen>
  );
}
