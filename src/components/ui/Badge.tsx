import React from "react";
import { View, Text, ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary-100 border-primary-200",
  secondary: "bg-neutral-100 border-neutral-200",
  success: "bg-success-light border-success",
  error: "bg-error-light border-error",
  warning: "bg-warning-light border-warning",
  info: "bg-info-light border-info",
  neutral: "bg-neutral-100 border-neutral-200",
};

const textVariantStyles = {
  primary: "text-primary-700",
  secondary: "text-neutral-700",
  success: "text-success-dark",
  error: "text-error-dark",
  warning: "text-warning-dark",
  info: "text-info-dark",
  neutral: "text-neutral-700",
};

const sizeStyles = {
  sm: {
    container: "px-2 py-0.5",
    text: "text-2xs",
  },
  md: {
    container: "px-2.5 py-1",
    text: "text-xs",
  },
  lg: {
    container: "px-3 py-1.5",
    text: "text-sm",
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  rounded = false,
  className,
  ...props
}) => {
  return (
    <View
      className={cn(
        "border items-center justify-center",
        variantStyles[variant],
        sizeStyles[size].container,
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      <Text
        className={cn(
          "font-semibold",
          textVariantStyles[variant],
          sizeStyles[size].text
        )}
      >
        {children}
      </Text>
    </View>
  );
};
