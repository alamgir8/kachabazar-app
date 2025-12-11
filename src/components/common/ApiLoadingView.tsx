import { View, Text, ActivityIndicator } from "react-native";

interface ApiLoadingViewProps {
  message?: string;
  fullScreen?: boolean;
  size?: "small" | "large";
  color?: string;
}

/**
 * Reusable loading view component for API calls
 */
export function ApiLoadingView({
  message = "Loading...",
  fullScreen = false,
  size = "large",
  color = "#0f766e",
}: ApiLoadingViewProps) {
  const content = (
    <View className="items-center justify-center py-12">
      <ActivityIndicator size={size} color={color} />
      {message ? (
        <Text className="mt-4 text-sm text-slate-500">{message}</Text>
      ) : null}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        {content}
      </View>
    );
  }

  return content;
}
