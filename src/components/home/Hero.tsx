import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useSettings } from "@/contexts/SettingsContext";
import { theme } from "@/theme";
import { getLocalizedValue } from "@/utils";

interface HeroProps {
  onExplorePress?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePress }) => {
  const { storeCustomization } = useSettings();
  const banner = storeCustomization?.home;

  const headline =
    getLocalizedValue(banner?.hero_title as Record<string, string>) ||
    "Fresh groceries at your doorstep";
  const subheading =
    getLocalizedValue(banner?.hero_subtitle as Record<string, string>) ||
    "Discover curated selections, exciting deals, and seasonal picks for your daily cooking.";
  const cta =
    getLocalizedValue(banner?.hero_cta as Record<string, string>) ||
    "Discover Now";
  const heroImage =
    typeof banner?.hero_image === "string" ? banner?.hero_image : undefined;

  return (
    <Pressable onPress={onExplorePress} className="active:scale-[0.99]">
      <LinearGradient
        colors={["#dcfce7", "#bbf7d0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-3xl"
        style={{
          shadowColor: "#16a34a",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <View className="px-6 py-7">
          <View className="mb-3 self-start flex-row items-center rounded-full bg-white px-3.5 py-1.5 shadow-sm">
            <Feather name="zap" size={14} color="#16a34a" />
            <Text className="ml-2 text-[11px] font-extrabold uppercase tracking-wider text-primary-700">
              Seasonal Picks
            </Text>
          </View>

          <Text className="mb-3 text-[26px] font-extrabold leading-tight text-slate-900">
            {headline}
          </Text>

          <Text className="mb-6 text-[15px] leading-relaxed text-slate-700">
            {subheading}
          </Text>

          <Button
            title={cta}
            size="md"
            onPress={onExplorePress}
            className="self-start"
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
};
