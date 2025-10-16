import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import type { PressableProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/theme";
import { cn } from "@/utils/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  contentClassName?: string;
}

const sizeStyles = {
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
    paddingHorizontal: 28,
  },
} as const;

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  fullWidth,
  icon,
  iconPosition = "left",
  className,
  contentClassName,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonContent = () => (
    <View
      className={cn(
        "flex-row items-center justify-center gap-2",
        contentClassName
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost"
              ? theme.colors.primary[600]
              : theme.colors.text.inverse
          }
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text
            className={cn(
              "font-semibold",
              size === "sm" && "text-sm",
              size === "md" && "text-[15px]",
              size === "lg" && "text-base",
              variant === "primary" && "text-white",
              variant === "secondary" && "text-white",
              variant === "outline" && "text-primary-600",
              variant === "ghost" && "text-slate-700",
              variant === "success" && "text-white",
              variant === "danger" && "text-white"
            )}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </View>
  );

  if (variant === "primary") {
    return (
      <Pressable
        className={cn(
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={["#22c55e", "#16a34a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              sizeStyles[size],
              { opacity: pressed && !isDisabled ? 0.9 : 1 },
            ]}
            className="items-center justify-center"
          >
            {getButtonContent()}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  if (variant === "secondary") {
    return (
      <Pressable
        className={cn(
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={["#64748b", "#475569"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              sizeStyles[size],
              { opacity: pressed && !isDisabled ? 0.9 : 1 },
            ]}
            className="items-center justify-center"
          >
            {getButtonContent()}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  if (variant === "outline") {
    return (
      <Pressable
        className={cn(
          "border-2 border-primary-500 bg-white items-center justify-center",
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          !isDisabled && "active:bg-primary-50",
          className
        )}
        style={[styles.button, sizeStyles[size]]}
        disabled={isDisabled}
        {...props}
      >
        {getButtonContent()}
      </Pressable>
    );
  }

  if (variant === "success") {
    return (
      <Pressable
        className={cn(
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={["#22c55e", "#16a34a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              sizeStyles[size],
              { opacity: pressed && !isDisabled ? 0.9 : 1 },
            ]}
            className="items-center justify-center"
          >
            {getButtonContent()}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  if (variant === "danger") {
    return (
      <Pressable
        className={cn(
          "bg-red-600 items-center justify-center",
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          !isDisabled && "active:bg-red-700",
          className
        )}
        style={[styles.button, sizeStyles[size]]}
        disabled={isDisabled}
        {...props}
      >
        {getButtonContent()}
      </Pressable>
    );
  }

  // Ghost variant
  return (
    <Pressable
      className={cn(
        "bg-transparent items-center justify-center",
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        !isDisabled && "active:bg-slate-100",
        className
      )}
      style={[styles.button, sizeStyles[size]]}
      disabled={isDisabled}
      {...props}
    >
      {getButtonContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
});
