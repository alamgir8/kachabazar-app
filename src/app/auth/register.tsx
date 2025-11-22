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
import { BackButton, EnhancedInput } from "@/components/ui";
import { requestEmailVerification } from "@/services/auth";
import Button from "@/components/ui/Button";

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
      <Screen scrollable edges={["bottom"]}>
        <View className="">
          {/* Back Button */}
          <BackButton
            subTitle="Join KachaBazar"
            subDescription="Create a new account"
          />

          <View className="mt-6 rounded-2xl px-1 py-4 shadow-sm">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { value, onChange } }) => (
                <EnhancedInput
                  label="Full name"
                  placeholder="Jane Doe"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  leftIcon="user"
                  containerClassName="mb-5"
                />
              )}
            />
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

            {responseMessage ? (
              <View className="mb-4 rounded-xl bg-emerald-50 p-3 flex-row items-center border border-emerald-100">
                <Feather name="check-circle" size={18} color="#10b981" />
                <Text className="ml-2 text-sm text-emerald-600 flex-1">
                  {responseMessage}
                </Text>
              </View>
            ) : null}
            {error ? (
              <View className="mb-4 rounded-xl bg-red-50 p-3 flex-row items-center border border-red-100">
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
              onPress={() => handleSubmit(onSubmit)()}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="teal"
              className="mt-6"
            />
            <Button
              title="Back to login"
              variant="outline"
              className="mt-6"
              onPress={() => router?.back()}
            />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
