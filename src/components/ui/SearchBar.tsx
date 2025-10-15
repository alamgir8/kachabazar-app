import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface SearchBarProps
  extends Omit<TextInputProps, "onChangeText" | "value" | "defaultValue"> {
  onSubmitSearch?: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSubmitSearch,
  onClear,
  containerClassName,
  className,
  value: controlledValue,
  defaultValue,
  onChangeText,
  ...props
}) => {
  const isControlled = controlledValue !== undefined;
  const [value, setValue] = useState(controlledValue ?? defaultValue ?? "");

  useEffect(() => {
    if (isControlled) {
      setValue(controlledValue ?? "");
    }
  }, [controlledValue, isControlled]);

  const handleSubmit = () => {
    onSubmitSearch?.(value.trim());
    Keyboard.dismiss();
  };

  const handleClear = () => {
    if (!isControlled) {
      setValue("");
    }
    onClear?.();
    onChangeText?.("");
  };

  const handleChangeText = (text: string) => {
    if (!isControlled) {
      setValue(text);
    }
    onChangeText?.(text);
  };

  return (
    <LinearGradient
      colors={["#eefcf5", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={cn("rounded-[28px]", containerClassName)}
      style={{
        borderWidth: 1,
        borderColor: "rgba(38, 189, 166, 0.18)",
        shadowColor: "rgba(12, 70, 65, 0.18)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <View className="flex-row items-center px-4 py-3">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-white/90">
          <Feather name="search" size={20} color={theme.colors.primary[600]} />
        </View>
        <TextInput
          className={cn(
            "flex-1 py-1 font-body text-base text-slate-900",
            className
          )}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          {...props}
        />
        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            className="ml-2 h-10 w-10 items-center justify-center rounded-2xl bg-white/70 active:opacity-80"
          >
            <Feather name="x" size={18} color="#94a3b8" />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
};
