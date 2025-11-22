import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui";

export default function ResetPasswordScreen() {
  const router = useRouter();

  return (
    <Screen scrollable edges={["bottom"]}>
      <View className="">
        {/* Back Button */}
        <BackButton
          subTitle="Password Reset"
          subDescription="Reset your password"
        />

        <Text className="mt-3 text-sm text-slate-500">
          Use the web experience or contact support to complete password reset.
          We will bring the full flow to the app soon.
        </Text>

        <View className="mt-6 rounded-2xl px-1 py-4 shadow-sm">
          <View className="mb-4 rounded-xl bg-blue-50 p-3 flex-row items-start border border-blue-100">
            <Feather name="info" size={18} color="#3b82f6" />
            <Text className="ml-2 text-sm text-blue-600 flex-1">
              For security reasons, password reset is currently available
              through our web portal.
            </Text>
          </View>
          <Button
            title="Back to login"
            variant="primary"
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </View>
    </Screen>
  );
}
