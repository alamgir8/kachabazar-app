import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";
import { CMButton } from "@/components/ui/CMButton";

interface HeroProps {
  onExplorePress?: () => void;
}

const { width: screenWidth } = Dimensions.get("window");
const isSmallDevice = screenWidth < 375;

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
    <Pressable
      onPress={onExplorePress}
      className="active:opacity-95"
      style={{
        shadowColor: "#47f587",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <View
        className="overflow-hidden rounded-3xl my-8"
        style={{
          borderWidth: 1,
          borderColor: "rgba(34, 197, 94, 0.2)",
        }}
      >
        {/* Linear Gradient Background */}
        <LinearGradient
          colors={["#dcfce7", "#bbf7d0", "#339467"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        {/* Decorative circles for visual interest */}
        <View
          style={{
            position: "absolute",
            right: -32,
            top: -32,
            width: 128,
            height: 128,
            borderRadius: 64,
            backgroundColor: "white",
            opacity: 0.2,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: -16,
            bottom: -16,
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "white",
            opacity: 0.15,
          }}
        />

        <View className="flex-row items-center justify-between p-5">
          {/* Left Content */}
          <View className="flex-1 pr-3">
            <View className="mb-3 self-start rounded-full bg-primary-500 px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
                🎉 Fresh Deals
              </Text>
            </View>

            <Text
              className="text-2xl font-bold leading-tight text-slate-900"
              style={{
                fontSize: isSmallDevice ? 20 : 24,
                lineHeight: isSmallDevice ? 26 : 30,
              }}
              numberOfLines={2}
            >
              {headline}
            </Text>

            <Text
              className="mt-2 text-sm leading-relaxed text-slate-600"
              style={{ fontSize: isSmallDevice ? 12 : 14 }}
              numberOfLines={2}
            >
              {subheading}
            </Text>

            <View className="mt-4">
              <CMButton
                title={cta}
                size={isSmallDevice ? "sm" : "md"}
                onPress={onExplorePress}
                className="rounded-full bg-primary-500 self-start"
              />
            </View>
          </View>

          {/* Right Image */}
          <View
            className="items-center justify-center overflow-hidden rounded-2xl bg-white"
            style={{
              width: isSmallDevice ? 100 : 120,
              height: isSmallDevice ? 100 : 120,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Image
              source={
                heroImage
                  ? { uri: heroImage }
                  : require("../../assets/icon.png")
              }
              style={{
                width: isSmallDevice ? 100 : 120,
                height: isSmallDevice ? 100 : 120,
              }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Bottom Accent Bar */}
        {/* <View className="h-1.5 bg-primary-500" /> */}
      </View>
    </Pressable>
  );
};
