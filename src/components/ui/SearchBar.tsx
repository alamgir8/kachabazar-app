import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
  Keyboard,
} from "react-native";

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
        "flex-row items-center rounded-2xl border-2 border-slate-200 bg-white px-4 py-2",
        containerClassName
      )}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Feather name="search" size={22} color="#16a34a" />
      <TextInput
        className={cn(
          "ml-3 flex-1 py-2 font-body text-base text-slate-900",
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
        <Pressable onPress={handleClear} className="p-1">
          <Feather name="x-circle" size={20} color="#94a3b8" />
        </Pressable>
      )}
    </View>
  );
};
