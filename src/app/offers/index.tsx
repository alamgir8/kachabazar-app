import { FlatList, RefreshControl, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { ProductCard } from "@/components/cards/ProductCard";
import { useProducts } from "@/hooks/queries/useProducts";

export default function OffersScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useProducts();
  const discounted = data?.discountedProducts ?? [];

  return (
    <Screen className="px-0 pt-0" edges={["top", "bottom"]}>
      <FlatList
        data={discounted}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        }
        ListHeaderComponent={
          <View className="bg-gradient-to-b from-primary-600 to-primary-500 px-5 pb-8 pt-16">
            <Pressable
              onPress={() => router.back()}
              className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </Pressable>
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Exclusive offers
            </Text>
            <Text className="mt-2 font-display text-3xl font-bold text-white">
              Save more on essentials
            </Text>
            <Text className="mt-4 text-sm text-white/90">
              Fresh deals curated daily. Tap any product to learn more or add to
              cart instantly.
            </Text>
            {isError ? (
              <Text className="mt-3 text-sm text-red-200">
                Unable to load offers right now.
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5 pb-6">
            <ProductCard product={item} />
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
