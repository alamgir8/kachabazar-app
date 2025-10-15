import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { Category } from "@/types";
import { theme } from "@/theme";
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
        params: { category: category._id, title: categoryName },
      }}
      asChild
    >
      <Pressable
        className="items-center active:scale-95"
        style={{
          width: 100,
          shadowColor: "#0f7669",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View
          className="h-24 w-24 items-center justify-center rounded-3xl bg-white"
          style={{
            borderWidth: 1,
            borderColor: "rgba(16, 185, 129, 0.1)",
          }}
        >
          {category.icon ? (
            <Image
              source={{ uri: category.icon }}
              className="h-14 w-14 rounded-2xl"
              resizeMode="contain"
            />
          ) : (
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Feather name="tag" size={24} color={theme.colors.primary[600]} />
            </View>
          )}
        </View>
        <Text
          className="mt-2.5 text-center text-[13px] font-bold leading-tight text-slate-800"
          numberOfLines={2}
        >
          {categoryName}
        </Text>
      </Pressable>
    </Link>
  );
};
