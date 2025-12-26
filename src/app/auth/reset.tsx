import { Text, View, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui";

// Store URL - should match your production store URL
const STORE_URL = process.env.EXPO_PUBLIC_STORE_URL || "http://localhost:3000";

export default function ResetPasswordScreen() {
  const router = useRouter();

  const handleOpenWebReset = async () => {
    const resetUrl = `${STORE_URL}/auth/forget-password`;
    const canOpen = await Linking.canOpenURL(resetUrl);

    if (canOpen) {
      await Linking.openURL(resetUrl);
    }
  };

  return (
    <Screen scrollable edges={["bottom"]}>
      <View className="">
        {/* Back Button */}
        <BackButton
          subTitle="Password Reset"
          subDescription="Reset your password"
        />

        <Text className="mt-3 text-sm text-slate-500">
          For security reasons, password reset is handled through our secure web
          portal. Click the button below to reset your password in your browser.
        </Text>

        <View className="mt-6 rounded-2xl px-1 py-4 shadow-sm">
          <View className="mb-4 rounded-xl bg-blue-50 p-3 flex-row items-start border border-blue-100">
            <Feather name="info" size={18} color="#3b82f6" />
            <Text className="ml-2 text-sm text-blue-600 flex-1">
              You'll receive an email with a secure link to create a new
              password.
            </Text>
          </View>

          <Button
            title="Reset Password in Browser"
            variant="primary"
            onPress={handleOpenWebReset}
            icon={<Feather name="external-link" size={18} color="#fff" />}
            className="mb-3"
          />

          <Button
            title="Back to Login"
            variant="outline"
            onPress={() => router?.back()}
          />
        </View>
      </View>
    </Screen>
  );
}
