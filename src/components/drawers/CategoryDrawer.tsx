import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Category } from "@/types";
import { getLocalizedValue } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/theme";

interface CategoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (categoryId?: string, categoryName?: string) => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  visible,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Flatten categories if they're nested
  const displayCategories = categories || [];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleSelectCategory = (category?: Category) => {
    if (!category) {
      onSelectCategory(undefined, undefined);
      onClose();
      return;
    }

    onSelectCategory(
      category._id,
      getLocalizedValue(category.name as Record<string, string>)
    );
    onClose();
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const isSelected = selectedCategory === category._id;
    const isExpanded = expandedCategories.has(category._id);
    const hasChildren = category.children && category.children.length > 0;
    const isNested = level > 0;

    return (
      <View key={category._id}>
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={[{ marginLeft: level * 16 }, !isNested && styles.itemDivider]}
        >
          <View className="flex-1 flex-row items-center">
            {hasChildren && (
              <Pressable
                onPress={() => toggleCategory(category._id)}
                className="mr-2 active:opacity-70"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={isExpanded ? "chevron-down" : "chevron-right"}
                  size={18}
                  color={isSelected ? theme.colors.primary[600] : "#64748b"}
                />
              </Pressable>
            )}
            <Pressable
              onPress={() => handleSelectCategory(category)}
              className="flex-1 flex-row items-center active:opacity-70"
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-xl ${
                  isSelected ? "bg-primary-100" : "bg-primary-50"
                }`}
              >
                <Feather
                  name="folder"
                  size={18}
                  color={
                    isSelected
                      ? theme.colors.primary[600]
                      : theme.colors.primary[500]
                  }
                />
              </View>
              <Text
                className={`ml-3 flex-1 text-[15px] ${
                  isSelected
                    ? "font-semibold text-slate-900"
                    : "font-medium text-slate-700"
                }`}
                numberOfLines={2}
              >
                {getLocalizedValue(category.name as Record<string, string>)}
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center gap-2">
            {hasChildren && !isSelected && (
              <View className="mr-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-200 px-1.5">
                <Text className="text-[11px] font-bold text-slate-600">
                  {category.children?.length}
                </Text>
              </View>
            )}
            {isSelected && (
              <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-500">
                <Feather name="check" size={12} color="#fff" />
              </View>
            )}
          </View>
        </View>

        {hasChildren && isExpanded && (
          <View className="bg-slate-50/50">
            {category.children?.map((child) =>
              renderCategory(child, level + 1)
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />

        <View
          className="max-h-[90%] rounded-t-[32px]"
          style={{ backgroundColor: "#f8fafb" }}
        >
          {/* Header */}
          <LinearGradient
            colors={["#10b981", "#0ea5e9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 20,
            }}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  FILTER
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-white">
                  Categories
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-lg bg-white/15 active:bg-white/25"
              >
                <Feather name="x" size={20} color="#fff" />
              </Pressable>
            </View>

            {selectedCategory && (
              <Pressable
                onPress={() => handleSelectCategory(undefined)}
                className="inline-flex flex-row items-center self-start rounded-full bg-white/15 px-4 py-2 active:bg-white/25"
              >
                <Feather name="x" size={14} color="#fff" />
                <Text className="ml-2 text-sm font-semibold text-white">
                  Clear filter
                </Text>
              </Pressable>
            )}
          </LinearGradient>

          {/* Categories List */}
          <ScrollView
            // className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 24,
              paddingHorizontal: 10,
              paddingTop: 24,
            }}
          >
            {/* All Categories Section */}
            <View className="mb-6">
              <View style={styles.sectionCard}>
                <Pressable
                  onPress={() => handleSelectCategory(undefined)}
                  className="active:bg-slate-50"
                >
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <View className="flex-row items-center">
                      <View
                        className={`h-9 w-9 items-center justify-center rounded-xl ${
                          !selectedCategory ? "bg-primary-100" : "bg-primary-50"
                        }`}
                      >
                        <Feather
                          name="grid"
                          size={18}
                          color={
                            theme.colors.primary[!selectedCategory ? 600 : 500]
                          }
                        />
                      </View>
                      <Text
                        className={`ml-3 text-[15px] ${
                          !selectedCategory
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-700"
                        }`}
                      >
                        All Categories
                      </Text>
                    </View>
                    {!selectedCategory && (
                      <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-500">
                        <Feather name="check" size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Category Tree */}
            {displayCategories.length > 0 && (
              <View className="mb-6">
                <Text className="mb-3 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Browse Categories
                </Text>
                <View style={styles.sectionCard}>
                  {displayCategories.map((category, index) => (
                    <React.Fragment key={category._id}>
                      {renderCategory(category, 0)}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}

            {/* Empty State */}
            {displayCategories.length === 0 && (
              <View className="items-center py-10">
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Feather name="folder" size={28} color="#94a3b8" />
                </View>
                <Text className="text-center text-sm text-slate-500">
                  No categories available right now.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(22, 163, 74, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    overflow: "hidden",
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(148, 163, 184, 0.25)",
  },
});
