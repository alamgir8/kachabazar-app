import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useCategories } from "@/hooks/queries/useCategories";
import { Category } from "@/types";
import { getLocalizedValue } from "@/utils";
import { BackButton } from "@/components/ui/BackButton";

const CategoryTile: React.FC<{ category: Category; onPress: () => void }> = ({
  category,
  onPress,
}) => (
  <View className="w-1/2 p-2">
    <Pressable
      className="min-h-[146px] justify-between rounded-3xl bg-white p-6 active:opacity-95"
      onPress={onPress}
      style={{
        shadowColor: "rgba(12, 70, 65, 0.16)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 8,
      }}
    >
      <View>
        <Text className="text-base font-bold text-slate-900 leading-snug">
          {getLocalizedValue(category.name as Record<string, string>)}
        </Text>
        {category.children?.length ? (
          <Text className="mt-2 text-xs text-slate-500">
            {category.children.length}{" "}
            {category.children.length === 1 ? "subcategory" : "subcategories"}
          </Text>
        ) : null}
      </View>
      <View className="mt-4 flex-row items-center">
        <Text className="text-sm font-semibold text-primary-600">Explore</Text>
        <Text className="ml-1 text-primary-600">→</Text>
      </View>
    </Pressable>
  </View>
);

export default function CategoriesScreen() {
  const router = useRouter();
  const categoriesQuery = useCategories();

  const onSearch = (value: string) => {
    router.push({ pathname: "/search", params: { q: value } });
  };

  const navigateToCategory = (category: Category) => {
    router.push({
      pathname: "/search",
      params: {
        category: category._id,
        title: getLocalizedValue(category.name as Record<string, string>),
      },
    });
  };

  if (categoriesQuery.isLoading) {
    return <LoadingState message="Loading categories" />;
  }

  if (categoriesQuery.isError) {
    return (
      <Screen className="px-5 pt-20">
        <ErrorState onRetry={() => categoriesQuery.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen innerClassName="px-0">
      <FlatList
        data={categoriesQuery.data?.[0]?.children ?? []}
        keyExtractor={(item) => item._id}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={categoriesQuery.isRefetching}
            onRefresh={() => categoriesQuery.refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 140,
          paddingHorizontal: 12,
          paddingTop: 8,
        }}
        ListHeaderComponent={
          <View className="mb-4 px-3">
            <BackButton />
            <View className="h-3" />
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Categories
            </Text>
            <Text className="mt-2 font-display text-3xl text-slate-900">
              Pick a department
            </Text>
            <SearchBar
              placeholder="Search categories"
              onSubmitSearch={onSearch}
              containerClassName="mt-4"
            />
          </View>
        }
        renderItem={({ item }) => (
          <CategoryTile
            category={item}
            onPress={() => navigateToCategory(item)}
          />
        )}
        ListEmptyComponent={
          <View className="p-10">
            <Text className="text-center text-slate-500">
              No categories available right now. Please check back later.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}
