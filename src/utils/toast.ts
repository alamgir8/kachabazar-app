/**
 * Convenient toast utility functions
 * Usage:
 *   import { showToast } from "@/utils/toast";
 *   showToast.success("Added to cart!");
 *   showToast.error("Something went wrong");
 *   showToast.info("Order is being processed");
 *   showToast.warning("Low stock!");
 */

import Toast from "react-native-toast-message";

interface ToastOptions {
  /** Duration in ms (default: 3000) */
  duration?: number;
  /** Callback when toast is pressed */
  onPress?: () => void;
  /** Position: "top" | "bottom" (default: "top") */
  position?: "top" | "bottom";
}

const show = (
  type: "success" | "error" | "info" | "warning",
  title: string,
  message?: string,
  options?: ToastOptions,
) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: options?.duration ?? 3000,
    position: options?.position ?? "top",
    onPress: options?.onPress,
    topOffset: 55,
    bottomOffset: 80,
  });
};

export const showToast = {
  success: (title: string, message?: string, options?: ToastOptions) =>
    show("success", title, message, options),

  error: (title: string, message?: string, options?: ToastOptions) =>
    show("error", title, message, { duration: 4000, ...options }),

  info: (title: string, message?: string, options?: ToastOptions) =>
    show("info", title, message, options),

  warning: (title: string, message?: string, options?: ToastOptions) =>
    show("warning", title, message, { duration: 4000, ...options }),

  hide: () => Toast.hide(),
};
