import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface HighlightItem {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
}

const defaultHighlights: HighlightItem[] = [
  {
    icon: "truck",
    title: "Lightning fast delivery",
    subtitle: "Get groceries delivered in under 45 minutes.",
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  {
    icon: "gift",
    title: "Daily handpicked offers",
    subtitle: "Save more with curated bundles and flash deals.",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  {
    icon: "shield",
    title: "Quality you can trust",
    subtitle: "Carefully sourced produce checked for freshness.",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
];

export const Highlights: React.FC<{ items?: HighlightItem[] }> = ({
  items = defaultHighlights,
}) => (
  <View className="gap-3">
    {items.map((item, index) => (
      <View
        key={`${item.title}-${index}`}
        className="flex-row items-center rounded-2xl bg-white p-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <View
          className="mr-4 h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: item.bgColor }}
        >
          <Feather name={item.icon} size={24} color={item.color} />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-base font-bold text-slate-900">
            {item.title}
          </Text>
          <Text className="text-sm leading-5 text-slate-600">
            {item.subtitle}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

export default Highlights;
