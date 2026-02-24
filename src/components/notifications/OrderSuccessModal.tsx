/**
 * OrderSuccessModal — Beautiful animated modal shown after successful order placement
 * Displays confetti-style animation with order details and tracking info
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface OrderSuccessModalProps {
  visible: boolean;
  onDismiss: () => void;
  onTrackOrder: () => void;
  onContinueShopping: () => void;
  orderInvoice?: number | string;
  orderTotal?: string;
  trackingId?: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  visible,
  onDismiss,
  onTrackOrder,
  onContinueShopping,
  orderInvoice,
  orderTotal,
  trackingId,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 8 }, () => ({
      translateY: new Animated.Value(-20),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      checkAnim.setValue(0);

      // Main card animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Check mark bounce
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(checkAnim, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Confetti particles
      const screenWidth = Dimensions.get("window").width;
      confettiAnims.forEach((anim, index) => {
        anim.translateY.setValue(-20);
        anim.translateX.setValue(0);
        anim.opacity.setValue(0);

        Animated.sequence([
          Animated.delay(400 + index * 80),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: 80 + Math.random() * 60,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: (Math.random() - 0.5) * screenWidth * 0.5,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: (Math.random() - 0.5) * 4,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [visible]);

  const confettiColors = [
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#f97316",
    "#a855f7",
    "#ec4899",
    "#06b6d4",
    "#14b8a6",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        {/* Confetti particles */}
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              top: "35%",
              alignSelf: "center",
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: confettiColors[index],
              opacity: anim.opacity,
              transform: [
                { translateY: anim.translateY },
                { translateX: anim.translateX },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [-2, 2],
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
            width: "100%",
          }}
          className="rounded-3xl bg-white shadow-2xl"
        >
          {/* Top success section */}
          <View className="items-center px-6 pt-10 pb-6">
            <Animated.View
              style={{
                transform: [{ scale: checkAnim }],
              }}
              className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-green-50"
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Feather name="check" size={36} color="#16a34a" />
              </View>
            </Animated.View>

            <Text className="text-center text-2xl font-black text-slate-900">
              Order Confirmed! 🎉
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
              Your fresh picks are being prepared. We'll notify you with every
              update.
            </Text>
          </View>

          {/* Order info */}
          <View className="mx-6 rounded-2xl bg-slate-50 p-4">
            {orderInvoice && (
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-medium text-slate-400">
                  Invoice
                </Text>
                <Text className="text-sm font-bold text-slate-700">
                  #{orderInvoice}
                </Text>
              </View>
            )}
            {orderTotal && (
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-medium text-slate-400">
                  Total
                </Text>
                <Text className="text-sm font-black text-teal-600">
                  {orderTotal}
                </Text>
              </View>
            )}
            {trackingId && (
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-medium text-slate-400">
                  Tracking ID
                </Text>
                <View className="flex-row items-center gap-1">
                  <Feather name="navigation" size={12} color="#0f766e" />
                  <Text className="text-sm font-bold text-teal-600">
                    {trackingId}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View className="gap-3 px-6 pt-6 pb-8">
            <Pressable
              onPress={onTrackOrder}
              className="items-center rounded-2xl bg-teal-600 py-4 active:opacity-80"
              style={{
                shadowColor: "#0f766e",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center gap-2">
                <Feather name="navigation" size={18} color="#fff" />
                <Text className="text-sm font-bold text-white">
                  Track Your Order
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onContinueShopping}
              className="items-center rounded-2xl border border-slate-200 bg-white py-4 active:opacity-80"
            >
              <Text className="text-sm font-semibold text-slate-600">
                Continue Shopping
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
