import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { useDeliveryAuth } from "@/contexts/DeliveryAuthContext";
import { useAppMode } from "@/contexts/AppModeContext";

export default function DeliveryLoginScreen() {
  const router = useRouter();
  const { login } = useDeliveryAuth();
  const { setMode } = useAppMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/delivery/(tabs)");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      className="flex-1"
    >
      <Screen scrollable edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <LinearGradient
            colors={["#ea580c", "#f97316", "#fb923c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mx-[-16px] mt-[-16px] px-6 pt-12 pb-10 items-center"
            style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
          >
            <View className="h-20 w-20 rounded-full bg-white/20 items-center justify-center mb-4">
              <MaterialCommunityIcons
                name="bike-fast"
                size={40}
                color="white"
              />
            </View>
            <Text className="text-2xl font-bold text-white">
              Delivery Partner
            </Text>
            <Text className="text-sm text-white/80 mt-1">
              Sign in to manage your deliveries
            </Text>
          </LinearGradient>

          {/* Form */}
          <View className="mt-8 px-1">
            {error && (
              <View className="mb-4 flex-row items-center rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
                <Feather name="alert-circle" size={18} color="#ef4444" />
                <Text className="ml-2 flex-1 text-sm text-red-700">
                  {error}
                </Text>
              </View>
            )}

            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Feather name="mail" size={18} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900"
                  placeholder="your@email.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Password
              </Text>
              <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Feather name="lock" size={18} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900"
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={
                  loading ? ["#fdba74", "#fdba74"] : ["#ea580c", "#f97316"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 items-center justify-center flex-row"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text className="text-base font-bold text-white mr-2">
                      Sign In
                    </Text>
                    <Feather name="arrow-right" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Switch to store */}
            <Pressable
              onPress={() => setMode("store")}
              className="mt-8 items-center py-3"
            >
              <Text className="text-sm text-slate-500">
                Not a delivery partner?{" "}
                <Text className="text-teal-600 font-semibold">
                  Go to Store →
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}
