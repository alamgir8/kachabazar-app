import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";

interface ProfileFormValues {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name ?? "");
      setValue("email", user.email ?? "");
      setValue("phone", user.phone ?? "");
      setValue("address", user.address ?? "");
      setValue("city", user.city ?? "");
      setValue("country", user.country ?? "");
    }
  }, [user, setValue]);

  const onSubmit = async (values: ProfileFormValues) => {
    setStatus(null);
    setError(null);
    try {
      await updateProfile(values);
      setStatus("Profile updated successfully.");
    } catch (err) {
      setError((err as Error).message ?? "Failed to update profile.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      className="flex-1"
    >
      <Screen edges={["bottom"]} scrollable>
        <View className="px-1">
          <BackButton subTitle="Profile" subDescription="Update your details" />
          <View className="h-5" />

          <View className="mt-8 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.1)]">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Full name"
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
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Phone"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { value, onChange } }) => (
                <Field label="Address" value={value} onChangeText={onChange} />
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field: { value, onChange } }) => (
                <Field label="City" value={value} onChangeText={onChange} />
              )}
            />
            <Controller
              control={control}
              name="country"
              render={({ field: { value, onChange } }) => (
                <Field label="Country" value={value} onChangeText={onChange} />
              )}
            />

            {status ? (
              <Text className="text-sm text-primary-600">{status}</Text>
            ) : null}
            {error ? (
              <Text className="text-sm text-rose-500">{error}</Text>
            ) : null}

            <Button
              variant="primary"
              title={isSubmitting ? "Saving..." : "Save changes"}
              className="mt-6"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
            <Button
              title="Back to profile"
              variant="outline"
              className="mt-3"
              onPress={() => router.back()}
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
