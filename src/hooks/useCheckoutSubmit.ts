import { useState, useEffect, useMemo } from "react";
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

const showingTranslateValue = (data: any) => {
  if (data !== undefined && typeof data === "object") {
    return data?.en || Object.values(data)[0];
  }
  return data;
};

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
  const { globalSetting, storeSetting, storeCustomization } = useSettings();

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

  // Dynamic Shipping Options
  const checkout = storeCustomization?.checkout as
    | Record<string, any>
    | undefined;

  const shippingOptions = useMemo(
    () => [
      {
        value: showingTranslateValue(checkout?.shipping_name_one) || "Standard",
        title:
          showingTranslateValue(checkout?.shipping_name_one) ||
          "Standard Delivery",
        description:
          showingTranslateValue(checkout?.shipping_one_desc) ||
          "Delivery within 7-10 days",
        cost: Number(checkout?.shipping_one_cost) || 0,
      },
      {
        value: showingTranslateValue(checkout?.shipping_name_two) || "Express",
        title:
          showingTranslateValue(checkout?.shipping_name_two) ||
          "Express Delivery",
        description:
          showingTranslateValue(checkout?.shipping_two_desc) ||
          "Delivery within 2-3 days",
        cost: Number(checkout?.shipping_two_cost) || 15,
      },
    ],
    [checkout]
  );

  // Dynamic Payment Methods
  const paymentMethods = [
    {
      value: "Cash",
      title: "Cash on Delivery",
      description: "Pay with cash upon delivery.",
      enabled: storeSetting?.cod_status,
    },
    {
      value: "Card",
      title: "Credit/Debit Card",
      description: "Pay securely with your card.",
      enabled: storeSetting?.stripe_status,
    },
    {
      value: "RazorPay",
      title: "RazorPay",
      description: "Pay securely with RazorPay.",
      enabled: storeSetting?.razorpay_status,
    },
    {
      value: "PayPal",
      title: "PayPal",
      description: "Pay securely with PayPal.",
      enabled: storeSetting?.paypal_status,
    },
  ].filter((method) => method.enabled);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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
      shippingOption: shippingOptions[0]?.value,
      paymentMethod: paymentMethods[0]?.value || "Cash",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const selectedShippingOption = watch("shippingOption");

  useEffect(() => {
    const option = shippingOptions.find(
      (o) => o.value === selectedShippingOption
    );
    if (option) {
      setShippingCost(option.cost);
    }
  }, [selectedShippingOption, shippingOptions]);

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
        const orderResponse = await createOrder(orderInfo);

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
    shippingOptions,
    paymentMethods,
  };
};
