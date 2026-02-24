import { ScrollView, Text, View, Animated, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { useOrder } from "@/hooks/queries/useOrders";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";
import Button from "@/components/ui/Button";

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();
  const { data: order } = useOrder(params.orderId);
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const confettiAnims = useRef(
    Array.from({ length: 12 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    })),
  ).current;

  useEffect(() => {
    // Card entrance
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Check mark bounce
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 60,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Content slide up
    Animated.sequence([
      Animated.delay(500),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti burst
    const screenWidth = Dimensions.get("window").width;
    const confettiColors = [
      "#22c55e",
      "#3b82f6",
      "#eab308",
      "#f97316",
      "#a855f7",
      "#ec4899",
      "#06b6d4",
      "#14b8a6",
      "#ef4444",
      "#8b5cf6",
      "#10b981",
      "#f43f5e",
    ];

    confettiAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(200 + index * 60),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 120 + Math.random() * 100,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: (Math.random() - 0.5) * screenWidth * 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: (Math.random() - 0.5) * 6,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const confettiColors = [
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#f97316",
    "#a855f7",
    "#ec4899",
    "#06b6d4",
    "#14b8a6",
    "#ef4444",
    "#8b5cf6",
    "#10b981",
    "#f43f5e",
  ];

  return (
    <Screen innerClassName="px-0">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Confetti particles */}
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              top: 120,
              alignSelf: "center",
              width: index % 2 === 0 ? 10 : 8,
              height: index % 2 === 0 ? 10 : 14,
              borderRadius: index % 3 === 0 ? 5 : 2,
              backgroundColor: confettiColors[index],
              opacity: anim.opacity,
              transform: [
                { translateY: anim.translateY },
                { translateX: anim.translateX },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [-3, 3],
                    outputRange: ["-180deg", "180deg"],
                  }),
                },
              ],
            }}
          />
        ))}

        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center rounded-3xl bg-white p-8 shadow-[0_20px_45px_rgba(15,118,110,0.12)]"
        >
          {/* Success check mark */}
          <Animated.View
            style={{
              transform: [{ scale: checkAnim }],
            }}
            className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-green-50"
          >
            <View className="h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Feather name="check" size={44} color="#16a34a" />
            </View>
          </Animated.View>

          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Order confirmed
          </Text>
          <Text className="mt-3 text-center font-display text-3xl text-slate-900">
            Your fresh picks are on the way! 🎉
          </Text>
          <Text className="mt-4 text-center text-sm leading-6 text-slate-500">
            {order
              ? `Invoice #${order.invoice} · We'll notify you with every delivery update.`
              : "Sit back and relax while we prepare your delivery."}
          </Text>

          {order ? (
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                width: "100%",
              }}
              className="mt-6 rounded-3xl bg-slate-50 p-5"
            >
              <SummaryRow label="Order ID" value={order._id.slice(-8)} />
              <SummaryRow
                label="Total"
                value={formatCurrency(order.total, currency)}
                highlight
              />
              <SummaryRow label="Payment" value={order.paymentMethod} />
              <SummaryRow
                label="Status"
                value={
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }
              />
              {(order as any).trackingId && (
                <SummaryRow
                  label="Tracking ID"
                  value={(order as any).trackingId}
                  highlight
                />
              )}
            </Animated.View>
          ) : null}

          {/* Notification hint */}
          <View className="mt-5 flex-row items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
            <Feather name="bell" size={16} color="#0f766e" />
            <Text className="flex-1 text-xs leading-5 text-teal-700">
              You'll receive notifications for every delivery update. Check them
              anytime from the bell icon.
            </Text>
          </View>

          {/* Actions */}
          {(order as any)?.trackingId ? (
            <Button
              variant="primary"
              title="🚚  Track Your Order"
              className="mt-6 w-full"
              onPress={() =>
                router.replace({
                  pathname: "/tracking/[trackingId]",
                  params: { trackingId: (order as any).trackingId },
                })
              }
            />
          ) : (
            <Button
              variant="primary"
              title="View Order"
              className="mt-6 w-full"
              onPress={() => router.replace("/orders")}
            />
          )}
          <Button
            title="Continue Shopping"
            variant="outline"
            className="mt-3 w-full"
            onPress={() => router.replace("/(tabs)")}
          />
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const SummaryRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <View className="flex-row items-center justify-between py-1.5">
    <Text className="text-sm text-slate-500">{label}</Text>
    <Text
      className={`text-sm font-semibold ${highlight ? "text-teal-600" : "text-slate-900"}`}
    >
      {value}
    </Text>
  </View>
);
