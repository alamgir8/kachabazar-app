import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { LoadingState } from "@/components/common/LoadingState";
import { useSettings } from "@/contexts/SettingsContext";

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between p-5"
      >
        <Text className="flex-1 pr-4 text-base font-semibold text-slate-900">
          {question}
        </Text>
        <View className={`transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <Feather name="chevron-down" size={20} color="#1c7646" />
        </View>
      </Pressable>
      {isOpen && (
        <View className="border-t border-slate-100 bg-slate-50 px-5 py-4">
          <Text className="leading-6 text-slate-600">{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  const router = useRouter();
  const { isLoading } = useSettings();

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit cards, debit cards, or cash on delivery.",
    },
    {
      question: "What is your delivery time?",
      answer:
        "We typically deliver within 24-48 hours depending on your location. Same-day delivery is available for orders placed before 12 PM in selected areas.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery is free for orders above $50. For orders below $50, a nominal delivery fee of $5 applies. Premium members enjoy free delivery on all orders.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 7-day return policy for most products. Items must be in original condition with packaging. Perishable items cannot be returned unless damaged or defective.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is dispatched, you'll receive a tracking link via email and SMS. You can also track your order from the 'My Orders' section in your account.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, net banking, mobile wallets, UPI, and cash on delivery. All online payments are secured with SSL encryption.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "You can modify or cancel your order within 30 minutes of placing it. After that, please contact our customer support for assistance.",
    },
    {
      question: "Do you offer organic products?",
      answer:
        "Yes! We have a dedicated section for organic and chemical-free products. Look for the 'Organic' badge on product listings.",
    },
    {
      question: "How do I become a premium member?",
      answer:
        "You can subscribe to our premium membership from your account settings. Premium members get free delivery, exclusive discounts, and early access to sales.",
    },
    {
      question: "What if I receive damaged products?",
      answer:
        "Please contact us immediately with photos of the damaged product. We'll arrange a replacement or full refund within 24 hours.",
    },
  ];

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
            Frequently Asked Questions
          </Text>
          <Text className="text-base text-white/90">
            Find answers to common questions about our service
          </Text>
        </View>

        {/* FAQ List */}
        <View className="px-5 py-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        {/* Still Have Questions */}
        <View className="mx-5 mb-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-6">
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary-200">
            <Feather name="message-circle" size={24} color="#1c7646" />
          </View>
          <Text className="mb-2 text-xl font-bold text-slate-900">
            Still have questions?
          </Text>
          <Text className="mb-4 text-slate-600">
            Can't find the answer you're looking for? Please contact our
            customer support team.
          </Text>
          <Pressable
            onPress={() => router.push("/contact-us")}
            className="flex-row items-center"
          >
            <Text className="mr-2 font-semibold text-primary-600">
              Contact Support
            </Text>
            <Feather name="arrow-right" size={18} color="#1c7646" />
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
