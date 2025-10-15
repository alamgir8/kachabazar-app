import { ScrollView, View } from "react-native";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Category } from "@/types";

interface CategoryStripProps {
  categories: Category[];
  onSeeAll?: () => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  categories,
  onSeeAll,
}) => (
  <>
    <View className="px-5">
      <SectionHeader
        title="Shop by category"
        subtitle="Discover curated collections"
        actionLabel={
          categories[0] &&
          categories[0].children &&
          categories[0].children.length > 0
            ? "See all"
            : undefined
        }
        onActionPress={onSeeAll}
        badgeLabel={undefined}
      />
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      {categories?.[0]?.children?.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </ScrollView>
  </>
);

export default CategoryStrip;
