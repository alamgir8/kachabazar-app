import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/ui/Button";

interface ApiErrorViewProps {
  error?: Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  fullScreen?: boolean;
}

/**
 * Reusable error view component for API errors
 * Displays appropriate error messages and actions
 */
export function ApiErrorView({
  error,
  title,
  message,
  onRetry,
  showBackButton = true,
  showHomeButton = false,
  fullScreen = false,
}: ApiErrorViewProps) {
  const router = useRouter();

  // Determine error type and appropriate message
  const getErrorDetails = () => {
    const errorMessage = error?.message?.toLowerCase() ?? "";

    // Network errors
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("connection")
    ) {
      return {
        icon: "wifi-off" as const,
        iconColor: "#f59e0b",
        iconBg: "bg-amber-50",
        title: title ?? "No Internet Connection",
        message: message ?? "Please check your connection and try again.",
      };
    }

    // Auth errors (will be handled by auto-logout, but show message)
    if (
      errorMessage.includes("jwt") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("401") ||
      errorMessage.includes("token")
    ) {
      return {
        icon: "lock" as const,
        iconColor: "#ef4444",
        iconBg: "bg-red-50",
        title: title ?? "Session Expired",
        message: message ?? "Your session has expired. Please login again.",
      };
    }

    // Server errors
    if (
      errorMessage.includes("500") ||
      errorMessage.includes("server") ||
      errorMessage.includes("internal")
    ) {
      return {
        icon: "server" as const,
        iconColor: "#ef4444",
        iconBg: "bg-red-50",
        title: title ?? "Server Error",
        message:
          message ?? "Something went wrong on our end. Please try again later.",
      };
    }

    // Not found errors
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      return {
        icon: "search" as const,
        iconColor: "#64748b",
        iconBg: "bg-slate-100",
        title: title ?? "Not Found",
        message: message ?? "The resource you're looking for doesn't exist.",
      };
    }

    // Default error
    return {
      icon: "alert-circle" as const,
      iconColor: "#dc2626",
      iconBg: "bg-red-50",
      title: title ?? "Something Went Wrong",
      message: message ?? error?.message ?? "An unexpected error occurred.",
    };
  };

  const details = getErrorDetails();

  const content = (
    <View className="rounded-3xl bg-white p-8 shadow-lg">
      <View
        className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${details.iconBg}`}
      >
        <Feather name={details.icon} size={28} color={details.iconColor} />
      </View>
      <Text className="text-xl font-bold text-slate-900">{details.title}</Text>
      <Text className="mt-3 text-sm leading-relaxed text-slate-600">
        {details.message}
      </Text>

      <View className="mt-6 gap-3">
        {onRetry ? (
          <Button variant="primary" title="Try Again" onPress={onRetry} />
        ) : null}

        {showBackButton ? (
          <Button
            variant="outline"
            title="Go Back"
            onPress={() => router.back()}
          />
        ) : null}

        {showHomeButton ? (
          <Button
            variant="outline"
            title="Go Home"
            onPress={() => router.replace("/(tabs)")}
          />
        ) : null}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        {content}
      </View>
    );
  }

  return <View className="px-5">{content}</View>;
}
