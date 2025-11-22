import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

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
      edges={["bottom"]}
      contentContainerClassName="flex-1 justify-between pb-4"
      innerClassName="flex-1"
    >
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
            <EnhancedButton
              title="Start shopping"
              className="mt-6 w-full rounded-full"
              size="lg"
              glass
              variant="primary"
              onPress={() => router.push("/search")}
            />
          </View>
        </View>
      ) : (
        <>
          <View className="flex-1 gap-6">
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

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CartItemRow item={item} />}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              ListFooterComponent={
                <View className="mt-4 rounded-[32px] border border-dashed border-emerald-200 bg-emerald-50/40 px-5 py-5">
                  <Text className="text-[12px] font-semibold uppercase tracking-wide text-primary-600">
                    Tip
                  </Text>
                  <Text className="mt-1 text-sm text-slate-600">
                    Swipe left on any item to remove it instantly—no need to
                    reach for the bin icon.
                  </Text>
                </View>
              }
            />
          </View>

          <View className="rounded-[36px] border border-white/70 bg-white/96 px-5 py-5 shadow-[0_-20px_45px_rgba(15,118,110,0.08)]">
            <CartSummary onCheckout={handleCheckout} showButton={false} />
            <View className="mt-4 flex-row gap-3">
              <CartActionButton
                title="Clear cart"
                variant="outline"
                onPress={clearCart}
              />
              <CartActionButton
                title="Proceed"
                variant="primary"
                onPress={handleCheckout}
              />
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

const CartActionButton = ({
  title,
  variant,
  onPress,
}: {
  title: string;
  variant: "outline" | "primary";
  onPress: () => void;
}) => {
  const isPrimary = variant === "primary";
  const gradientColors: readonly [string, string, ...string[]] = isPrimary
    ? ["#1fcf99", "#19a35a", "#15803d"]
    : ["rgba(34,197,94,0.18)", "rgba(14,165,233,0.12)"];
  const interiorColors: readonly [string, string, ...string[]] | undefined =
    isPrimary ? undefined : ["#ffffff", "rgba(255,255,255,0.92)"];
  const bubbleColor = isPrimary
    ? "rgba(255,255,255,0.2)"
    : "rgba(29,205,135,0.12)";

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        borderRadius: 999,
        padding: isPrimary ? 2 : 1.5,
      }}
    >
      <Pressable
        onPress={onPress}
        className="px-4 py-2"
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
        style={({ pressed }) => ({
          // borderRadius: 999,
          // backgroundColor: isPrimary ? "transparent" : "rgba(255,255,255,0.96)",
          // paddingVertical: 14,
          // paddingHorizontal: 12,
          opacity: pressed ? 0.9 : 1,
          shadowColor: isPrimary ? "rgba(34,197,94,0.35)" : "transparent",
          shadowOffset: { width: 0, height: isPrimary ? 12 : 0 },
          shadowOpacity: isPrimary ? 0.35 : 0,
          shadowRadius: isPrimary ? 18 : 0,
          elevation: isPrimary ? 6 : 0,
          position: "relative",
          overflow: "hidden",
        })}
      >
        {!isPrimary && (
          <LinearGradient
            colors={interiorColors!}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 20,
            }}
          />
        )}
        <View
          style={{
            position: "absolute",
            top: -10,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: bubbleColor,
          }}
        />
        <Text
          className="text-base font-semibold text-center"
          style={{
            color: isPrimary ? "#ffffff" : "#0f9c68",
          }}
        >
          {title}
        </Text>
      </Pressable>
    </LinearGradient>
  );
};
