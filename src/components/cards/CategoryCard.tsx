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
          width: 84,
        }}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.98)", "rgba(240,253,244,0.98)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.8)",
            shadowColor: "rgba(22, 163, 74, 0.18)",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 10,
          }}
        >
          {category.icon ? (
            <Image
              source={{ uri: category.icon }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
              }}
              resizeMode="contain"
            />
          ) : (
            <LinearGradient
              colors={["rgba(16,185,129,0.16)", "rgba(16,185,129,0.05)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
              }}
            >
              <Feather name="tag" size={20} color="#16a34a" />
            </LinearGradient>
          )}
        </LinearGradient>
        <Text
          className="mt-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-600"
          numberOfLines={2}
        >
          {categoryName}
        </Text>
      </Pressable>
    </Link>
  );
};
