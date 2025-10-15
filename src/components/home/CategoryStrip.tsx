import { ScrollView } from "react-native";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Category } from "@/types";

interface CategoryStripProps {
  categories: Category[];
  onSeeAll?: () => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  categories,
  onSeeAll
}) => (
  <>
    <SectionHeader
      title="Shop by category"
      subtitle="Discover curated collections"
      actionLabel={categories.length > 0 ? "See all" : undefined}
      onActionPress={onSeeAll}
    />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 18 }}
    >
      {categories.map(category => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </ScrollView>
  </>
);

export default CategoryStrip;
