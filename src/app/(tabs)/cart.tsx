import { useRouter } from "expo-router";
import { Text, View } from "react-native";

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
    <Screen
      scrollable
      edges={["bottom"]}
      contentContainerClassName="gap-6 pb-28"
    >
      <View className="gap-2">
        <Text className="text-[13px] font-semibold uppercase tracking-[0.3em] text-primary-500">
          Your basket
        </Text>
        <Text className="text-[28px] font-extrabold text-slate-900">
          Shopping Cart
        </Text>
        <Text className="text-[13px] text-slate-500">
          Review your selections and adjust quantities before checkout.
        </Text>
      </View>

      {isEmpty ? (
        <View className="items-center rounded-[36px] border border-white/70 bg-white/95 px-8 py-12 text-center shadow-[0_25px_60px_rgba(15,118,110,0.14)]">
          <Text className="text-lg font-bold text-slate-900">
            Your cart is craving something fresh
          </Text>
          <Text className="mt-3 text-center text-sm leading-relaxed text-slate-600">
            Explore seasonal picks, curate your weekly essentials, and come back
            to checkout.
          </Text>
          <EnhancedButton
            title="Start shopping"
            className="mt-6 w-full rounded-full"
            size="lg"
            glass
            variant="primary"
            onPress={() => router.push("/search")}
          />
        </View>
      ) : (
        <View className="space-y-6">
          <View className="space-y-5">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </View>
          <CartSummary onCheckout={handleCheckout} />
          <EnhancedButton
            title="Clear cart"
            variant="outline"
            className="w-full rounded-full"
            size="lg"
            onPress={clearCart}
            contentClassName="py-3"
          />
          <View className="rounded-[32px] border border-dashed border-emerald-200 bg-emerald-50/40 px-5 py-5">
            <Text className="text-[12px] font-semibold uppercase tracking-wide text-primary-600">
              Tip
            </Text>
            <Text className="mt-1 text-sm text-slate-600">
              Swipe left on any item to remove it instantly—no need to reach for
              the bin icon.
            </Text>
          </View>
        </View>
      )}
    </Screen>
  );
}
