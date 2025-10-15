import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import { theme } from "@/theme";

interface HighlightItem {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  palette: [string, string];
}

const defaultHighlights: HighlightItem[] = [
  {
    icon: "truck",
    title: "Lightning fast delivery",
    subtitle: "Get groceries delivered in under 45 minutes.",
    palette: ["#dcfce7", "#ffffff"],
  },
  {
    icon: "gift",
    title: "Daily handpicked offers",
    subtitle: "Save more with curated bundles and flash deals.",
    palette: ["#bbf7d0", "#ffffff"],
  },
  {
    icon: "shield",
    title: "Quality you can trust",
    subtitle: "Carefully sourced produce checked for freshness.",
    palette: ["#86efac", "#ffffff"],
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
          shadowColor: "rgba(22, 163, 74, 0.1)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: item.palette[0],
          }}
        >
          <Feather name={item.icon} size={22} color="#16a34a" />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-[14px] font-extrabold text-slate-900">
            {item.title}
          </Text>
          <Text className="text-[12px] leading-5 text-slate-600">
            {item.subtitle}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

export default Highlights;
