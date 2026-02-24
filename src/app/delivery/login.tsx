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
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDeliveryAuth } from "@/contexts/DeliveryAuthContext";
import { useAppMode } from "@/contexts/AppModeContext";
import { DELIVERY_COLORS } from "@/constants/deliveryTheme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DeliveryLoginScreen() {
  const router = useRouter();
  const { login } = useDeliveryAuth();
  const { setMode } = useAppMode();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header Gradient - Full Width */}
          <LinearGradient
            colors={DELIVERY_COLORS.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: insets.top + 40,
              paddingBottom: 48,
              paddingHorizontal: 24,
              alignItems: "center",
              borderBottomLeftRadius: 36,
              borderBottomRightRadius: 36,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons
                name="bike-fast"
                size={40}
                color="white"
              />
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "white",
                textAlign: "center",
              }}
            >
              Delivery Partner
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Sign in to manage your deliveries
            </Text>
          </LinearGradient>

          {/* Form Card */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 40,
            }}
          >
            {error && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fef2f2",
                  borderWidth: 1,
                  borderColor: "#fecaca",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginBottom: 20,
                }}
              >
                <Feather name="alert-circle" size={18} color="#ef4444" />
                <Text
                  style={{
                    marginLeft: 10,
                    flex: 1,
                    fontSize: 13,
                    color: "#b91c1c",
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Email */}
            <View style={{ marginBottom: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  backgroundColor: "#f8fafc",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <Feather name="mail" size={18} color="#94a3b8" />
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 15,
                    color: "#0f172a",
                  }}
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
            <View style={{ marginBottom: 28 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  backgroundColor: "#f8fafc",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <Feather name="lock" size={18} color="#94a3b8" />
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 15,
                    color: "#0f172a",
                  }}
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
                    color="#94a3b8"
                  />
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={{ borderRadius: 16, overflow: "hidden" }}
            >
              <LinearGradient
                colors={
                  loading
                    ? [DELIVERY_COLORS.loadingBg, DELIVERY_COLORS.loadingBg]
                    : (DELIVERY_COLORS.gradientHorizontal)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderRadius: 16,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "white",
                        marginRight: 8,
                      }}
                    >
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
              style={{
                marginTop: 32,
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontSize: 13, color: "#64748b" }}>
                Not a delivery partner?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#0d9488",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Go to Store →
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
