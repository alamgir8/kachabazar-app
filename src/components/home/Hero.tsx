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
    <Pressable onPress={onExplorePress} className="mb-8">
      <LinearGradient
        colors={[theme.colors.primary[100], theme.colors.accent[100], "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden"
        style={{
          borderRadius: 32,
          shadowColor: theme.colors.primary[800],
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.16,
          shadowRadius: 26,
          elevation: 14,
        }}
      >
        <View className="flex-row items-center px-6 py-7">
          <View className="flex-1 pr-4">
            <View className="mb-4 self-start flex-row items-center rounded-full bg-white/70 px-4 py-2">
              <Feather
                name="zap"
                size={16}
                color={theme.colors.accent[600]}
              />
              <Text className="ml-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-600">
                Seasonal Picks
              </Text>
            </View>
            <Text className="font-display text-[28px] leading-tight text-slate-900">
              {headline}
            </Text>
            <Text className="mt-3 text-sm leading-6 text-slate-600">
              {subheading}
            </Text>
            <Button
              title={cta}
              className="mt-5"
              size="lg"
              onPress={onExplorePress}
            />
          </View>

          <View className="h-36 w-36 items-center justify-center">
            <LinearGradient
              colors={["rgba(38,189,166,0.15)", "rgba(162,109,255,0.12)"]}
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                borderRadius: 180,
                transform: [{ rotate: "12deg" }],
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            {heroImage ? (
              <Image
                source={{ uri: heroImage }}
                className="h-32 w-32"
                resizeMode="contain"
              />
            ) : (
              <View className="h-28 w-28 items-center justify-center rounded-full bg-white/70">
                <Feather
                  name="shopping-bag"
                  size={32}
                  color={theme.colors.primary[600]}
                />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
