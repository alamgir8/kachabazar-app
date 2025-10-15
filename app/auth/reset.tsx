import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordScreen() {
  const router = useRouter();

  return (
    <Screen className="px-5 pt-24">
      <View className="rounded-3xl bg-white p-10 shadow-[0_15px_40px_rgba(15,118,110,0.1)]">
        <Text className="text-lg font-semibold text-slate-900">
          Reset your password
        </Text>
        <Text className="mt-2 text-sm text-slate-500">
          Use the web experience or contact support to complete password reset. We will bring the full flow to the app soon.
        </Text>
        <Button title="Back" className="mt-6" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
