import { View, Text } from "react-native";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency } from "@/utils";

interface CartSummaryProps {
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckout,
  isCheckoutDisabled,
}) => {
  const { subtotal } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const estimatedDelivery = subtotal > 0 ? "Arrives in 30-45 mins" : "";

  return (
    <View className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_25px_60px_rgba(15,118,110,0.12)]">
      <View className="h-1.5 w-full bg-primary-200" />
      <View className="p-6">
        <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
          Order overview
        </Text>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-slate-600">
            Subtotal
          </Text>
          <Text className="text-2xl font-bold text-slate-900">
            {formatCurrency(subtotal, currency)}
          </Text>
        </View>
        <Text className="mt-2 text-xs text-slate-500">{estimatedDelivery}</Text>
        <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Delivery
          </Text>
          <Text className="text-sm font-semibold text-primary-600">Free</Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={onCheckout}
          disabled={isCheckoutDisabled}
          className="mt-6"
        />
      </View>
    </View>
  );
};
