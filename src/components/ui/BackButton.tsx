import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ViewStyle } from "react-native";

import { theme } from "@/theme";

interface BackButtonProps {
  tint?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  tint = theme.colors.primary[700],
  onPress,
  style,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="h-11 w-11 items-center justify-center rounded-full bg-white/85"
      style={{
        shadowColor: "rgba(12, 70, 65, 0.18)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        ...style,
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Feather name="arrow-left" size={20} color={tint} />
    </Pressable>
  );
};
