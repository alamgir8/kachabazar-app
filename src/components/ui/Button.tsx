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
}

const sizeStyles = {
  sm: {
    container: "px-4 py-2.5 rounded-xl",
    text: "text-sm",
  },
  md: {
    container: "px-6 py-3.5 rounded-2xl",
    text: "text-base",
  },
  lg: {
    container: "px-8 py-4 rounded-2xl",
    text: "text-lg",
  },
};

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
            className={cn(
              "font-semibold",
              sizeStyles[size].text,
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
          sizeStyles[size].container,
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={[theme.colors.primary[500], theme.colors.accent[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={cn(
              "items-center justify-center rounded-2xl",
              sizeStyles[size].container,
              pressed && !isDisabled && "opacity-90"
            )}
            style={{
              shadowColor: theme.colors.primary[700],
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.32,
              shadowRadius: 12,
              elevation: 10,
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
          "bg-slate-800",
          sizeStyles[size].container,
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          !isDisabled && "active:opacity-90",
          className
        )}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        disabled={isDisabled}
        {...props}
      >
        {getButtonContent()}
      </Pressable>
    );
  }

  if (variant === "outline") {
    return (
      <Pressable
        className={cn(
          "border-2 border-primary-300 bg-white",
          sizeStyles[size].container,
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          !isDisabled && "active:bg-primary-50",
          className
        )}
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
          "bg-primary-600",
          sizeStyles[size].container,
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          !isDisabled && "active:bg-primary-700",
          className
        )}
        style={{
          shadowColor: theme.colors.primary[700],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        disabled={isDisabled}
        {...props}
      >
        {getButtonContent()}
      </Pressable>
    );
  }

  if (variant === "danger") {
    return (
      <Pressable
        className={cn(
          "bg-red-600",
          sizeStyles[size].container,
          fullWidth && "w-full",
          isDisabled && "opacity-50",
          !isDisabled && "active:bg-red-700",
          className
        )}
        style={{
          shadowColor: "#dc2626",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
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
        "bg-transparent",
        sizeStyles[size].container,
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        !isDisabled && "active:bg-slate-100",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {getButtonContent()}
    </Pressable>
  );
};
