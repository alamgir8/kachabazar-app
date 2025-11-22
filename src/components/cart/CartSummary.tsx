import { View, Text } from "react-native";

import { formatCurrency } from "@/utils";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";

interface CartSummaryProps {
  onCheckout?: () => void;
  isCheckoutDisabled?: boolean;
  showButton?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({}) => {
  const { subtotal } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  return (
    <View className="overflow-hidden rounded-[36px] bg-white/96 shadow-[0_24px_65px_rgba(15,118,110,0.14)]">
      <View className="px-1 py-4">
        <View className="mt-5 flex-row items-center justify-between">
          <View>
            <Text className="mt-1 font-display text-[20px] tracking-[0.2em] font-extrabold text-emerald-700">
              Total
            </Text>
          </View>
          <View className="rounded-full bg-primary-500/10 px-3 py-1.5">
            <Text className="text-[18px] font-semibold uppercase tracking-widest text-primary-600">
              {formatCurrency(subtotal, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
