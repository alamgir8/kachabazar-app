import React from "react";
import { View, Pressable, PressableProps, ViewProps } from "react-native";
import { cn } from "@/utils/cn";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "flat";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

interface CardPressableProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "flat";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

const variantStyles = {
  default: "bg-white border border-neutral-200",
  elevated: "bg-white shadow-md",
  outlined: "bg-transparent border-2 border-neutral-300",
  flat: "bg-neutral-50",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const roundedStyles = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  rounded = "xl",
  className,
  ...props
}) => {
  return (
    <View
      className={cn(
        variantStyles[variant],
        paddingStyles[padding],
        roundedStyles[rounded],
        "overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardPressable: React.FC<CardPressableProps> = ({
  children,
  variant = "default",
  padding = "md",
  rounded = "xl",
  className,
  ...props
}) => {
  return (
    <Pressable
      className={cn(
        variantStyles[variant],
        paddingStyles[padding],
        roundedStyles[rounded],
        "overflow-hidden active:opacity-80",
        className
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export const CardHeader: React.FC<ViewProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <View className={cn("mb-3", className)} {...props}>
      {children}
    </View>
  );
};

export const CardBody: React.FC<ViewProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <View className={cn("", className)} {...props}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<ViewProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <View className={cn("mt-4", className)} {...props}>
      {children}
    </View>
  );
};
