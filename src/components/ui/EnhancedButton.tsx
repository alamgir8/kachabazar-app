import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ViewStyle,
  TextStyle,
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

const sizeConfig = {
  xs: {
    paddingX: "px-3",
    paddingY: "py-2",
    text: "text-xs",
    height: "h-8",
    gap: "gap-1",
  },
  sm: {
    paddingX: "px-4",
    paddingY: "py-2.5",
    text: "text-sm",
    height: "h-10",
    gap: "gap-1.5",
  },
  md: {
    paddingX: "px-6",
    paddingY: "py-3",
    text: "text-base",
    height: "h-12",
    gap: "gap-2",
  },
  lg: {
    paddingX: "px-8",
    paddingY: "py-4",
    text: "text-lg",
    height: "h-14",
    gap: "gap-2",
  },
  xl: {
    paddingX: "px-10",
    paddingY: "py-5",
    text: "text-xl",
    height: "h-16",
    gap: "gap-2.5",
  },
};

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
    const sizeStyle = sizeConfig[size];
    const variantStyle = variantConfig[variant];

    const buttonClasses = cn(
      "items-center justify-center",
      sizeStyle.height,
      sizeStyle.paddingX,
      !gradient && variantStyle.bg,
      variantStyle.border,
      rounded ? "rounded-full" : "rounded-xl",
      fullWidth && "w-full",
      isDisabled && "opacity-50",
      className
    );

    const contentClasses = cn(
      "flex-row items-center justify-center",
      sizeStyle.gap,
      contentClassName
    );

    const textClasses = cn("font-semibold", sizeStyle.text, variantStyle.text);

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

    if (gradient && variantStyle.gradient && !isDisabled) {
      return (
        <Pressable
          disabled={isDisabled}
          {...props}
          style={({ pressed }) => [
            { opacity: pressed ? variantStyle.activeOpacity : 1 },
            fullWidth && { width: "100%" },
          ]}
        >
          <LinearGradient
            colors={variantStyle.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className={buttonClasses}
          >
            {renderContent()}
          </LinearGradient>
        </Pressable>
      );
    }

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
        style={({ pressed }) => [
          { opacity: pressed ? variantStyle.activeOpacity : 1 },
        ]}
      >
        {renderContent()}
      </Pressable>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
