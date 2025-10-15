import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
      <Screen innerClassName="px-0" scrollable>
        <View className="px-6 pt-32">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <Feather name="arrow-left" size={20} color="#334155" />
          </Pressable>

          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Welcome back
          </Text>
          <Text className="mt-2 font-display text-3xl text-slate-900">
            Log in to continue shopping
          </Text>
          <Text className="mt-4 text-sm text-slate-500">
            Access personalised recommendations, saved carts, and faster
            checkout.
          </Text>

          <View className="mt-8 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.1)]">
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  leftIcon="mail"
                  containerClassName="mb-5"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  leftIcon="lock"
                  containerClassName="mb-5"
                  required
                />
              )}
            />
            {error ? (
              <View className="mb-4 rounded-xl bg-red-50 p-3 flex-row items-center">
                <Feather name="alert-triangle" size={18} color="#ef4444" />
                <Text className="ml-2 text-sm text-red-600 flex-1">
                  {error}
                </Text>
              </View>
            ) : null}
            <Button
              title={isSubmitting ? "Signing in..." : "Sign in"}
              className="mt-2"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
            <Button
              title="Create an account"
              variant="ghost"
              className="mt-3"
              onPress={() => router.push("/auth/register")}
            />
            <Button
              title="Forgot password"
              variant="ghost"
              className="mt-2"
              onPress={() => router.push("/auth/reset")}
            />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
