import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

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
  image?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      setValue("image", user.image ?? "");
      setImageUri(user.image ?? null);
    }
  }, [user, setValue]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload images."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];

        // Validate image size (max 5MB)
        if (
          selectedImage.fileSize &&
          selectedImage.fileSize > 5 * 1024 * 1024
        ) {
          Alert.alert("Error", "Image size should be less than 5MB");
          return;
        }

        // Validate image dimensions (optional)
        if (selectedImage.width && selectedImage.height) {
          if (selectedImage.width < 100 || selectedImage.height < 100) {
            Alert.alert(
              "Error",
              "Image dimensions should be at least 100x100 pixels"
            );
            return;
          }
        }

        setImageUri(selectedImage.uri);
        setValue("image", selectedImage.uri);
        setError(null);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photo = result.assets[0];
        setImageUri(photo.uri);
        setValue("image", photo.uri);
        setError(null);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Upload Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Library",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

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
            {/* Profile Image Upload */}
            <View className="mb-6 items-center">
              <Pressable onPress={showImageOptions} className="relative">
                <View
                  className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary-100"
                  style={{
                    shadowColor: "#10b981",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-primary-50">
                      <Feather name="user" size={48} color="#10b981" />
                    </View>
                  )}
                  {isUploadingImage && (
                    <View className="absolute inset-0 items-center justify-center bg-black/50">
                      <ActivityIndicator size="large" color="#fff" />
                    </View>
                  )}
                </View>
                <View className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary-500">
                  <Feather name="camera" size={18} color="#fff" />
                </View>
              </Pressable>
              <Text className="mt-3 text-sm font-medium text-slate-600">
                Tap to change profile picture
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                JPG, PNG or GIF (max 5MB)
              </Text>
            </View>

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
              <View className="mb-4 flex-row items-center rounded-2xl border border-green-100 bg-green-50/80 px-3 py-3">
                <Feather name="check-circle" size={18} color="#10b981" />
                <Text className="ml-2 flex-1 text-sm text-green-600">
                  {status}
                </Text>
              </View>
            ) : null}
            {error ? (
              <View className="mb-4 flex-row items-center rounded-2xl border border-red-100 bg-red-50/80 px-3 py-3">
                <Feather name="alert-triangle" size={18} color="#ef4444" />
                <Text className="ml-2 flex-1 text-sm text-red-600">
                  {error}
                </Text>
              </View>
            ) : null}

            <Button
              variant="teal"
              title={isSubmitting ? "Saving..." : "Save changes"}
              className="mt-6"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || isUploadingImage}
              loading={isSubmitting}
            />
            <Button
              title="Back to profile"
              variant="outline"
              className="mt-6"
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
