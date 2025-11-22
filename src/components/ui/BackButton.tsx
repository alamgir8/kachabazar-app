import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface BackButtonProps {
  tint?: string;
  onPress?: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  tint = theme.colors.primary[700],
  onPress,
  className,
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
      className={cn(
        "h-11 w-11 mb-2 items-center justify-center rounded-full bg-white/85 shadow-lg active:bg-white/95",
        className
      )}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Feather name="arrow-left" size={20} color={tint} />
    </Pressable>
  );
};
