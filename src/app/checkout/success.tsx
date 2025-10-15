import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/hooks/queries/useOrders";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();
  const { data: order } = useOrder(params.orderId);
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  return (
    <Screen innerClassName="px-0">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 80, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center rounded-3xl bg-white p-10 shadow-[0_20px_45px_rgba(15,118,110,0.12)]">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Order confirmed
          </Text>
          <Text className="mt-3 text-center font-display text-3xl text-slate-900">
            Your fresh picks are on the way!
          </Text>
          <Text className="mt-4 text-center text-sm text-slate-500">
            {order
              ? `Invoice ${order.invoice} · Expected delivery within 45 minutes`
              : "Sit back and relax while we prepare your delivery."}
          </Text>

          {order ? (
            <View className="mt-6 w-full space-y-3 rounded-3xl bg-slate-50 p-6">
              <SummaryRow label="Order ID" value={order._id.slice(-8)} />
              <SummaryRow
                label="Total"
                value={formatCurrency(order.total, currency)}
              />
              <SummaryRow label="Payment" value={order.paymentMethod} />
              <SummaryRow label="Status" value={order.status} />
            </View>
          ) : null}

          <Button
            title="Track order"
            className="mt-8 w-full"
            onPress={() => router.replace("/orders")}
          />
          <Button
            title="Continue shopping"
            variant="ghost"
            className="mt-3 w-full"
            onPress={() => router.replace("/(tabs)")}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const SummaryRow: React.FC<{ label: string; value: string }> = ({
  label,
  value
}) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-sm text-slate-500">{label}</Text>
    <Text className="text-sm font-semibold text-slate-900">{value}</Text>
  </View>
);
