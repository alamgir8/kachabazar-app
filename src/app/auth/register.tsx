import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestEmailVerification } from "@/services/auth";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setResponseMessage(null);
    try {
      const res = await requestEmailVerification(values);
      setResponseMessage(
        res.message ?? "Please verify your email to continue."
      );
    } catch (err) {
      setError((err as Error).message ?? "Failed to start registration.");
    }
  };

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
            Join KachaBazar
          </Text>
          <Text className="mt-2 font-display text-3xl text-slate-900">
            Create a new account
          </Text>
          <Text className="mt-4 text-sm text-slate-500">
            Verify your email to activate the account. We’ll send a secure link
            to continue.
          </Text>

          <View className="mt-8 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.1)]">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Full name"
                  placeholder="Jane Doe"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  leftIcon="user"
                  containerClassName="mb-5"
                  required
                />
              )}
            />
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

            {responseMessage ? (
              <View className="mb-4 rounded-xl bg-emerald-50 p-3 flex-row items-center">
                <Feather name="check-circle" size={18} color="#10b981" />
                <Text className="ml-2 text-sm text-emerald-600 flex-1">
                  {responseMessage}
                </Text>
              </View>
            ) : null}
            {error ? (
              <View className="mb-4 rounded-xl bg-red-50 p-3 flex-row items-center">
                <Feather name="alert-triangle" size={18} color="#ef4444" />
                <Text className="ml-2 text-sm text-red-600 flex-1">
                  {error}
                </Text>
              </View>
            ) : null}

            <Button
              title={
                isSubmitting
                  ? "Sending verification..."
                  : "Send verification email"
              }
              className="mt-2"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
            <Button
              title="Back to login"
              variant="ghost"
              className="mt-3"
              onPress={() => router.push("/auth/login")}
            />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
