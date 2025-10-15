import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface HighlightItem {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
}

const defaultHighlights: HighlightItem[] = [
  {
    icon: "truck",
    title: "Lightning fast delivery",
    subtitle: "Get groceries delivered in under 45 minutes."
  },
  {
    icon: "gift",
    title: "Daily handpicked offers",
    subtitle: "Save more with curated bundles and flash deals."
  },
  {
    icon: "shield",
    title: "Quality you can trust",
    subtitle: "Carefully sourced produce checked for freshness."
  }
];

export const Highlights: React.FC<{ items?: HighlightItem[] }> = ({
  items = defaultHighlights
}) => (
  <View className="mb-8 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.08)]">
    {items.map((item, index) => (
      <View
        key={`${item.title}-${index}`}
        className="mb-5 flex-row items-start last:mb-0"
      >
        <View className="mr-4 rounded-2xl bg-primary-50 p-3">
          <Feather name={item.icon} size={18} color="#1c7646" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-slate-900">{item.title}</Text>
          <Text className="mt-1 text-sm text-slate-500">{item.subtitle}</Text>
        </View>
      </View>
    ))}
  </View>
);

export default Highlights;
