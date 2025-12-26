import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { createOrder } from "@/services/orders";
import { type Coupon } from "@/services/coupons";
import { notifyAuthError } from "@/services/api-client";
import { HapticFeedback } from "@/utils/accessibility";
import { checkoutSchema } from "@/utils/validation";

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const useCheckoutSubmit = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    accessToken,
    upsertShippingAddress,
    shippingAddress,
  } = useAuth();
  const { items, clearCart, isEmpty } = useCart();
  const { globalSetting } = useSettings();

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [couponInfo, setCouponInfo] = useState<Coupon | null>(null);
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState<any>(null);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const currency = globalSetting?.default_currency || "$";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email ?? "",
      contact: user?.phone ?? "",
      address: shippingAddress?.address ?? "",
      city: shippingAddress?.city ?? "",
      country: shippingAddress?.country ?? "",
      zipCode: shippingAddress?.zipCode ?? "",
      shippingOption: "Standard",
      paymentMethod: "Cash",
    },
  });
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const [firstName, ...last] = user.name.split(" ");
      setValue("firstName", firstName ?? "");
      setValue("lastName", last.join(" ") ?? "");
      setValue("email", user.email);
      if (user.phone) setValue("contact", user.phone);
    }
    if (shippingAddress) {
      if (shippingAddress.address) setValue("address", shippingAddress.address);
      if (shippingAddress.city) setValue("city", shippingAddress.city);
      if (shippingAddress.country) setValue("country", shippingAddress.country);
      if (shippingAddress.zipCode) setValue("zipCode", shippingAddress.zipCode);
    }
  }, [shippingAddress, user, setValue]);

  // Calculate total and discount
  useEffect(() => {
    let totalValue = 0;
    const subTotal = Number(cartTotal + shippingCost);

    let calculatedDiscount = 0;
    if (discountPercentage) {
      calculatedDiscount =
        discountPercentage.type === "fixed"
          ? discountPercentage.value
          : subTotal * (discountPercentage.value / 100);
    }

    totalValue = subTotal - calculatedDiscount;
    setDiscountAmount(calculatedDiscount);
    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage]);

  // Remove coupon if total < minimum amount
  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(null);
      setCouponInfo(null);
      setIsCouponApplied(false);
    }
  }, [minimumAmount, total, isEmpty, discountAmount]);

  const handleShippingCost = (value: number) => {
    setShippingCost(value);
  };

  const handleCouponApplied = (discount: number, coupon: Coupon | null) => {
    if (coupon) {
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
      setIsCouponApplied(true);
    } else {
      setCouponInfo(null);
      setDiscountPercentage(null);
      setMinimumAmount(0);
      setIsCouponApplied(false);
    }
  };

  const submitHandler = async (data: CheckoutInput) => {
    if (!isAuthenticated || !accessToken) {
      notifyAuthError();
      return;
    }

    setIsCheckoutSubmit(true);
    setError("");

    try {
      const userDetails = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        contact: data.contact,
        email: data.email,
        address: data.address,
        country: data.country,
        city: data.city,
        zipCode: data.zipCode,
      };

      // Save shipping address
      await upsertShippingAddress(userDetails);

      const orderInfo = {
        user_info: userDetails,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "pending" as const,
        cart: items,
        subTotal: cartTotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        total: total,
        coupon: couponInfo?.couponCode,
      };

      // Handle payment methods
      if (data.paymentMethod === "Cash") {
        const orderResponse = await createOrder(orderInfo, accessToken);

        // Handle success
        HapticFeedback.success();
        await clearCart();
        router.replace({
          pathname: "/checkout/success",
          params: { orderId: orderResponse._id },
        });
      } else {
        // Placeholder for other payment methods
        Alert.alert("Coming Soon", "This payment method is not yet available.");
        setIsCheckoutSubmit(false);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Checkout failed");
      Alert.alert("Error", err.message || "Failed to place order");
      setIsCheckoutSubmit(false);
      HapticFeedback.error();
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    submitHandler,
    handleShippingCost,
    handleCouponApplied,
    couponInfo,
    discountAmount,
    total,
    shippingCost,
    isCheckoutSubmit,
    isAuthenticated,
    isEmpty,
    items,
    cartTotal,
    currency,
    user,
  };
};
