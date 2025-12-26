import { useCallback } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui";
import { CartItem } from "@/types";

// Memoized separator component
const ItemSeparator = () => <View className="h-4" />;

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

  // Optimized renderItem callback
  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => <CartItemRow item={item} />,
    []
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: CartItem) => item.id, []);

  return (
    <Screen
      edges={["bottom"]}
      contentContainerClassName="flex-1 justify-between pb-4"
      innerClassName="flex-1"
    >
      {/* Back Button */}
      <BackButton subTitle="Your Basket" subDescription="Shopping Cart" />
      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-1">
          {/* Decorative background gradient */}
          <View className="absolute inset-0">
            <LinearGradient
              colors={[
                "rgba(240,253,244,0.4)",
                "rgba(220,252,231,0.2)",
                "rgba(167,243,208,0.1)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-full w-full"
            />
            {/* Decorative circles */}
            <View
              style={{
                position: "absolute",
                top: 60,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: "rgba(16,185,129,0.08)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 100,
                left: -50,
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: "rgba(5,150,105,0.06)",
              }}
            />
          </View>

          {/* Content */}
          <View className="relative w-full items-center">
            {/* Icon Container */}
            <View className="mb-6 items-center justify-center">
              <Feather name="shopping-bag" size={80} color="#10b981" />
            </View>

            {/* Main Card */}
            <View
              className="w-full items-center rounded-[32px] border border-emerald-100 bg-white px-8 py-10"
              style={{
                shadowColor: "rgba(15,118,110,0.12)",
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.25,
                shadowRadius: 32,
                elevation: 10,
              }}
            >
              <Text className="text-center text-2xl font-extrabold text-slate-900">
                Your cart is empty
              </Text>
              <Text className="mt-4 text-center text-base leading-relaxed text-slate-600">
                Looks like you haven't added anything to your cart yet
              </Text>

              {/* Features */}
              <View className="mt-6 w-full gap-3">
                <View className="flex-row items-center gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                    <Feather name="package" size={20} color="#059669" />
                  </View>
                  <Text className="flex-1 text-sm font-medium text-slate-700">
                    Fresh seasonal picks daily
                  </Text>
                </View>
                <View className="flex-row items-center gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                    <Feather name="truck" size={20} color="#059669" />
                  </View>
                  <Text className="flex-1 text-sm font-medium text-slate-700">
                    Free delivery on orders above $50
                  </Text>
                </View>
                <View className="flex-row items-center gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                    <Feather name="award" size={20} color="#059669" />
                  </View>
                  <Text className="flex-1 text-sm font-medium text-slate-700">
                    100% quality guarantee
                  </Text>
                </View>
              </View>

              {/* Button */}
              <Button
                title="Start Shopping"
                className="mt-8 w-full"
                variant="primary"
                height={42}
                onPress={() => router.push("/search")}
              />
            </View>
          </View>
        </View>
      ) : (
        <>
          <View className="flex-1 gap-6">
            <View className="gap-2 px-1">
              <Text className="mt-3 text-sm text-slate-500">
                Review your selections and adjust quantities before checkout.
              </Text>
            </View>

            <FlatList
              data={items}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={ItemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={5}
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
