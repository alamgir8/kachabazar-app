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
    <Pressable onPress={onExplorePress} className="active:scale-[0.98]">
      <LinearGradient
        colors={["#f0fdf4", "#ecfdf5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-2xl"
        style={{
          shadowColor: theme.colors.primary[600],
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className="px-5 py-5">
          <View className="mb-3 self-start flex-row items-center rounded-full bg-white px-3 py-1.5 shadow-sm">
            <Feather name="zap" size={13} color={theme.colors.primary[600]} />
            <Text className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-600">
              Seasonal Picks
            </Text>
          </View>

          <Text className="mb-2 text-[22px] font-bold leading-tight text-slate-900">
            {headline}
          </Text>

          <Text className="mb-4 text-[13px] leading-relaxed text-slate-600">
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
