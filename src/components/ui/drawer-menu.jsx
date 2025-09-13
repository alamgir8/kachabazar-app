import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

const categories = ["Fruits", "Vegetables", "Dairy", "Bakery", "Meat"];
const pages = ["Home", "About Us", "Contact", "FAQ", "Offers"];

export default function DrawerMenu({ onClose }) {
  const [activeTab, setActiveTab] = useState("category");

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 p-4">
      {/* Logo at the top */}
      <View className="items-center mb-6">
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          className="w-20 h-20"
        />
      </View>
      {/* Tabs */}
      <View className="flex-row mb-4 border-b border-gray-200 dark:border-zinc-700">
        <TouchableOpacity
          className={`flex-1 py-2 items-center ${activeTab === "category" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("category")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            Category
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 items-center ${activeTab === "pages" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("pages")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            Pages
          </Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      <ScrollView>
        {activeTab === "category" ? (
          <View>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} className="py-2 px-2">
                <Text className="text-base text-gray-700 dark:text-white">
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            {pages.map((page) => (
              <TouchableOpacity key={page} className="py-2 px-2">
                <Text className="text-base text-gray-700 dark:text-white">
                  {page}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      {/* Close button */}
      <TouchableOpacity className="mt-6 items-center" onPress={onClose}>
        <Text className="text-blue-500 text-lg">Close</Text>
      </TouchableOpacity>
    </View>
  );
}
