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

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
      <Feather name="search" size={20} color="#64748b" />
      <TextInput
        className={cn(
          "ml-3 flex-1 text-[15px] text-slate-900 placeholder:tex-base placeholder:font-normal",
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
  );
};
