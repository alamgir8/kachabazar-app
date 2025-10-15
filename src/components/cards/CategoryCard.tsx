import { Image, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Category } from "@/types";
import { getLocalizedValue } from "@/utils";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const categoryName = getLocalizedValue(
    category.name as Record<string, string>
  );

  return (
    <Link
      href={{
        pathname: "/search",
        params: { category: category._id, title: categoryName }
      }}
      asChild
    >
      <Pressable className="w-24 items-center">
        <LinearGradient
          colors={["#f0fdf4", "#ffffff"]}
          className="h-24 w-24 items-center justify-center rounded-3xl"
        >
          {category.icon ? (
            <Image
              source={{ uri: category.icon }}
              className="h-16 w-16 rounded-2xl"
              resizeMode="contain"
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
              <Feather name="tag" size={22} color="#199060" />
            </View>
          )}
        </LinearGradient>
        <Text className="mt-2 text-center text-sm font-semibold text-slate-700">
          {categoryName}
        </Text>
      </Pressable>
    </Link>
  );
};
