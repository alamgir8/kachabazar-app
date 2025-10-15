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
          width: 90,
        }}
      >
        <View
          className="h-20 w-20 items-center justify-center rounded-2xl bg-white"
          style={{
            shadowColor: "#0c4641",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          {category.icon ? (
            <Image
              source={{ uri: category.icon }}
              className="h-12 w-12 rounded-xl"
              resizeMode="contain"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
              <Feather name="tag" size={20} color={theme.colors.primary[600]} />
            </View>
          )}
        </View>
        <Text
          className="mt-2 text-center text-[12px] font-semibold leading-tight text-slate-800"
          numberOfLines={2}
        >
          {categoryName}
        </Text>
      </Pressable>
    </Link>
  );
};
