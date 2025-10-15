import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton } from "@/components/ui";

export default function ResetPasswordScreen() {
  const router = useRouter();

  return (
    <Screen scrollable innerClassName="px-0">
      <View className="px-6 pt-16">
        <Pressable
          onPress={() => router.back()}
          className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200"
        >
          <Feather name="arrow-left" size={20} color="#334155" />
        </Pressable>

        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
          Password Reset
        </Text>
        <Text className="mt-2 font-display text-3xl text-slate-900">
          Reset your password
        </Text>
        <Text className="mt-3 text-sm text-slate-500">
          Use the web experience or contact support to complete password reset.
          We will bring the full flow to the app soon.
        </Text>

        <View className="mt-6 rounded-2xl bg-white p-6 border border-slate-100 shadow-sm">
          <View className="mb-4 rounded-xl bg-blue-50 p-3 flex-row items-start border border-blue-100">
            <Feather name="info" size={18} color="#3b82f6" />
            <Text className="ml-2 text-sm text-blue-600 flex-1">
              For security reasons, password reset is currently available
              through our web portal.
            </Text>
          </View>
          <EnhancedButton
            title="Back to login"
            variant="primary"
            size="lg"
            gradient
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </View>
    </Screen>
  );
}
