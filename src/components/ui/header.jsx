import React from "react";
import { View, Text } from "react-native";

export default function Header() {
  return (
    <View className="w-full h-16 bg-white dark:bg-zinc-900 flex-row items-center justify-between px-4 border-b border-gray-200">
      <Text className="text-xl font-bold text-gray-900 dark:text-white">
        Kachabazar
      </Text>
      {/* Add icons or actions here */}
    </View>
  );
}
