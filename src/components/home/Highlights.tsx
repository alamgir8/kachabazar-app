import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

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
  <View className="gap-4">
    {items.map((item, index) => (
      <LinearGradient
        key={`${item.title}-${index}`}
        colors={[item.palette[0], item.palette[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 28,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.7)",
          paddingHorizontal: 20,
          paddingVertical: 16,
          shadowColor: "rgba(22, 163, 74, 0.16)",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.85)", "rgba(255,255,255,0.3)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginRight: 16,
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
          }}
        >
          <Feather name={item.icon} size={22} color="#16a34a" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text className="mb-1 text-[15px] font-extrabold text-slate-900">
            {item.title}
          </Text>
          <Text className="text-[12px] leading-5 text-slate-700/80">
            {item.subtitle}
          </Text>
        </View>
      </LinearGradient>
    ))}
  </View>
);

export default Highlights;
