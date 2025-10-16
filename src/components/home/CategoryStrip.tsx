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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 18,
        paddingLeft: 6,
        paddingRight: 28,
        paddingBottom: 14,
      }}
    >
      {categories?.[0]?.children?.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </ScrollView>
  </>
);

export default CategoryStrip;
