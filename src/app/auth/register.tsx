import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { BackButton } from "@/components/ui";
import Button from "@/components/ui/Button";

/**
 * Registration method selection screen
 * Allows users to choose between email or phone registration
 * Both methods use OTP verification for security
 */
export default function RegisterScreen() {
  const router = useRouter();

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
            subDescription="Choose how you want to register"
          />

          <View className="mt-8 px-1">
            {/* Illustration/Icon */}
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-4">
                <Feather name="user-plus" size={40} color="#10b981" />
              </View>
              <Text className="text-lg font-medium text-slate-700 text-center">
                Create your account
              </Text>
              <Text className="text-sm text-slate-500 text-center mt-1">
                We'll send you a verification code
              </Text>
            </View>

            {/* Email Registration Option */}
            <View className="bg-white rounded-2xl p-5 mb-4 border border-slate-100 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                  <Feather name="mail" size={24} color="#3b82f6" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-base font-semibold text-slate-800">
                    Register with Email
                  </Text>
                  <Text className="text-sm text-slate-500 mt-0.5">
                    Get a 6-digit code via email
                  </Text>
                </View>
              </View>
              <Button
                title="Continue with Email"
                variant="teal"
                onPress={() => router.push("/auth/email-register")}
                className="mt-2"
              />
            </View>

            {/* Phone Registration Option */}
            <View className="bg-white rounded-2xl p-5 mb-4 border border-slate-100 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center">
                  <Feather name="smartphone" size={24} color="#10b981" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-base font-semibold text-slate-800">
                    Register with Phone
                  </Text>
                  <Text className="text-sm text-slate-500 mt-0.5">
                    Get a 6-digit code via SMS
                  </Text>
                </View>
              </View>
              <Button
                title="Continue with Phone"
                variant="outline"
                onPress={() => router.push("/auth/phone-register")}
                className="mt-2"
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="mx-4 text-sm text-slate-500">
                Already have an account?
              </Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Back to Login */}
            <Button
              title="Back to Login"
              variant="outline"
              onPress={() => router.back()}
            />

            {/* Security Note */}
            <View className="mt-8 p-4 bg-slate-50 rounded-xl">
              <View className="flex-row items-start">
                <Feather name="shield" size={20} color="#64748b" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Your data is secure
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    We use OTP verification to ensure your account is protected.
                    Verification codes expire after 10 minutes.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
