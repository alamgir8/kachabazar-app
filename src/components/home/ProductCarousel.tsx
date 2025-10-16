import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

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
      <View className="items-center justify-center rounded-3xl border border-dashed border-emerald-200/60 bg-emerald-50/40 px-6 py-10">
        <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-white">
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
