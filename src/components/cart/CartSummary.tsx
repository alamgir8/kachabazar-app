import { View, Text } from "react-native";

import { CMButton } from "@/components/ui/CMButton";
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
    <View className="overflow-hidden rounded-[36px] border border-white/80 bg-white/96 shadow-[0_24px_65px_rgba(15,118,110,0.14)]">
      <View className="px-6 py-6">
        <Text className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary-500">
          Order overview
        </Text>

        <View className="mt-4 rounded-[28px] border border-emerald-50 bg-emerald-50/60 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-semibold text-slate-600">
              Items subtotal
            </Text>
            <Text className="text-[16px] font-bold text-slate-900">
              {formatCurrency(subtotal, currency)}
            </Text>
          </View>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-[13px] font-semibold text-slate-600">
              Delivery
            </Text>
            <Text className="text-[14px] font-semibold text-primary-600">
              Free
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row items-center justify-between">
          <View>
            <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Total
            </Text>
            <Text className="mt-1 font-display text-[30px] font-extrabold text-slate-900">
              {formatCurrency(subtotal, currency)}
            </Text>
            <Text className="mt-1 text-[12px] text-slate-400">
              {estimatedDelivery}
            </Text>
          </View>
          <View className="rounded-full bg-primary-500/10 px-3 py-1.5">
            <Text className="text-[11px] font-semibold uppercase tracking-widest text-primary-600">
              Free delivery
            </Text>
          </View>
        </View>

        <CMButton
          title="Proceed to Checkout"
          onPress={onCheckout}
          disabled={isCheckoutDisabled}
          className="mt-6 rounded-full"
          glass
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};
