import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const Tags = ({ product }: { product: any }) => {
  return (
    <View className="mb-10 border-t border-slate-100 pt-4">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Tags
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {JSON.parse(product?.tag)?.map((tag: string, idx: number) => (
          <View
            key={idx}
            className="flex-row items-center rounded-lg bg-blue-50 px-3 py-1.5"
          >
            <Feather name="tag" size={12} color="#3b82f6" />
            <Text className="ml-1.5 text-xs font-semibold text-blue-700">
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Tags;
