import { ActivityIndicator, Pressable, Text, View } from "react-native";
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
    paddingHorizontal: 16,
    height: 40,
    fontSize: 14,
  },
  md: {
    paddingHorizontal: 24,
    height: 48,
    fontSize: 15,
  },
  lg: {
    paddingHorizontal: 28,
    height: 56,
    fontSize: 16,
  },
} satisfies Record<
  ButtonSize,
  { paddingHorizontal: number; height: number; fontSize: number }
>;

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
    <View className="flex-row items-center justify-center gap-2">
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
            style={{ fontSize: sizeStyles[size].fontSize }}
            className={cn(
              "font-semibold",
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
            className={cn(
              "items-center justify-center",
              contentClassName,
              pressed && !isDisabled && "opacity-90"
            )}
            style={{
              height: sizeStyles[size].height,
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
              borderRadius: 16,
              shadowColor: "#15803d",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
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
            className={cn(
              "items-center justify-center",
              contentClassName,
              pressed && !isDisabled && "opacity-90"
            )}
            style={{
              height: sizeStyles[size].height,
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
              borderRadius: 16,
              shadowColor: "#334155",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
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
        style={{
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          borderRadius: 16,
        }}
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
            className={cn(
              "items-center justify-center",
              contentClassName,
              pressed && !isDisabled && "opacity-90"
            )}
            style={{
              height: sizeStyles[size].height,
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
              borderRadius: 16,
              shadowColor: "#15803d",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
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
        style={{
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          borderRadius: 16,
          shadowColor: "#dc2626",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
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
      style={{
        height: sizeStyles[size].height,
        paddingHorizontal: sizeStyles[size].paddingHorizontal,
        borderRadius: 16,
      }}
      disabled={isDisabled}
      {...props}
    >
      {getButtonContent()}
    </Pressable>
  );
};
