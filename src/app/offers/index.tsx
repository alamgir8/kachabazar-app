import { FlatList, RefreshControl, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { ProductCard } from "@/components/cards/ProductCard";
import { useProducts } from "@/hooks/queries/useProducts";
import { useAttributes } from "@/hooks/queries/useAttributes";
import { BackButton } from "@/components/ui/BackButton";

export default function OffersScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useProducts();
  const attributesQuery = useAttributes();
  const discounted = data?.discountedProducts ?? [];

  return (
    <Screen edges={["bottom"]}>
      <FlatList
        data={discounted}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        }
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
        renderItem={({ item }) => (
          <View className="flex-1 pb-6">
            <ProductCard
              product={item}
              layout="grid"
              attributes={attributesQuery.data || []}
            />
          </View>
        )}
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
