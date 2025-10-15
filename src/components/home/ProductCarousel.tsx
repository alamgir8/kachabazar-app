import { ScrollView, Text, View } from "react-native";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import { Product } from "@/types";

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
    <View className="px-5">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={products.length > 0 ? "See all" : undefined}
        onActionPress={onSeeAll}
        badgeLabel={badgeLabel}
      />
    </View>
    {products.length === 0 ? (
      <View className="mx-5 rounded-3xl bg-slate-50 p-8">
        <Text className="text-center text-sm text-slate-500">
          {emptyLabel ?? "We are adding new items soon."}
        </Text>
      </View>
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 6 }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} layout="carousel" />
        ))}
      </ScrollView>
    )}
  </View>
);

export default ProductCarousel;
