import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { useSettings } from "@/contexts/SettingsContext";
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
    <Pressable onPress={onExplorePress}>
      <LinearGradient
        colors={["#d1fae5", "#ecfdf5", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mb-6 overflow-hidden rounded-3xl"
        style={{
          shadowColor: "#10b981",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <View className="p-6">
          <View className="mb-3 flex-row items-center">
            <View className="mr-2 rounded-full bg-green-600 px-3 py-1">
              <Text className="text-xs font-bold text-white">HOT DEALS</Text>
            </View>
            <Feather name="zap" size={16} color="#16a34a" />
          </View>

          <Text className="mb-2 font-display text-3xl font-bold leading-tight text-slate-900">
            {headline}
          </Text>

          <Text className="mb-5 text-sm leading-6 text-slate-600">
            {subheading}
          </Text>

          {heroImage && (
            <View className="absolute right-4 top-4 h-32 w-32">
              <Image
                source={{ uri: heroImage }}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
          )}

          <Pressable
            onPress={onExplorePress}
            className="flex-row items-center self-start rounded-xl bg-green-600 px-5 py-3"
            style={{
              shadowColor: "#16a34a",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="mr-2 font-semibold text-white">{cta}</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
