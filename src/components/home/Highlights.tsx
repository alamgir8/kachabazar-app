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
    palette: [theme.colors.accent[100], "#ffffff"],
  },
  {
    icon: "gift",
    title: "Daily handpicked offers",
    subtitle: "Save more with curated bundles and flash deals.",
    palette: [theme.colors.primary[100], "#ffffff"],
  },
  {
    icon: "shield",
    title: "Quality you can trust",
    subtitle: "Carefully sourced produce checked for freshness.",
    palette: [theme.colors.accent[200], "#ffffff"],
  },
];

export const Highlights: React.FC<{ items?: HighlightItem[] }> = ({
  items = defaultHighlights,
}) => (
  <View className="gap-2.5">
    {items.map((item, index) => (
      <View
        key={`${item.title}-${index}`}
        className="flex-row items-center rounded-xl bg-white p-4"
        style={{
          shadowColor: "#0c4641",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          className="mr-3 h-11 w-11 items-center justify-center rounded-lg"
          style={{
            backgroundColor: item.palette[0],
          }}
        >
          <Feather
            name={item.icon}
            size={20}
            color={theme.colors.primary[600]}
          />
        </View>
        <View className="flex-1">
          <Text className="mb-0.5 text-[14px] font-bold text-slate-900">
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
