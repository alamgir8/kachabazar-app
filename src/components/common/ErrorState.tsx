import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We are working to fix it. Please try again shortly.",
  actionLabel = "Retry",
  onRetry
}) => (
  <View className="items-center justify-center space-y-4 rounded-3xl bg-white p-8 shadow-[0_12px_40px_rgba(15,118,110,0.08)]">
    <View className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
      <Feather name="alert-triangle" size={26} color="#f97066" />
    </View>
    <Text className="text-lg font-semibold text-slate-900">{title}</Text>
    <Text className="text-center text-sm text-slate-500">{message}</Text>
    {onRetry ? (
      <Pressable
        className="flex-row items-center rounded-full bg-primary-500 px-4 py-2"
        onPress={onRetry}
      >
        <Feather name="refresh-cw" size={16} color="#ffffff" />
        <Text className="ml-2 text-sm font-semibold text-white">
          {actionLabel}
        </Text>
      </Pressable>
    ) : null}
  </View>
);
