import React, { useState } from "react";
import { View, TextInput, Text, Pressable, TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { cn } from "@/utils/cn";

export interface EnhancedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  required?: boolean;
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
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = secureTextEntry;

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-sm font-semibold text-neutral-700 mb-2">
            {label}
            {required && <Text className="text-error"> *</Text>}
          </Text>
        )}

        <View
          className={cn(
            "flex-row items-center bg-neutral-50 rounded-xl border px-4 py-3",
            isFocused && !error && "border-primary-500 bg-white",
            error && "border-error bg-error-light/10",
            !error && !isFocused && "border-neutral-200",
            disabled && "bg-neutral-100 opacity-60",
            leftIcon ? "pl-12" : "",
            rightIcon || isPassword ? "pr-12" : ""
          )}
        >
          {leftIcon && <View className="absolute left-4">{leftIcon}</View>}

          <TextInput
            ref={ref}
            className={cn(
              "flex-1 text-base text-neutral-900",
              disabled && "text-neutral-500",
              inputClassName
            )}
            placeholderTextColor="#a3a3a3"
            editable={!disabled}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4"
            >
              {showPassword ? (
                <EyeOff size={20} color="#737373" />
              ) : (
                <Eye size={20} color="#737373" />
              )}
            </Pressable>
          )}

          {rightIcon && !isPassword && (
            <View className="absolute right-4">{rightIcon}</View>
          )}
        </View>

        {(error || helperText) && (
          <Text
            className={cn(
              "text-xs mt-1.5 ml-1",
              error ? "text-error" : "text-neutral-500"
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
  rows?: number;
}

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
  (
    { label, error, helperText, containerClassName, rows = 4, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-sm font-semibold text-neutral-700 mb-2">
            {label}
          </Text>
        )}

        <View
          className={cn(
            "bg-neutral-50 rounded-xl border p-4",
            isFocused && !error && "border-primary-500 bg-white",
            error && "border-error bg-error-light/10",
            !error && !isFocused && "border-neutral-200"
          )}
        >
          <TextInput
            ref={ref}
            className="text-base text-neutral-900"
            placeholderTextColor="#a3a3a3"
            multiline
            numberOfLines={rows}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </View>

        {(error || helperText) && (
          <Text
            className={cn(
              "text-xs mt-1.5 ml-1",
              error ? "text-error" : "text-neutral-500"
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
