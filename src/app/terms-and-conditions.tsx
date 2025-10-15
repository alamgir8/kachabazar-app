import { ScrollView, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { LoadingState } from "@/components/common/LoadingState";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";

export default function TermsAndConditionsScreen() {
  const router = useRouter();
  const { storeCustomization, isLoading } = useSettings();
  const termsData = (storeCustomization as any)?.terms_and_conditions;

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <Screen className="px-0 pt-0" edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="bg-gradient-to-b from-primary-600 to-primary-500 px-5 pb-8 pt-16">
          <Pressable
            onPress={() => router.back()}
            className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <Text className="mb-2 font-display text-3xl font-bold text-white">
            {getLocalizedValue(termsData?.title) || "Terms & Conditions"}
          </Text>
          <Text className="text-base text-white/90">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Content */}
        <View className="px-5 py-8">
          <View className="mb-6 rounded-2xl bg-amber-50 p-4">
            <View className="flex-row items-start">
              <Feather name="info" size={20} color="#f59e0b" />
              <Text className="ml-3 flex-1 text-sm text-amber-900">
                Please read these terms and conditions carefully before using
                our service.
              </Text>
            </View>
          </View>

          {/* Section 1 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              1. Introduction
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              {getLocalizedValue(termsData?.introduction) ||
                "Welcome to KachaBazar. These Terms and Conditions govern your use of our website and mobile application. By accessing or using our service, you agree to be bound by these terms."}
            </Text>
          </View>

          {/* Section 2 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              2. Account Registration
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              To use certain features of our service, you must register for an
              account. You agree to provide accurate, current, and complete
              information during registration and to update such information to
              keep it accurate.
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • You must be at least 18 years old to register
              </Text>
              <Text className="text-slate-600">
                • You are responsible for maintaining account security
              </Text>
              <Text className="text-slate-600">
                • You must not share your account credentials
              </Text>
            </View>
          </View>

          {/* Section 3 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              3. Orders and Payment
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              When you place an order, you are making an offer to purchase
              products. We reserve the right to accept or decline your order for
              any reason.
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • All prices are subject to change without notice
              </Text>
              <Text className="text-slate-600">
                • Payment must be made at time of order
              </Text>
              <Text className="text-slate-600">
                • We accept various payment methods as listed
              </Text>
            </View>
          </View>

          {/* Section 4 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              4. Delivery Policy
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We strive to deliver your orders within the estimated timeframe.
              However, delivery times are not guaranteed and may vary based on
              location and availability.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              5. Returns and Refunds
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We offer a return policy for products as described in our Returns
              Policy. Refunds will be processed within 7-10 business days of
              receiving the returned product.
            </Text>
          </View>

          {/* Section 6 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              6. User Conduct
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              You agree not to:
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • Use the service for any unlawful purpose
              </Text>
              <Text className="text-slate-600">
                • Attempt to gain unauthorized access to our systems
              </Text>
              <Text className="text-slate-600">
                • Interfere with the proper functioning of the service
              </Text>
              <Text className="text-slate-600">
                • Impersonate any person or entity
              </Text>
            </View>
          </View>

          {/* Section 7 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              7. Intellectual Property
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              All content on our platform, including text, graphics, logos, and
              software, is the property of KachaBazar and is protected by
              copyright and trademark laws.
            </Text>
          </View>

          {/* Section 8 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              8. Limitation of Liability
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              To the fullest extent permitted by law, KachaBazar shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the service.
            </Text>
          </View>

          {/* Section 9 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              9. Changes to Terms
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or through our
              platform.
            </Text>
          </View>

          {/* Section 10 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              10. Contact Information
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              If you have any questions about these Terms and Conditions, please
              contact us through our Contact Us page.
            </Text>
          </View>

          {/* Footer */}
          <View className="mt-6 rounded-2xl border-2 border-primary-200 bg-primary-50 p-6">
            <View className="mb-3 flex-row items-center">
              <Feather name="check-circle" size={24} color="#1c7646" />
              <Text className="ml-3 text-lg font-bold text-slate-900">
                Agreement
              </Text>
            </View>
            <Text className="text-slate-600">
              By using KachaBazar services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms and Conditions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
