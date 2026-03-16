import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

/**
 * Parse product tags from any format the API might return:
 *  - `'["a","b"]'`           → string that is a JSON array
 *  - `['["a","b"]']`         → array with one stringified-array element
 *  - `["a","b"]`             → plain array of strings
 */
const parseTags = (raw: unknown): string[] => {
  if (!raw) return [];

  // If it's a plain string, try JSON.parse first
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Recursively flatten in case of nested stringified arrays
        return parsed.flatMap((item: unknown) => parseTags(item));
      }
      // Single value
      return parsed ? [String(parsed)] : [];
    } catch {
      // Not JSON – treat as a single tag
      return raw.trim() ? [raw.trim()] : [];
    }
  }

  if (Array.isArray(raw)) {
    return raw.flatMap((item: unknown) => parseTags(item));
  }

  return [];
};

const Tags = ({ product }: { product: any }) => {
  const tags = parseTags(product?.tag).filter(Boolean);

  if (tags.length === 0) return null;

  return (
    <View className="mt-4">
      <Text className="mb-2.5 text-xs font-bold uppercase tracking-widest text-slate-400">
        Tags
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag: string, idx: number) => (
          <View
            key={idx}
            className="flex-row items-center rounded-full bg-slate-100 px-3.5 py-2"
          >
            <Feather name="hash" size={11} color="#64748b" />
            <Text className="ml-1 text-xs font-semibold text-slate-600">
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Tags;
