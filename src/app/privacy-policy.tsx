import { ScrollView, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { LoadingState } from "@/components/common/LoadingState";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { storeCustomization, isLoading } = useSettings();
  const privacyData = (storeCustomization as any)?.privacy_policy;

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <Screen className="pt-0" innerClassName="px-0" edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="bg-gradient-to-b from-primary-600 to-accent-600 px-5 pb-8 pt-16">
          <Pressable
            onPress={() => router.back()}
            className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <Text className="mb-2 font-display text-3xl font-bold text-white">
            {getLocalizedValue(privacyData?.title) || "Privacy Policy"}
          </Text>
          <Text className="text-base text-white/90">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Content */}
        <View className="px-5 py-8">
          <View className="mb-6 rounded-2xl bg-blue-50 p-4">
            <View className="flex-row items-start">
              <Feather name="shield" size={20} color="#3b82f6" />
              <Text className="ml-3 flex-1 text-sm text-blue-900">
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your personal information.
              </Text>
            </View>
          </View>

          {/* Section 1 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              1. Information We Collect
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We collect information that you provide directly to us, including:
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • Name, email address, and phone number
              </Text>
              <Text className="text-slate-600">
                • Shipping and billing addresses
              </Text>
              <Text className="text-slate-600">• Payment information</Text>
              <Text className="text-slate-600">
                • Order history and preferences
              </Text>
              <Text className="text-slate-600">
                • Communication preferences
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              2. How We Use Your Information
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We use the information we collect to:
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • Process and fulfill your orders
              </Text>
              <Text className="text-slate-600">
                • Communicate with you about your orders
              </Text>
              <Text className="text-slate-600">
                • Send promotional emails (with your consent)
              </Text>
              <Text className="text-slate-600">
                • Improve our services and user experience
              </Text>
              <Text className="text-slate-600">• Detect and prevent fraud</Text>
            </View>
          </View>

          {/* Section 3 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              3. Information Sharing
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We do not sell your personal information. We may share your
              information with:
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • Service providers who help us operate our business
              </Text>
              <Text className="text-slate-600">
                • Payment processors to complete transactions
              </Text>
              <Text className="text-slate-600">
                • Delivery partners to fulfill your orders
              </Text>
              <Text className="text-slate-600">
                • Legal authorities when required by law
              </Text>
            </View>
          </View>

          {/* Section 4 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              4. Data Security
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • SSL encryption for data transmission
              </Text>
              <Text className="text-slate-600">
                • Secure storage of payment information
              </Text>
              <Text className="text-slate-600">• Regular security audits</Text>
              <Text className="text-slate-600">
                • Access controls and authentication
              </Text>
            </View>
          </View>

          {/* Section 5 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              5. Cookies and Tracking
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We use cookies and similar tracking technologies to enhance your
              experience on our platform. You can control cookie settings
              through your browser preferences.
            </Text>
          </View>

          {/* Section 6 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              6. Your Rights
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              You have the right to:
            </Text>
            <View className="ml-4 gap-2">
              <Text className="text-slate-600">
                • Access your personal information
              </Text>
              <Text className="text-slate-600">
                • Correct inaccurate information
              </Text>
              <Text className="text-slate-600">
                • Request deletion of your data
              </Text>
              <Text className="text-slate-600">
                • Opt-out of marketing communications
              </Text>
              <Text className="text-slate-600">• Export your data</Text>
            </View>
          </View>

          {/* Section 7 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              7. Children's Privacy
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children.
            </Text>
          </View>

          {/* Section 8 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              8. Third-Party Links
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              Our platform may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites.
            </Text>
          </View>

          {/* Section 9 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              9. Changes to This Policy
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the "Last updated" date.
            </Text>
          </View>

          {/* Section 10 */}
          <View className="mb-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              10. Contact Us
            </Text>
            <Text className="mb-3 leading-7 text-slate-600">
              If you have any questions about this Privacy Policy, please
              contact us through our Contact Us page or email us at
              privacy@kachabazar.com
            </Text>
          </View>

          {/* Footer */}
          <View className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <View className="mb-3 flex-row items-center">
              <Feather name="lock" size={24} color="#3b82f6" />
              <Text className="ml-3 text-lg font-bold text-slate-900">
                Your Data is Safe
              </Text>
            </View>
            <Text className="text-slate-600">
              We are committed to protecting your privacy and handling your data
              responsibly. Your trust is important to us.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
