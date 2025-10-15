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
  <View className="gap-4">
    {items.map((item, index) => (
      <LinearGradient
        key={`${item.title}-${index}`}
        colors={item.palette}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center rounded-3xl px-5 py-4"
        style={{
          shadowColor: theme.colors.primary[900],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 18,
          elevation: 6,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.7)",
        }}
      >
        <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-white/70">
          <Feather
            name={item.icon}
            size={24}
            color={theme.colors.primary[700]}
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-base font-semibold text-slate-900">
            {item.title}
          </Text>
          <Text className="text-[13px] leading-5 text-slate-600">
            {item.subtitle}
          </Text>
        </View>
      </LinearGradient>
    ))}
  </View>
);

export default Highlights;
