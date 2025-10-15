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
  isCheckoutDisabled
}) => {
  const { subtotal } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const estimatedDelivery = subtotal > 0 ? "Arrives in 30-45 mins" : "";

  return (
    <View className="rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(15,118,110,0.1)]">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-600">
          Subtotal
        </Text>
        <Text className="text-xl font-bold text-slate-900">
          {formatCurrency(subtotal, currency)}
        </Text>
      </View>
      <Text className="mb-6 text-xs text-slate-500">{estimatedDelivery}</Text>
      <Button
        title="Proceed to Checkout"
        onPress={onCheckout}
        disabled={isCheckoutDisabled}
      />
    </View>
  );
};
