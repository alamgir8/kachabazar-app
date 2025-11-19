import React, { useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react-native";
import { HapticFeedback } from "@/utils/accessibility";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

/**
 * Toast notification component
 * Provides non-intrusive feedback to users
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = "info",
  duration = 3000,
  onDismiss,
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (type === "success") HapticFeedback.success();
      if (type === "error") HapticFeedback.error();
      if (type === "warning") HapticFeedback.warning();

      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timeout = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color="#10b981" />;
      case "error":
        return <AlertCircle size={20} color="#ef4444" />;
      case "warning":
        return <AlertCircle size={20} color="#f59e0b" />;
      default:
        return <Info size={20} color="#3b82f6" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-success-light border-success";
      case "error":
        return "bg-error-light border-error";
      case "warning":
        return "bg-warning-light border-warning";
      default:
        return "bg-info-light border-info";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-success-dark";
      case "error":
        return "text-error-dark";
      case "warning":
        return "text-warning-dark";
      default:
        return "text-info-dark";
    }
  };

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute top-16 left-4 right-4 z-50"
    >
      <View
        className={`${getBackgroundColor()} px-4 py-3 rounded-xl border flex-row items-center shadow-lg`}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <View className="mr-3">{getIcon()}</View>
        <Text
          className={`flex-1 ${getTextColor()} font-medium text-sm`}
          numberOfLines={2}
        >
          {message}
        </Text>
        <Pressable
          onPress={handleDismiss}
          className="ml-2 p-1"
          accessibilityLabel="Dismiss notification"
          accessibilityRole="button"
        >
          <X size={18} color="#666" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

/**
 * Toast manager hook
 */
interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = React.useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
  });

  const show = (message: string, type: ToastType = "info") => {
    setToast({ visible: true, message, type });
  };

  const success = (message: string) => show(message, "success");
  const error = (message: string) => show(message, "error");
  const warning = (message: string) => show(message, "warning");
  const info = (message: string) => show(message, "info");

  const dismiss = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return {
    toast,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
  };
}

