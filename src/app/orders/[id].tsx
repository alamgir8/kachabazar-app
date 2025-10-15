import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton } from "@/components/ui";
import { useOrder } from "@/hooks/queries/useOrders";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  if (isLoading) {
    return (
      <Screen className="px-5 pt-24">
        <Text className="text-sm text-slate-500">Loading order details...</Text>
      </Screen>
    );
  }

  if (isError || !order) {
    return (
      <Screen className="px-5 pt-24">
        <View className="rounded-3xl bg-white p-8 shadow-[0_15px_40px_rgba(15,118,110,0.1)]">
          <Text className="text-lg font-semibold text-slate-900">
            Unable to fetch this order
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            The order may have been archived or you might not have access.
          </Text>
          <EnhancedButton
            title="Try again"
            className="mt-4"
            onPress={() => refetch()}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen innerClassName="px-0" scrollable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 140,
          paddingTop: 32,
        }}
      >
        <View className="rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Order summary
          </Text>
          <Text className="mt-2 font-display text-3xl text-slate-900">
            Invoice {order.invoice ?? "--"}
          </Text>
          <View className="mt-4 space-y-2">
            <DetailRow label="Status" value={order.status} />
            <DetailRow
              label="Placed on"
              value={new Date(order.createdAt).toLocaleString()}
            />
            <DetailRow
              label="Payment"
              value={`${order.paymentMethod} · ${formatCurrency(order.total, currency)}`}
            />
          </View>
        </View>

        <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
          <Text className="text-base font-semibold text-slate-900">
            Delivery information
          </Text>
          <View className="mt-3 space-y-1">
            <Text className="text-sm text-slate-600">
              {order.user_info?.name}
            </Text>
            <Text className="text-sm text-slate-600">
              {order.user_info?.contact}
            </Text>
            <Text className="text-sm text-slate-600">
              {order.user_info?.email}
            </Text>
            <Text className="text-sm text-slate-600">
              {order.user_info?.address}
            </Text>
            <Text className="text-sm text-slate-600">
              {[order.user_info?.city, order.user_info?.country]
                .filter(Boolean)
                .join(", ")}{" "}
              {order.user_info?.zipCode}
            </Text>
          </View>
        </View>

        <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,118,110,0.1)]">
          <Text className="text-base font-semibold text-slate-900">
            Items ({order.cart.length})
          </Text>
          <View className="mt-4 space-y-4">
            {order.cart.map((item: any, index: number) => (
              <View
                key={item.id ?? item.productId ?? `${item.slug ?? index}`}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <Text className="text-sm font-semibold text-slate-900">
                  {item.name}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  {item.quantity} × {formatCurrency(item.price, currency)}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-slate-900">
                  {formatCurrency(item.subtotal, currency)}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-6 space-y-2">
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
            <DetailRow
              label="Discount"
              value={formatCurrency(order.discount ?? 0, currency)}
            />
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-sm font-semibold uppercase text-slate-500">
                Total paid
              </Text>
              <Text className="text-2xl font-bold text-slate-900">
                {formatCurrency(order.total, currency)}
              </Text>
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
}> = ({ label, value }) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-sm text-slate-500">{label}</Text>
    <Text className="text-sm font-semibold text-slate-900">
      {value ?? "--"}
    </Text>
  </View>
);
