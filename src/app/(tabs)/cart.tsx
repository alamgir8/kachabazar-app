import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui";

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
      edges={["bottom"]}
      contentContainerClassName="flex-1 justify-between pb-4"
      innerClassName="flex-1"
    >
      <BackButton />
      {isEmpty ? (
        <View className="gap-6">
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
          <View className="items-center rounded-[36px] border border-white/70 bg-white/95 px-8 py-12 text-center shadow-[0_25px_60px_rgba(15,118,110,0.14)]">
            <Text className="text-lg font-bold text-slate-900">
              Your cart is craving something fresh
            </Text>
            <Text className="mt-3 text-center text-sm leading-relaxed text-slate-600">
              Explore seasonal picks, curate your weekly essentials, and come
              back to checkout.
            </Text>
            <Button
              title="Start shopping"
              className="mt-6 w-full rounded-full"
              variant="primary"
              onPress={() => router.push("/search")}
            />
          </View>
        </View>
      ) : (
        <>
          <View className="flex-1 gap-6">
            <View className="gap-2 px-1">
              <Text className="text-[23px] font-semibold uppercase tracking-[0.2em] text-primary-500">
                Shopping Cart
              </Text>

              <Text className="text-[13px] text-slate-500">
                Review your selections and adjust quantities before checkout.
              </Text>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CartItemRow item={item} />}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              // ListFooterComponent={
              //   <View className="mt-4 rounded-[32px] border border-dashed border-emerald-200 bg-emerald-50/40 px-5 py-5">
              //     <Text className="text-[12px] font-semibold uppercase tracking-wide text-primary-600">
              //       Tip
              //     </Text>
              //     <Text className="mt-1 text-sm text-slate-600">
              //       Swipe left on any item to remove it instantly—no need to
              //       reach for the bin icon.
              //     </Text>
              //   </View>
              // }
            />
          </View>

          <View className="border-t border-emerald-300 bg-white/96 px-1 py-1 shadow-[0_-20px_45px_rgba(15,118,110,0.08)]">
            <CartSummary />
            <View className="mt-4 flex-row gap-3">
              <Button
                title="Clear Cart"
                variant="outline"
                onPress={clearCart}
                disabled={items.length === 0}
              />
              <Button
                title="Proceed"
                variant="teal"
                onPress={handleCheckout}
                disabled={items.length === 0}
              />
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}
