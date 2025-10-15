import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading awesome things for you..."
}) => (
  <View className="flex-1 items-center justify-center space-y-4 py-16">
    <ActivityIndicator size="large" color="#35b06f" />
    <Text className="text-sm text-slate-500">{message}</Text>
  </View>
);
