import { Feather } from "@expo/vector-icons";
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
    <View
      className={cn(
        "rounded-xl bg-white border border-slate-200 shadow-sm",
        containerClassName
      )}
    >
      <View className="flex-row items-center px-3 py-2">
        <Feather name="search" size={20} color="#10b981" />
        <TextInput
          className={cn(
            "ml-3 flex-1 font-medium text-sm text-slate-900 leading-5",
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
            className="ml-2 h-7 w-7 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
          >
            <Feather name="x" size={14} color="#64748b" />
          </Pressable>
        )}
      </View>
    </View>
  );
};
