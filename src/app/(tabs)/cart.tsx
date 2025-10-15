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
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="-mx-4"
      >
        <View className="px-4 pt-4 pb-4">
          <View className="flex-row items-baseline justify-between">
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Your basket
              </Text>
              <Text className="mt-1.5 font-display text-2xl font-bold text-slate-900">
                {isEmpty ? "It feels empty here" : "Ready to checkout"}
              </Text>
            </View>
            {!isEmpty ? (
              <Text className="text-lg font-bold text-primary-600">
                {formatCurrency(subtotal, currency)}
              </Text>
            ) : null}
          </View>
        </View>

        {isEmpty ? (
          <View className="mx-4 mt-6 items-center rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
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
          <View className="px-4">
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
              size="lg"
              className="mt-4"
              onPress={clearCart}
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
