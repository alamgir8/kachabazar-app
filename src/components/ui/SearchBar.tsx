import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
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

  const hasValue = value.length > 0;

  const containerShadow = useMemo(
    () => ({
      shadowColor: "rgba(34,197,94,0.22)",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.15,
      shadowRadius: 28,
      elevation: 14,
    }),
    []
  );

  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.9)", "rgba(240,253,244,0.92)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={cn(
        "rounded-3xl border border-white/70 bg-white/80",
        containerClassName
      )}
      style={containerShadow}
    >
      <View className="flex-row items-center px-4 py-3">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-emerald-100/80">
          <Feather name="search" size={20} color="#059669" />
        </View>
        <TextInput
          className={cn(
            "ml-3 flex-1 text-[15px] font-semibold text-slate-900",
            className
          )}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          {...props}
        />
        {hasValue ? (
          <Pressable
            onPress={handleClear}
            className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
          >
            <Feather name="x" size={16} color="#64748b" />
          </Pressable>
        ) : (
          <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-white/60">
            <Feather name="mic" size={18} color="#94a3b8" />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};
