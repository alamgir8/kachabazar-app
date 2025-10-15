import { ActivityIndicator, Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-500",
  secondary: "bg-slate-900",
  ghost: "bg-transparent"
};

const textStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-white",
  ghost: "text-primary-500"
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  loading,
  disabled,
  className,
  ...props
}) => (
  <Pressable
    className={cn(
      "flex-row items-center justify-center rounded-2xl px-6 py-4",
      variantStyles[variant],
      disabled || loading
        ? "opacity-60"
        : "shadow-card shadow-primary-900/5 active:opacity-90",
      variant === "ghost" ? "border border-primary-200" : "",
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <ActivityIndicator color={variant === "ghost" ? theme.colors.primary : "#fff"} />
    ) : (
      <Text
        className={cn(
          "text-center text-base font-semibold uppercase tracking-wider",
          textStyles[variant]
        )}
      >
        {title}
      </Text>
    )}
  </Pressable>
);
