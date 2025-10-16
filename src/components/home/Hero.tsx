import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";
import { CMButton } from "@/components/ui/CMButton";

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
        colors={["#e7ffe9", "#c7f9d7", "#b8f5d0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[40px]"
        style={{
          shadowColor: "rgba(34, 197, 94, 0.35)",
          shadowOffset: { width: 0, height: 22 },
          shadowOpacity: 0.25,
          shadowRadius: 32,
          elevation: 18,
        }}
      >
        <View className="flex-row items-center px-7 py-8">
          <View className="flex-1 pr-4">
            <View className="mb-4 self-start rounded-full bg-white/85 px-4 py-2 shadow-sm">
              <Text className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-600">
                Seasonal Picks
              </Text>
            </View>
            <Text className="text-[28px] font-extrabold leading-tight text-slate-900">
              {headline}
            </Text>
            <Text className="mt-3 text-[15px] leading-relaxed text-emerald-900/70">
              {subheading}
            </Text>
            <View className="mt-6 w-44">
              <CMButton
                title={cta}
                size="md"
                glass
                onPress={onExplorePress}
                className="rounded-full"
              />
            </View>
          </View>

          <View className="h-[180px] w-[160px] items-center justify-center">
            <LinearGradient
              colors={["rgba(255,255,255,0.65)", "rgba(255,255,255,0.15)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              className="absolute inset-0 rounded-[48px]"
            />
            {heroImage ? (
              <Image
                source={{ uri: heroImage }}
                className="h-[180px] w-[160px] rounded-[48px]"
                resizeMode="cover"
              />
            ) : (
              <View className="h-[160px] w-[140px] items-center justify-center rounded-[40px] bg-white/80">
                <Feather name="shopping-bag" size={42} color="#16a34a" />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
