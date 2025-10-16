import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View, Platform } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
  badgeLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  className,
  badgeLabel,
}) => (
  <View className={cn("mb-6 flex-row items-end justify-between", className)}>
    <View className="flex-1">
      {badgeLabel ? (
        <View
          style={{
            marginBottom: 8,
            alignSelf: "flex-start",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={["rgba(34,197,94,0.16)", "rgba(34,197,94,0.05)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: 2.5,
                color: theme.colors.primary[700],
              }}
            >
              {badgeLabel}
            </Text>
          </LinearGradient>
        </View>
      ) : null}
      <Text className="font-display text-[22px] font-bold text-slate-900">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-[13px] text-slate-500">{subtitle}</Text>
      ) : null}
    </View>
    {actionLabel ? (
      <Pressable
        onPress={onActionPress}
        style={({ pressed }) => [
          {
            borderRadius: 9999,
            overflow: "hidden",
            opacity: pressed ? 0.9 : 1,
          },
          Platform.OS === "ios" && {
            shadowColor: "#22c55e",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          },
          Platform.OS === "android" && {
            elevation: 3,
          },
        ]}
      >
        <LinearGradient
          colors={["#22c55e", "#16a34a", "#15803d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
            minHeight: 28,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#FFFFFF",
              marginRight: 4,
            }}
          >
            {actionLabel}
          </Text>
          <Feather name="arrow-right" size={14} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    ) : null}
  </View>
);
