import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import { Product } from "@/types";
import { theme } from "@/theme";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  emptyLabel?: string;
  onSeeAll?: () => void;
  badgeLabel?: string | null;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
  products,
  emptyLabel,
  onSeeAll,
  badgeLabel = "Featured",
}) => (
  <View>
    <SectionHeader
      className="px-0"
      title={title}
      subtitle={subtitle}
      actionLabel={products.length > 0 ? "See all" : undefined}
      onActionPress={onSeeAll}
      badgeLabel={badgeLabel ?? undefined}
    />
    {products.length === 0 ? (
      <View
        className="overflow-hidden rounded-3xl"
        style={{
          shadowColor: "#47f587",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          borderWidth: 1,
          borderColor: "rgba(34, 197, 94, 0.15)",
        }}
      >
        {/* Linear Gradient Background */}
        <LinearGradient
          colors={["#f0fdf4", "#dcfce7", "#bbf7d0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        {/* Decorative circles for visual interest */}
        <View
          style={{
            position: "absolute",
            right: -24,
            top: -24,
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "white",
            opacity: 0.3,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: -16,
            bottom: -16,
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "white",
            opacity: 0.2,
          }}
        />

        <View className="items-center justify-center px-6 py-10">
          <View
            className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: "#22c55e",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Feather
              name="package"
              size={22}
              color={theme.colors.primary[500]}
            />
          </View>
          <Text className="text-center font-semibold text-slate-700">
            {emptyLabel ?? "No items here yet"}
          </Text>
          <Text className="mt-1 text-center text-[12px] leading-5 text-slate-500">
            Check back soon for freshly stocked picks curated for you.
          </Text>
        </View>
      </View>
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingLeft: 6,
          paddingRight: 28,
          paddingVertical: 12,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} layout="carousel" />
        ))}
      </ScrollView>
    )}
  </View>
);

export default ProductCarousel;
