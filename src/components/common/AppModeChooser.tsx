import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAppMode, type AppMode } from "@/contexts/AppModeContext";

const { width } = Dimensions.get("window");

export default function AppModeChooser() {
  const { isFirstLaunch, setMode } = useAppMode();
  const [visible, setVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState<AppMode | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleStore = useRef(new Animated.Value(1)).current;
  const scaleDelivery = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFirstLaunch) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFirstLaunch]);

  const handleSelect = async (mode: AppMode) => {
    setSelectedMode(mode);

    // Animate selection
    const scaleRef = mode === "store" ? scaleStore : scaleDelivery;
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRef, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Delay to show selection state
    setTimeout(async () => {
      await setMode(mode);
      // Animate out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 400);
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View
        className="flex-1 justify-center items-center px-6"
        style={{ opacity: fadeAnim, backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Animated.View
          className="w-full max-w-sm rounded-3xl bg-white overflow-hidden"
          style={{
            transform: [{ translateY: slideAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.15,
            shadowRadius: 25,
            elevation: 20,
          }}
        >
          {/* Header */}
          <LinearGradient
            colors={["#0f766e", "#0d9488", "#14b8a6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 pt-8 pb-6 items-center"
          >
            <View className="h-16 w-16 rounded-full bg-white/20 items-center justify-center mb-4">
              <MaterialCommunityIcons
                name="swap-horizontal-bold"
                size={32}
                color="white"
              />
            </View>
            <Text className="text-xl font-bold text-white text-center">
              Welcome to KachaBazar
            </Text>
            <Text className="text-sm text-white/80 text-center mt-2">
              How would you like to use this app?
            </Text>
          </LinearGradient>

          {/* Options */}
          <View className="p-5 gap-3">
            {/* Store Mode */}
            <Animated.View style={{ transform: [{ scale: scaleStore }] }}>
              <Pressable
                onPress={() => handleSelect("store")}
                className={`flex-row items-center rounded-2xl border-2 p-4 ${
                  selectedMode === "store"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-white"
                }`}
                style={{
                  shadowColor: selectedMode === "store" ? "#0d9488" : "#94a3b8",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedMode === "store" ? 0.15 : 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View
                  className={`h-12 w-12 rounded-2xl items-center justify-center ${
                    selectedMode === "store" ? "bg-teal-500" : "bg-teal-100"
                  }`}
                >
                  <Feather
                    name="shopping-bag"
                    size={22}
                    color={selectedMode === "store" ? "#fff" : "#0d9488"}
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text
                    className={`text-base font-bold ${
                      selectedMode === "store"
                        ? "text-teal-800"
                        : "text-slate-800"
                    }`}
                  >
                    Shopping Store
                  </Text>
                  <Text className="text-xs text-slate-500 mt-0.5">
                    Browse products, place orders & track deliveries
                  </Text>
                </View>
                {selectedMode === "store" && (
                  <View className="h-6 w-6 rounded-full bg-teal-500 items-center justify-center">
                    <Feather name="check" size={14} color="#fff" />
                  </View>
                )}
              </Pressable>
            </Animated.View>

            {/* Delivery Mode */}
            <Animated.View style={{ transform: [{ scale: scaleDelivery }] }}>
              <Pressable
                onPress={() => handleSelect("delivery")}
                className={`flex-row items-center rounded-2xl border-2 p-4 ${
                  selectedMode === "delivery"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 bg-white"
                }`}
                style={{
                  shadowColor:
                    selectedMode === "delivery" ? "#f97316" : "#94a3b8",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedMode === "delivery" ? 0.15 : 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View
                  className={`h-12 w-12 rounded-2xl items-center justify-center ${
                    selectedMode === "delivery"
                      ? "bg-orange-500"
                      : "bg-orange-100"
                  }`}
                >
                  <MaterialCommunityIcons
                    name="bike-fast"
                    size={24}
                    color={selectedMode === "delivery" ? "#fff" : "#ea580c"}
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text
                    className={`text-base font-bold ${
                      selectedMode === "delivery"
                        ? "text-orange-800"
                        : "text-slate-800"
                    }`}
                  >
                    Delivery Partner
                  </Text>
                  <Text className="text-xs text-slate-500 mt-0.5">
                    Manage deliveries, update orders & track earnings
                  </Text>
                </View>
                {selectedMode === "delivery" && (
                  <View className="h-6 w-6 rounded-full bg-orange-500 items-center justify-center">
                    <Feather name="check" size={14} color="#fff" />
                  </View>
                )}
              </Pressable>
            </Animated.View>

            {/* Hint */}
            <Text className="text-center text-[11px] text-slate-400 mt-1 px-2">
              You can switch between modes anytime from Settings
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
