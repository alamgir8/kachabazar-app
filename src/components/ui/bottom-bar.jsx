import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const tabs = [
  { label: "Home" },
  { label: "Search" },
  { label: "Cart" },
  { label: "Account" },
];

export default function BottomBar() {
  return (
    <View className="bg-white dark:bg-zinc-900 flex-row justify-around items-center py-2 border-t border-gray-200">
      {tabs.map((tab, idx) => (
        <TouchableOpacity key={tab.label}>
          <Text className="text-gray-700 dark:text-white">{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
