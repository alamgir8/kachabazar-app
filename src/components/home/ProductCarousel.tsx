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
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
  products,
  emptyLabel,
  onSeeAll
}) => (
  <View className="mb-10">
    <SectionHeader
      title={title}
      subtitle={subtitle}
      actionLabel={products.length > 0 ? "See all" : undefined}
      onActionPress={onSeeAll}
    />
    {products.length === 0 ? (
      <View className="rounded-3xl bg-white/90 p-6 text-center">
        <Text className="text-center text-sm text-slate-500">
          {emptyLabel ?? "We are adding new items soon."}
        </Text>
      </View>
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 18, paddingHorizontal: 4 }}
      >
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ScrollView>
    )}
  </View>
);

export default ProductCarousel;
