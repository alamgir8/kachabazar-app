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
        contentContainerStyle={{
          paddingBottom: 160,
          paddingHorizontal: 20,
          paddingTop: 32,
        }}
      >
        {isEmpty ? (
          <View className="items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_25px_60px_rgba(15,118,110,0.12)]">
            <Text className="text-lg font-bold text-slate-900">
              Your cart is craving something fresh
            </Text>
            <Text className="mt-3 text-center text-sm leading-relaxed text-slate-600">
              Explore seasonal picks, curate your weekly essentials, and come
              back to checkout.
            </Text>
            <EnhancedButton
              title="Start shopping"
              className="mt-6 w-full rounded-2xl"
              size="lg"
              onPress={() => router.push("/search")}
            />
          </View>
        ) : (
          <View className="space-y-6">
            <View className="space-y-4">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </View>
            <CartSummary onCheckout={handleCheckout} />
            <EnhancedButton
              title="Clear cart"
              variant="outline"
              className="w-full rounded-2xl"
              size="lg"
              onPress={clearCart}
              contentClassName="py-3"
            />
            <View className="rounded-3xl border border-dashed border-primary-200 bg-primary-50/40 px-4 py-4">
              <Text className="text-[12px] font-semibold uppercase tracking-wide text-primary-600">
                Tip
              </Text>
              <Text className="mt-1 text-sm text-slate-600">
                Swipe left on any item to remove it instantly—no need to reach
                for the bin icon.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
