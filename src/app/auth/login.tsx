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

import { Screen } from "@/components/layout/Screen";
import { EnhancedInput } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

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
      <Screen scrollable edges={["bottom"]}>
        <View className="pt-16">
          <Pressable
            onPress={() => router?.push("/")}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/80"
          >
            <Feather name="arrow-left" size={20} color="#334155" />
          </Pressable>
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Join KachaBazar
          </Text>
          <Text className="mt-2 font-display text-3xl text-slate-900">
            Login to your account
          </Text>
          {/* <Text className="mt-4 text-sm text-slate-500">
            Verify your email to activate the account. We’ll send a secure link
            to continue.
          </Text> */}

          <View className="bg-white/96 px-4 py-6 shadow-[0_18px_48px_rgba(15,118,110,0.15)]">
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
                <Text className="ml-2 flex-1 text-sm text-red-600">
                  {error}
                </Text>
              </View>
            ) : null}
            <Button
              title={isSubmitting ? "Signing in..." : "Sign in"}
              onPress={() => handleSubmit(onSubmit)()}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="teal"
            />
            <Button
              title="Create an account"
              variant="outline"
              onPress={() => router.push("/auth/register")}
            />
            <Button
              title="Forgot password?"
              variant="outline"
              onPress={() => router.push("/auth/reset")}
            />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
