import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
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
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setResponseMessage(null);
    try {
      const res = await requestEmailVerification(values);
      setResponseMessage(res.message ?? "Please verify your email to continue.");
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
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Join KachaBazar
          </Text>
          <Text className="mt-2 font-display text-3xl text-slate-900">
            Create a new account
          </Text>
          <Text className="mt-4 text-sm text-slate-500">
            Verify your email to activate the account. We’ll send a secure link to continue.
          </Text>

          <View className="mt-8 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.1)]">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Full name"
                  placeholder="Jane Doe"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />
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

            {responseMessage ? (
              <Text className="text-sm text-primary-600">{responseMessage}</Text>
            ) : null}
            {error ? <Text className="text-sm text-rose-500">{error}</Text> : null}

            <Button
              title={isSubmitting ? "Sending verification..." : "Send verification email"}
              className="mt-6"
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
