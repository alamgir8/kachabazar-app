import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
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
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: ""
    }
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
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Welcome back
          </Text>
          <Text className="mt-2 font-display text-3xl text-slate-900">
            Log in to continue shopping
          </Text>
          <Text className="mt-4 text-sm text-slate-500">
            Access personalised recommendations, saved carts, and faster checkout.
          </Text>

          <View className="mt-8 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.1)]">
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />
            {error ? (
              <Text className="text-sm text-rose-500">{error}</Text>
            ) : null}
            <Button
              title={isSubmitting ? "Signing in..." : "Sign in"}
              className="mt-6"
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

const Field: React.FC<
  {
    label: string;
    error?: string;
  } & React.ComponentProps<typeof TextInput>
> = ({ label, error, className, ...props }) => (
  <View className="mb-5">
    <Text className="mb-2 text-xs font-semibold uppercase text-slate-500">
      {label}
    </Text>
    <TextInput
      className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 shadow-[0_10px_30px_rgba(15,118,110,0.08)] ${
        className ?? ""
      }`}
      placeholderTextColor="#94a3b8"
      {...props}
    />
    {error ? <Text className="mt-1 text-xs text-rose-500">{error}</Text> : null}
  </View>
);
