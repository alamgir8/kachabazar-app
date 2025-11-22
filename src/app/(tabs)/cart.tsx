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
                height={40}
                borderRadius={999}
              />
              <CartActionButton
                title="Proceed"
                variant="teal"
                onPress={handleCheckout}
                height={40}
                borderRadius={999}
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
  height = 48,
  borderRadius = 999,
  className = "flex-1",
  style: customStyle,
}: {
  title: string;
  variant:
    | "outline"
    | "primary"
    | "teal"
    | "purple"
    | "sky"
    | "blue"
    | "rose"
    | "pink"
    | "cyan"
    | "amber"
    | "lime";
  onPress: () => void;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: any;
}) => {
  // Define gradient colors for each variant
  const variantStyles = {
    primary: {
      gradient: ["#1fcf99", "#19a35a", "#15803d"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    outline: {
      gradient: ["rgba(34,197,94,0.18)", "rgba(14,165,233,0.12)"] as const,
      interior: ["#ffffff", "rgba(255,255,255,0.92)"] as const,
      bubble: "rgba(29,205,135,0.12)",
      textColor: "#0f9c68",
    },
    teal: {
      gradient: ["#5EEAD4", "#14B8A6", "#0D9488"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    purple: {
      gradient: ["#C084FC", "#A855F7", "#9333EA"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    sky: {
      gradient: ["#7DD3FC", "#0EA5E9", "#0284C7"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    blue: {
      gradient: ["#60A5FA", "#3B82F6", "#2563EB"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    rose: {
      gradient: ["#FDA4AF", "#FB7185", "#F43F5E"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    pink: {
      gradient: ["#F9A8D4", "#EC4899", "#DB2777"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    cyan: {
      gradient: ["#67E8F9", "#06B6D4", "#0891B2"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    amber: {
      gradient: ["#FCD34D", "#F59E0B", "#D97706"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    lime: {
      gradient: ["#BEF264", "#84CC16", "#65A30D"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
  };

  const style = variantStyles[variant];
  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      className={className}
      style={customStyle}
      android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
    >
      <LinearGradient
        colors={style.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height,
          borderRadius,
          padding: isOutline ? 1.5 : 2,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: isOutline ? "transparent" : "rgba(34,197,94,0.35)",
          shadowOffset: { width: 0, height: isOutline ? 0 : 8 },
          shadowOpacity: isOutline ? 0 : 0.3,
          shadowRadius: isOutline ? 0 : 16,
          elevation: isOutline ? 0 : 5,
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            borderRadius: borderRadius - 2,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {style.interior && (
            <LinearGradient
              colors={style.interior}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
          )}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -10,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: style.bubble,
            }}
          />
          <Text
            style={{
              color: style.textColor,
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            {title}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
