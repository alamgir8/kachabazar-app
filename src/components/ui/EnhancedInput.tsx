import React, { useState } from "react";
import { View, TextInput, Text, Pressable, TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { cn } from "@/utils/cn";
import { Feather } from "@expo/vector-icons";

export interface EnhancedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: "outlined" | "filled" | "underlined";
  size?: "sm" | "md" | "lg";
  onClear?: () => void;
  showClearButton?: boolean;
}

export const EnhancedInput = React.forwardRef<TextInput, EnhancedInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      inputClassName,
      disabled,
      required,
      secureTextEntry,
      variant = "outlined",
      size = "md",
      onClear,
      showClearButton = false,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = secureTextEntry;
    const showClear = showClearButton && value && !isPassword;

    // Size configurations
    const sizeConfig = {
      sm: { height: 40, fontSize: 14, iconSize: 18, px: 3 },
      md: { height: 48, fontSize: 16, iconSize: 20, px: 4 },
      lg: { height: 56, fontSize: 18, iconSize: 22, px: 5 },
    };

    const config = sizeConfig[size];

    // Variant styles
    const getVariantStyles = () => {
      const baseStyles = "flex-row items-center";

      if (variant === "filled") {
        return cn(
          baseStyles,
          "bg-slate-100 rounded-2xl",
          isFocused && "bg-slate-200",
          error && "bg-red-50",
          disabled && "bg-slate-50 opacity-60"
        );
      }

      if (variant === "underlined") {
        return cn(
          baseStyles,
          "border-b border-slate-300",
          isFocused && "border-emerald-500",
          error && "border-red-500",
          disabled && "border-slate-200 opacity-60"
        );
      }

      // outlined (default)
      return cn(
        baseStyles,
        "border border-slate-300 rounded-2xl bg-white",
        isFocused && "border-emerald-500",
        error && "border-red-500",
        disabled && "border-slate-200 bg-slate-50 opacity-60"
      );
    };

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
        )}

        <View
          className={getVariantStyles()}
          style={{ height: config.height, paddingHorizontal: config.px * 4 }}
        >
          {leftIcon && (
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              {typeof leftIcon === "string" ? (
                <Feather
                  name={leftIcon as keyof typeof Feather.glyphMap}
                  size={config.iconSize}
                  color="#64748b"
                />
              ) : (
                leftIcon
              )}
            </View>
          )}

          <TextInput
            ref={ref}
            className={cn(
              "flex-1 text-slate-900",
              disabled && "text-slate-500",
              inputClassName
            )}
            style={{ fontSize: config.fontSize }}
            placeholderTextColor="#94a3b8"
            editable={!disabled}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            {...props}
          />

          {showClear && (
            <Pressable
              onPress={onClear}
              className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
            >
              <Feather name="x" size={16} color="#64748b" />
            </Pressable>
          )}

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2 h-9 w-9 items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200"
            >
              {showPassword ? (
                <EyeOff size={config.iconSize} color="#64748b" />
              ) : (
                <Eye size={config.iconSize} color="#64748b" />
              )}
            </Pressable>
          )}

          {!isPassword && !showClear && rightIcon && (
            <View className="ml-2">{rightIcon}</View>
          )}
        </View>

        {(error || helperText) && (
          <Text
            className={cn(
              "ml-1 mt-1.5 text-xs",
              error ? "text-red-500" : "text-slate-500"
            )}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  inputClassName?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  variant?: "outlined" | "filled";
}

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      inputClassName,
      rows = 4,
      required,
      disabled,
      variant = "outlined",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const getVariantStyles = () => {
      if (variant === "filled") {
        return cn(
          "rounded-2xl bg-slate-100 p-4",
          isFocused && "bg-slate-200",
          error && "bg-red-50",
          disabled && "bg-slate-50 opacity-60"
        );
      }

      return cn(
        "rounded-2xl border-2 border-slate-300 bg-white p-4",
        isFocused && "border-emerald-500",
        error && "border-red-500",
        disabled && "border-slate-200 bg-slate-50 opacity-60"
      );
    };

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
        )}

        <View className={getVariantStyles()}>
          <TextInput
            ref={ref}
            className={cn(
              "text-base text-slate-900",
              disabled && "text-slate-500",
              inputClassName
            )}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={rows}
            textAlignVertical="top"
            editable={!disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ minHeight: rows * 24 }}
            {...props}
          />
        </View>

        {(error || helperText) && (
          <Text
            className={cn(
              "ml-1 mt-1.5 text-xs",
              error ? "text-red-500" : "text-slate-500"
            )}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

TextArea.displayName = "TextArea";
