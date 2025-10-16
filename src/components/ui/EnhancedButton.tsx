import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
  PressableProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/utils/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "danger"
  | "warning";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface EnhancedButtonProps extends Omit<PressableProps, "children"> {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  contentClassName?: string;
  rounded?: boolean;
  gradient?: boolean;
}

const sizeStyles = {
  xs: {
    height: 32,
    paddingHorizontal: 12,
  },
  sm: {
    height: 40,
    paddingHorizontal: 16,
  },
  md: {
    height: 48,
    paddingHorizontal: 24,
  },
  lg: {
    height: 56,
    paddingHorizontal: 32,
  },
  xl: {
    height: 64,
    paddingHorizontal: 40,
  },
} as const;

const variantConfig = {
  primary: {
    bg: "bg-primary-500",
    text: "text-white",
    border: "border-0",
    activeOpacity: 0.8,
    gradient: ["#10b981", "#059669"] as [string, string],
  },
  secondary: {
    bg: "bg-neutral-800",
    text: "text-white",
    border: "border-0",
    activeOpacity: 0.8,
    gradient: ["#404040", "#262626"] as [string, string],
  },
  outline: {
    bg: "bg-white",
    text: "text-primary-600",
    border: "border border-primary-500",
    activeOpacity: 0.7,
    gradient: undefined,
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-slate-700",
    border: "border-0",
    activeOpacity: 0.6,
    gradient: undefined,
  },
  success: {
    bg: "bg-success",
    text: "text-white",
    border: "border-0",
    activeOpacity: 0.8,
    gradient: ["#10b981", "#059669"] as [string, string],
  },
  danger: {
    bg: "bg-error",
    text: "text-white",
    border: "border-0",
    activeOpacity: 0.8,
    gradient: ["#ef4444", "#dc2626"] as [string, string],
  },
  warning: {
    bg: "bg-warning",
    text: "text-white",
    border: "border-0",
    activeOpacity: 0.8,
    gradient: ["#f59e0b", "#d97706"] as [string, string],
  },
};

export const EnhancedButton = React.forwardRef<View, EnhancedButtonProps>(
  (
    {
      title,
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      className,
      contentClassName,
      rounded = false,
      gradient = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const variantStyle = variantConfig[variant];

    const buttonClasses = cn(
      "items-center justify-center",
      !gradient && variantStyle.bg,
      variantStyle.border,
      fullWidth && "w-full",
      isDisabled && "opacity-50",
      className
    );

    const contentClasses = cn(
      "flex-row items-center justify-center gap-2",
      contentClassName
    );

    const textClasses = cn(
      "font-semibold",
      size === "xs" && "text-xs",
      size === "sm" && "text-xs",
      size === "md" && "text-sm",
      size === "lg" && "text-base",
      size === "xl" && "text-xl",
      variantStyle.text
    );

    const renderContent = () => (
      <View className={contentClasses}>
        {loading ? (
          <ActivityIndicator
            color={
              variant === "outline" || variant === "ghost"
                ? "#10b981"
                : "#ffffff"
            }
            size="small"
          />
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            {(title || children) && (
              <Text className={textClasses}>{title || children}</Text>
            )}
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </View>
    );

    const buttonStyle = [
      styles.button,
      sizeStyles[size],
      rounded && styles.rounded,
    ];

    if (gradient && variantStyle.gradient && !isDisabled) {
      return (
        <Pressable
          disabled={isDisabled}
          className={cn(fullWidth && "w-full", className)}
          {...props}
        >
          {({ pressed }) => (
            <LinearGradient
              colors={variantStyle.gradient!}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                buttonStyle,
                { opacity: pressed ? variantStyle.activeOpacity : 1 },
              ]}
              className="items-center justify-center"
            >
              {renderContent()}
            </LinearGradient>
          )}
        </Pressable>
      );
    }

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        style={buttonStyle}
        {...props}
      >
        {renderContent()}
      </Pressable>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  rounded: {
    borderRadius: 9999,
  },
});
