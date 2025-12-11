import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/components/layout/Screen";
import { LoadingState } from "@/components/common/LoadingState";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";
import Button from "@/components/ui/Button";
import { BackButton, EnhancedInput, TextArea } from "@/components/ui";
import { contactFormSchema, type ContactFormInput } from "@/utils/validation";

export default function ContactUsScreen() {
  const router = useRouter();
  const { storeCustomization, isLoading } = useSettings();
  const contactUs = (storeCustomization as any)?.contact_us;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormInput) => {
    setError(null);
    setSuccess(false);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      reset();
      Alert.alert(
        "Success",
        "Your message has been sent successfully. We will contact you shortly."
      );
    } catch (err) {
      setError("Unable to send message. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <Screen edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 6 }}
      >
        {/* Back Button */}
        <BackButton
          subTitle={"Last updated: " + new Date().toLocaleDateString()}
          subDescription={getLocalizedValue(contactUs?.title) || "Contact Us"}
        />

        {/* Contact Cards */}
        <View className="px-1 py-8">
          <View className="mb-6 gap-4">
            {/* Email Card */}
            <View className="rounded-2xl border border-slate-200 bg-white py-6 px-4 shadow-sm">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Feather name="mail" size={24} color="#1c7646" />
              </View>
              <Text className="mb-2 text-xl font-bold text-slate-900">
                {getLocalizedValue(contactUs?.email_box_title) || "Email Us"}
              </Text>
              <Text className="mb-1 text-base font-semibold text-primary-600">
                {getLocalizedValue(contactUs?.email_box_email) ||
                  "support@kachabazar.com"}
              </Text>
              <Text className="text-slate-600">
                {getLocalizedValue(contactUs?.email_box_text) ||
                  "Send us your query anytime!"}
              </Text>
            </View>

            {/* Phone Card */}
            <View className="rounded-2xl border border-slate-200 bg-white py-6 px-4 shadow-sm">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Feather name="phone" size={24} color="#3b82f6" />
              </View>
              <Text className="mb-2 text-xl font-bold text-slate-900">
                {getLocalizedValue(contactUs?.call_box_title) || "Call Us"}
              </Text>
              <Text className="mb-1 text-base font-semibold text-blue-600">
                {getLocalizedValue(contactUs?.call_box_phone) ||
                  "+1 (555) 123-4567"}
              </Text>
              <Text className="text-slate-600">
                {getLocalizedValue(contactUs?.call_box_text) ||
                  "We are available 24/7"}
              </Text>
            </View>

            {/* Address Card */}
            <View className="rounded-2xl border border-slate-200 bg-white py-6 px-4 shadow-sm">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Feather name="map-pin" size={24} color="#f97316" />
              </View>
              <Text className="mb-2 text-xl font-bold text-slate-900">
                {getLocalizedValue(contactUs?.address_box_title) || "Visit Us"}
              </Text>
              <Text className="mb-1 text-base font-semibold text-orange-600">
                {getLocalizedValue(contactUs?.address_box_address) ||
                  "123 Main Street"}
              </Text>
              <Text className="text-slate-600">
                {getLocalizedValue(contactUs?.address_box_text) ||
                  "Come visit our store"}
              </Text>
            </View>
          </View>

          {/* Contact Form */}
          <View className="rounded-2xl bg-white py-6 px-4 shadow-lg">
            <Text className="mb-6 font-display text-2xl font-bold text-slate-900">
              Send us a Message
            </Text>

            <View className="gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <EnhancedInput
                    label="Name"
                    placeholder="Your full name"
                    value={value}
                    onChangeText={onChange}
                    error={errors.name?.message}
                    leftIcon="user"
                    containerClassName="mb-2"
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <EnhancedInput
                    label="Email"
                    placeholder="your.email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    leftIcon="mail"
                    containerClassName="mb-2"
                  />
                )}
              />

              <Controller
                control={control}
                name="subject"
                render={({ field: { value, onChange } }) => (
                  <EnhancedInput
                    label="Subject (Optional)"
                    placeholder="What is this about?"
                    value={value}
                    onChangeText={onChange}
                    error={errors.subject?.message}
                    leftIcon="file-text"
                    containerClassName="mb-2"
                  />
                )}
              />

              <Controller
                control={control}
                name="message"
                render={({ field: { value, onChange } }) => (
                  <TextArea
                    label="Message"
                    placeholder="Tell us more about your inquiry..."
                    value={value}
                    onChangeText={onChange}
                    error={errors.message?.message}
                    numberOfLines={6}
                    containerClassName="mb-2"
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

              {success ? (
                <View className="mb-4 flex-row items-center rounded-2xl border border-green-100 bg-green-50/80 px-3 py-3">
                  <Feather name="check-circle" size={18} color="#10b981" />
                  <Text className="ml-2 flex-1 text-sm text-green-600">
                    Message sent successfully!
                  </Text>
                </View>
              ) : null}

              <Button
                variant="teal"
                title={isSubmitting ? "Sending..." : "Send Message"}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                loading={isSubmitting}
                className="mt-4"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
