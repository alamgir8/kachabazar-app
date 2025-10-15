import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";

interface HeroProps {
  onExplorePress?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePress }) => {
  const { storeCustomization } = useSettings();
  const banner = storeCustomization?.home;

  const headline = getLocalizedValue(
    banner?.hero_title as Record<string, string>
  ) || "Fresh groceries at your doorstep";
  const subheading =
    getLocalizedValue(banner?.hero_subtitle as Record<string, string>) ||
    "Discover curated selections, exciting deals, and seasonal picks for your daily cooking.";
  const cta =
    getLocalizedValue(banner?.hero_cta as Record<string, string>) ||
    "Discover Now";
  const heroImage =
    typeof banner?.hero_image === "string" ? banner?.hero_image : undefined;

  return (
    <LinearGradient
      colors={["#d3f8ce", "#f5fbf7", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="mb-8 overflow-hidden rounded-3xl p-6"
    >
      <View className="flex-row">
        <View className="flex-1 pr-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
            Seasonal Picks
          </Text>
          <Text className="mt-2 font-display text-3xl leading-tight text-slate-900">
            {headline}
          </Text>
          <Text className="mt-3 text-sm text-slate-600">{subheading}</Text>
          <Button
            title={cta}
            className="mt-6 self-start px-8"
            onPress={onExplorePress}
          />
        </View>
        {heroImage ? (
          <Image
            source={{ uri: heroImage }}
            className="h-40 w-40"
            resizeMode="contain"
          />
        ) : null}
      </View>
    </LinearGradient>
  );
};
