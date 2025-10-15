import { useState } from "react";
import { View, Text, TextInput, TextInputProps, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { cn } from "@/utils/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ComponentProps<typeof Feather>["name"];
  rightIcon?: React.ComponentProps<typeof Feather>["name"];
  onRightIconPress?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerClassName,
  inputClassName,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("w-full", containerClassName)}>
      {label && (
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <View
        className={cn(
          "flex-row items-center rounded-2xl border-2 bg-white px-4 py-1",
          isFocused
            ? "border-primary-500"
            : error
              ? "border-red-500"
              : "border-slate-200",
          props.editable === false && "bg-slate-50"
        )}
        style={{
          shadowColor: isFocused ? "#22c55e" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isFocused ? 0.1 : 0.05,
          shadowRadius: 4,
          elevation: isFocused ? 3 : 1,
        }}
      >
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={20}
            color={isFocused ? "#22c55e" : "#94a3b8"}
            style={{ marginRight: 12 }}
          />
        )}

        <TextInput
          className={cn("flex-1 py-3 text-base text-slate-900", inputClassName)}
          placeholderTextColor="#94a3b8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            className="ml-2 p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={rightIcon}
              size={20}
              color={isFocused ? "#22c55e" : "#94a3b8"}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <View className="mt-2 flex-row items-center">
          <Feather name="alert-circle" size={14} color="#ef4444" />
          <Text className="ml-1.5 text-sm text-red-500">{error}</Text>
        </View>
      )}

      {helperText && !error && (
        <Text className="mt-2 text-sm text-slate-500">{helperText}</Text>
      )}
    </View>
  );
};
