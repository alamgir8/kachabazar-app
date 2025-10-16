import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton, EnhancedInput } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await login(values);
      router.replace("/(tabs)");
    } catch (err) {
      setError((err as Error).message || "Unable to login. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      className="flex-1"
    >
      <Screen
        scrollable
        edges={["bottom"]}
        contentContainerClassName="gap-8 pb-20"
      >
        <Pressable
          onPress={() => router?.push("/")}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/80"
        >
          <Feather name="arrow-left" size={20} color="#334155" />
        </Pressable>

        <LinearGradient
          colors={["#0f172a", "#22c55e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          className="overflow-hidden rounded-[40px] border border-white/40"
          style={{
            shadowColor: "rgba(15, 23, 42, 0.4)",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.3,
            shadowRadius: 30,
            elevation: 16,
          }}
        >
          <View className="h-56 w-full overflow-hidden rounded-[40px] bg-black/30">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1600172454520-134107252370?auto=format&fit=crop&w=900&q=80",
              }}
              className="h-full w-full opacity-90"
              resizeMode="cover"
            />
          </View>
          <View className="px-6 py-6">
            <Text className="text-[13px] font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Welcome back
            </Text>
            <Text className="mt-2 font-display text-[32px] font-extrabold text-white">
              Sign in to your market
            </Text>
            <Text className="mt-3 text-[13px] text-emerald-100/90">
              Track your orders, access saved carts, and enjoy personalised
              recommendations.
            </Text>
          </View>
        </LinearGradient>

        <View className="rounded-[36px] border border-white/70 bg-white/96 px-4 py-6 shadow-[0_18px_48px_rgba(15,118,110,0.15)]">
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field: { value, onChange } }) => (
              <EnhancedInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                leftIcon="mail"
                containerClassName="mb-5"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field: { value, onChange } }) => (
              <EnhancedInput
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                leftIcon="lock"
                containerClassName="mb-5"
              />
            )}
          />
          {error ? (
            <View className="mb-4 flex-row items-center rounded-2xl border border-red-100 bg-red-50/80 px-3 py-3">
              <Feather name="alert-triangle" size={18} color="#ef4444" />
              <Text className="ml-2 flex-1 text-sm text-red-600">{error}</Text>
            </View>
          ) : null}
          <EnhancedButton
            title={isSubmitting ? "Signing in..." : "Sign in"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            loading={isSubmitting}
            size="lg"
            className="rounded-full"
          />
          <EnhancedButton
            title="Create an account"
            variant="outline"
            size="lg"
            className="mt-6 rounded-full"
            onPress={() => router.push("/auth/register")}
          />
          <EnhancedButton
            title="Forgot password?"
            variant="ghost"
            size="lg"
            className="mt-2 rounded-full"
            onPress={() => router.push("/auth/reset")}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
