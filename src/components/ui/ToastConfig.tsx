/**
 * Custom Toast configuration for beautiful toast notifications
 * Replaces native Alert.alert for success/error/info/warning messages
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Toast, {
  type ToastConfig as ToastConfigType,
  type BaseToastProps,
} from "react-native-toast-message";

const TOAST_STYLES = {
  success: {
    bg: "#ecfdf5",
    border: "#10b981",
    iconBg: "#d1fae5",
    icon: "check-circle" as const,
    iconColor: "#059669",
    titleColor: "#065f46",
    messageColor: "#047857",
  },
  error: {
    bg: "#fef2f2",
    border: "#ef4444",
    iconBg: "#fee2e2",
    icon: "x-circle" as const,
    iconColor: "#dc2626",
    titleColor: "#991b1b",
    messageColor: "#b91c1c",
  },
  info: {
    bg: "#eff6ff",
    border: "#3b82f6",
    iconBg: "#dbeafe",
    icon: "info" as const,
    iconColor: "#2563eb",
    titleColor: "#1e40af",
    messageColor: "#1d4ed8",
  },
  warning: {
    bg: "#fffbeb",
    border: "#f59e0b",
    iconBg: "#fef3c7",
    icon: "alert-triangle" as const,
    iconColor: "#d97706",
    titleColor: "#92400e",
    messageColor: "#b45309",
  },
};

type ToastType = keyof typeof TOAST_STYLES;

const CustomToast = ({
  type,
  text1,
  text2,
  onPress,
}: {
  type: ToastType;
  text1?: string;
  text2?: string;
  onPress?: () => void;
}) => {
  const style = TOAST_STYLES[type];

  return (
    <Pressable
      onPress={() => {
        onPress?.();
        Toast.hide();
      }}
      style={{
        width: "92%",
        minHeight: 56,
        borderRadius: 16,
        backgroundColor: style.bg,
        borderLeftWidth: 4,
        borderLeftColor: style.border,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: style.iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Feather name={style.icon} size={20} color={style.iconColor} />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        {text1 ? (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: style.titleColor,
              marginBottom: text2 ? 2 : 0,
            }}
            numberOfLines={1}
          >
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: style.messageColor,
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {text2}
          </Text>
        ) : null}
      </View>

      {/* Close */}
      <Pressable
        onPress={() => Toast.hide()}
        hitSlop={10}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        }}
      >
        <Feather name="x" size={14} color={style.messageColor} />
      </Pressable>
    </Pressable>
  );
};

export const toastConfig: ToastConfigType = {
  success: (props: BaseToastProps) => (
    <CustomToast
      type="success"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
    />
  ),
  error: (props: BaseToastProps) => (
    <CustomToast
      type="error"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
    />
  ),
  info: (props: BaseToastProps) => (
    <CustomToast
      type="info"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
    />
  ),
  warning: (props: BaseToastProps) => (
    <CustomToast
      type="warning"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
    />
  ),
};
