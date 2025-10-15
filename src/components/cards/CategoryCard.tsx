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
        params: { category: category._id, title: categoryName }
      }}
      asChild
    >
      <Pressable
        className="min-w-[106px] items-center"
        style={{
          shadowColor: theme.colors.primary[900],
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <LinearGradient
          colors={[
            theme.colors.primary[50],
            "rgba(162, 109, 255, 0.08)",
            "#ffffff",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-[110px] w-[110px] items-center justify-center rounded-3xl"
          style={{
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.6)",
          }}
        >
          {category.icon ? (
            <Image
              source={{ uri: category.icon }}
              className="h-16 w-16 rounded-2xl"
              resizeMode="contain"
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/80">
              <Feather
                name="tag"
                size={22}
                color={theme.colors.accent[600]}
              />
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
