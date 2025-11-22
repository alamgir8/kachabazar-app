import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  TextInputProps,
  Platform,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
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
          style={[
            {
              borderRadius: 24,
              shadowColor: "rgba(15,118,110,0.2)",
            },
            Platform.select({
              ios: {
                shadowOpacity: 0.25,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 18,
              },
              android: {
                elevation: 6,
              },
            }),
          ]}
        >
          <LinearGradient
            colors={
              error
                ? ["rgba(248,113,113,0.65)", "rgba(248,113,113,0.08)"]
                : isFocused
                  ? ["rgba(34,197,94,0.6)", "rgba(14,165,233,0.15)"]
                  : ["rgba(226,232,240,0.9)", "rgba(248,250,252,0.5)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, padding: 1.2 }}
          >
            <View
              className={cn(
                "flex-row items-center rounded-[22px] bg-white px-4 py-3",
                disabled && "bg-slate-50 opacity-70"
              )}
            >
              {leftIcon && (
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                  {typeof leftIcon === "string" ? (
                    <Feather
                      name={leftIcon as keyof typeof Feather.glyphMap}
                      size={20}
                      color="#6b7280"
                    />
                  ) : (
                    leftIcon
                  )}
                </View>
              )}

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

              {isPassword ? (
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-3 h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 active:bg-slate-100"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#475569" />
                  ) : (
                    <Eye size={20} color="#475569" />
                  )}
                </Pressable>
              ) : (
                rightIcon && <View className="ml-3">{rightIcon}</View>
              )}
            </View>
          </LinearGradient>
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
          style={[
            {
              borderRadius: 24,
              shadowColor: "rgba(15,118,110,0.18)",
            },
            Platform.select({
              ios: {
                shadowOpacity: 0.22,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 18,
              },
              android: { elevation: 5 },
            }),
          ]}
        >
          <LinearGradient
            colors={
              error
                ? ["rgba(248,113,113,0.6)", "rgba(248,113,113,0.08)"]
                : isFocused
                  ? ["rgba(34,197,94,0.45)", "rgba(14,165,233,0.18)"]
                  : ["rgba(226,232,240,0.9)", "rgba(248,250,252,0.5)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, padding: 1.2 }}
          >
            <View className="rounded-[22px] bg-white p-4">
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
          </LinearGradient>
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
