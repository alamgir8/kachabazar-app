import { ScrollView, Text, View, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { LoadingState } from "@/components/common/LoadingState";
import { useSettings } from "@/contexts/SettingsContext";
import { getLocalizedValue } from "@/utils";

export default function AboutUsScreen() {
  const router = useRouter();
  const { storeCustomization, isLoading } = useSettings();
  const aboutUs = (storeCustomization as any)?.about_us;

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
        <View className="relative h-48 bg-gradient-to-b from-primary-600 to-accent-600">
          <Image
            source={{
              uri: aboutUs?.header_bg || "https://via.placeholder.com/800x300",
            }}
            className="absolute inset-0 h-full w-full opacity-20"
            resizeMode="cover"
          />
          <View className="absolute inset-0 flex-1 items-center justify-center px-5">
            <Pressable
              onPress={() => router.back()}
              className="absolute left-4 top-12 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </Pressable>
            <Text className="font-display text-3xl font-bold text-white">
              {getLocalizedValue(aboutUs?.title) || "About Us"}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 py-8">
          {/* Top Section */}
          <View className="mb-8">
            <Text className="mb-4 font-display text-2xl font-bold text-slate-900">
              {getLocalizedValue(aboutUs?.top_title) || "Our Story"}
            </Text>
            <Text className="text-base leading-7 text-slate-600">
              {getLocalizedValue(aboutUs?.top_description) ||
                "We're passionate about bringing fresh, quality groceries right to your doorstep. Our mission is to make healthy eating accessible and convenient for everyone."}
            </Text>
          </View>

          {/* Info Cards */}
          <View className="mb-8 gap-4">
            <View className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-sm">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-indigo-200">
                <Feather name="award" size={24} color="#4f46e5" />
              </View>
              <Text className="mb-1 text-3xl font-extrabold text-slate-800">
                {getLocalizedValue(aboutUs?.card_two_title) || "10K+"}
              </Text>
              <Text className="mb-2 text-lg font-bold text-slate-700">
                {getLocalizedValue(aboutUs?.card_two_sub) || "Happy Customers"}
              </Text>
              <Text className="leading-6 text-slate-600">
                {getLocalizedValue(aboutUs?.card_two_description) ||
                  "Serving thousands of satisfied customers with quality products daily."}
              </Text>
            </View>

            <View className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 shadow-sm">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-emerald-200">
                <Feather name="package" size={24} color="#10b981" />
              </View>
              <Text className="mb-1 text-3xl font-extrabold text-slate-800">
                {getLocalizedValue(aboutUs?.card_one_title) || "5000+"}
              </Text>
              <Text className="mb-2 text-lg font-bold text-slate-700">
                {getLocalizedValue(aboutUs?.card_one_sub) || "Products"}
              </Text>
              <Text className="leading-6 text-slate-600">
                {getLocalizedValue(aboutUs?.card_one_description) ||
                  "A wide range of fresh products from trusted local suppliers."}
              </Text>
            </View>
          </View>

          {/* Mission Section */}
          <View className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Feather name="target" size={20} color="#1c7646" />
              </View>
              <Text className="font-display text-xl font-bold text-slate-900">
                Our Mission
              </Text>
            </View>
            <Text className="leading-7 text-slate-600">
              {getLocalizedValue(aboutUs?.middle_description) ||
                "To revolutionize grocery shopping by providing fresh, organic, and locally-sourced products with exceptional service and unbeatable convenience."}
            </Text>
          </View>

          {/* Bottom Section */}
          <View className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <Text className="mb-3 font-display text-xl font-bold text-slate-900">
              {getLocalizedValue(aboutUs?.bottom_title) || "Why Choose Us?"}
            </Text>
            <Text className="mb-6 leading-7 text-slate-600">
              {getLocalizedValue(aboutUs?.bottom_description) ||
                "We partner with local farmers and suppliers to ensure you get the freshest produce. Our commitment to quality, sustainability, and customer satisfaction sets us apart."}
            </Text>

            <View className="gap-3">
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <Feather name="check" size={18} color="#1c7646" />
                </View>
                <Text className="flex-1 text-slate-700">
                  Fresh & Organic Products
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <Feather name="check" size={18} color="#1c7646" />
                </View>
                <Text className="flex-1 text-slate-700">
                  Fast Delivery Service
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <Feather name="check" size={18} color="#1c7646" />
                </View>
                <Text className="flex-1 text-slate-700">
                  Best Price Guarantee
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <Feather name="check" size={18} color="#1c7646" />
                </View>
                <Text className="flex-1 text-slate-700">
                  24/7 Customer Support
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
