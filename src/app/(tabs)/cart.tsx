import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { EnhancedButton } from "@/components/ui";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";

export default function CartScreen() {
  const router = useRouter();
  const { items, subtotal, isEmpty, clearCart } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const handleCheckout = () => {
    if (isEmpty) {
      router.push("/search");
      return;
    }
    router.push("/checkout");
  };

  return (
    <Screen innerClassName="px-0" scrollable edges={["bottom"]} bgColor="white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="pt-8">
          {isEmpty ? (
            <View className="mt-6 items-center rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
              <Text className="text-lg font-bold text-slate-900">
                Your cart is craving something fresh
              </Text>
              <Text className="mt-2 text-center text-sm leading-relaxed text-slate-600">
                Explore seasonal picks, curate your weekly essentials, and come
                back to checkout.
              </Text>
              <EnhancedButton
                title="Start shopping"
                className="mt-6 w-full"
                size="lg"
                onPress={() => router.push("/search")}
              />
            </View>
          ) : (
            <View className="">
              <View className="space-y-3">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </View>
              <View className="mt-6">
                <CartSummary onCheckout={handleCheckout} />
              </View>
              <EnhancedButton
                title="Clear cart"
                variant="outline"
                className="mt-6 w-full"
                size="lg"
                onPress={clearCart}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
