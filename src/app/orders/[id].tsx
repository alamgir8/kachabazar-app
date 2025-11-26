import { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { useOrder } from "@/hooks/queries/useOrders";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui";
import { exportOrderInvoicePdf } from "@/services/order-invoice-pdf";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);

  // Refetch order when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && user && id) {
        refetch();
      }
    }, [isAuthenticated, user, id, refetch])
  );

  const handleDownloadInvoice = async () => {
    if (!order) {
      Alert.alert("Error", "Order not found to export invoice.");
      return;
    }

    try {
      setDownloading(true);

      await exportOrderInvoicePdf({
        order,
        currency,
        shopName:
          typeof globalSetting?.site_name === "string"
            ? globalSetting.site_name
            : "Invoice",
        shopAddress: globalSetting?.address,
      });

      // Sharing dialog already gives UX feedback, no extra alert needed
    } catch (error) {
      console.error("Invoice export error:", error);
      Alert.alert(
        "Error",
        "Could not generate the invoice PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleEmailInvoice = async () => {
    if (!order?.user_info?.email) {
      Alert.alert("Error", "No email address found for this order.");
      return;
    }

    try {
      setEmailing(true);

      const subject = encodeURIComponent(`Invoice #${order.invoice}`);
      const body = encodeURIComponent(
        `Hello,\n\nPlease find attached your invoice for order #${
          order.invoice
        }.\n\nTotal: ${formatCurrency(
          order.total,
          currency
        )}\n\nThank you for your order!`
      );

      const mailtoUrl = `mailto:${order.user_info.email}?subject=${subject}&body=${body}`;

      const canOpen = await Linking.canOpenURL(mailtoUrl);

      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          "Error",
          "Unable to open email client. Please ensure you have an email app installed."
        );
      }
    } catch (error) {
      console.error("Email error:", error);
      Alert.alert("Error", "Could not open email client.");
    } finally {
      setTimeout(() => setEmailing(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <Screen className="items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="mt-4 text-sm text-slate-500">
          Loading order details...
        </Text>
      </Screen>
    );
  }

  if (isError || !order) {
    return (
      <Screen className="bg-slate-50 px-5 pt-24">
        <BackButton subTitle="Order Details" />
        <View className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Feather name="alert-circle" size={28} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-slate-900">
            Unable to load order
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-slate-600">
            The order may have been removed or you might not have access. Please
            try again or go back.
          </Text>
          <Button
            variant="outline"
            title="Try again"
            className="mt-6"
            onPress={() => refetch()}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={["bottom"]} className="bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 8,
          paddingHorizontal: 8,
        }}
      >
        <View className="px-1">
          {/* Back Button */}
          <BackButton
            subTitle="Order Details"
            subDescription={`Invoice #${order.invoice ?? "--"}`}
          />
          <View className="h-4" />

          {/* Order Header Card with Gradient */}
          <View
            className="mb-4 overflow-hidden rounded-3xl bg-white shadow-lg"
            style={{
              shadowColor: "#0f766e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={
                order.status === "delivered"
                  ? ["#10b981", "#059669"]
                  : order.status === "pending"
                    ? ["#f59e0b", "#d97706"]
                    : order.status === "processing"
                      ? ["#3b82f6", "#2563eb"]
                      : ["#64748b", "#475569"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-6 py-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-white/80">
                    Order Total
                  </Text>
                  <Text className="mt-1 text-3xl font-black text-white">
                    {formatCurrency(order.total, currency)}
                  </Text>
                  <Text className="mt-2 text-xs text-white/90">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <View className="items-center rounded-2xl bg-white/20 px-4 py-3">
                  <Feather
                    name={
                      order.status === "delivered"
                        ? "check-circle"
                        : order.status === "pending"
                          ? "clock"
                          : order.status === "processing"
                            ? "truck"
                            : "package"
                    }
                    size={24}
                    color="#fff"
                  />
                  <Text className="mt-1.5 text-[10px] font-black uppercase text-white">
                    {order.status}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Payment & Invoice Actions */}
            <View className="px-6 py-5">
              <View className="mb-4 flex-row items-center gap-2">
                <Feather name="credit-card" size={16} color="#64748b" />
                <Text className="text-sm font-semibold text-slate-600">
                  {order.paymentMethod}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleDownloadInvoice}
                  disabled={downloading}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-3 active:opacity-80"
                  style={{
                    shadowColor: "#0f766e",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                    opacity: downloading ? 0.7 : 1,
                  }}
                >
                  {downloading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Feather name="download" size={18} color="#fff" />
                  )}
                  <Text className="text-sm font-bold text-white">
                    {downloading ? "Generating..." : "Download"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleEmailInvoice}
                  disabled={emailing}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-teal-500 bg-white px-4 py-3 active:opacity-80"
                  style={{
                    opacity: emailing ? 0.7 : 1,
                  }}
                >
                  {emailing ? (
                    <ActivityIndicator size="small" color="#0f766e" />
                  ) : (
                    <Feather name="mail" size={18} color="#0f766e" />
                  )}
                  <Text className="text-sm font-bold text-teal-600">
                    {emailing ? "Opening..." : "Email"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Delivery Information */}
          <View
            className="mb-4 rounded-3xl bg-white p-6 shadow-lg"
            style={{
              shadowColor: "#0f766e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View className="mb-4 flex-row items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="map-pin" size={20} color="#0f766e" />
              </View>
              <Text className="text-lg font-bold text-slate-900">
                Delivery Information
              </Text>
            </View>

            <View className="rounded-2xl bg-slate-50 p-4">
              <View className="mb-3 flex-row items-center gap-2">
                <Feather name="user" size={16} color="#64748b" />
                <Text className="text-sm font-semibold text-slate-900">
                  {order.user_info?.name}
                </Text>
              </View>
              <View className="mb-3 flex-row items-center gap-2">
                <Feather name="phone" size={16} color="#64748b" />
                <Text className="text-sm text-slate-600">
                  {order.user_info?.contact}
                </Text>
              </View>
              <View className="mb-3 flex-row items-center gap-2">
                <Feather name="mail" size={16} color="#64748b" />
                <Text className="text-sm text-slate-600">
                  {order.user_info?.email}
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Feather name="map-pin" size={16} color="#64748b" />
                <View className="flex-1">
                  <Text className="text-sm text-slate-600">
                    {order.user_info?.address}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-600">
                    {[order.user_info?.city, order.user_info?.country]
                      .filter(Boolean)
                      .join(", ")}{" "}
                    {order.user_info?.zipCode}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <View
            className="mb-4 rounded-3xl bg-white p-6 shadow-lg"
            style={{
              shadowColor: "#0f766e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View className="mb-4 flex-row items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="shopping-bag" size={20} color="#0f766e" />
              </View>
              <Text className="text-lg font-bold text-slate-900">
                Order Items ({order.cart.length})
              </Text>
            </View>

            <View className="space-y-3">
              {order.cart.map((item: any, index: number) => (
                <View
                  key={item.id ?? item.productId ?? `${item.slug ?? index}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-slate-900">
                        {item.title}
                      </Text>
                      <View className="mt-2 flex-row items-center gap-1">
                        <View className="rounded-full bg-slate-200 px-2 py-0.5">
                          <Text className="text-xs font-semibold text-slate-700">
                            Qty: {item.quantity}
                          </Text>
                        </View>
                        <Text className="text-xs text-slate-500">×</Text>
                        <Text className="text-xs text-slate-600">
                          {formatCurrency(item.price, currency)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-base font-black text-teal-600">
                      {formatCurrency(item.itemTotal, currency)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <View className="mt-6 space-y-3 border-t border-slate-100 pt-4">
              <DetailRow
                label="Subtotal"
                value={formatCurrency(order.subTotal, currency)}
              />
              <DetailRow
                label="Shipping"
                value={
                  order.shippingCost
                    ? formatCurrency(order.shippingCost, currency)
                    : "Free"
                }
              />
              {order.discount && order.discount > 0 && (
                <DetailRow
                  label="Discount"
                  value={`-${formatCurrency(order.discount, currency)}`}
                  valueColor="text-green-600"
                />
              )}

              <View className="mt-4 rounded-2xl bg-teal-50 p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-bold uppercase text-teal-900">
                    Total Paid
                  </Text>
                  <Text className="text-2xl font-black text-teal-600">
                    {formatCurrency(order.total, currency)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const DetailRow: React.FC<{
  label: string;
  value?: string | number | null;
  valueColor?: string;
}> = ({ label, value, valueColor = "text-slate-900" }) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-sm font-medium text-slate-600">{label}</Text>
    <Text className={`text-sm font-bold ${valueColor}`}>{value ?? "--"}</Text>
  </View>
);
