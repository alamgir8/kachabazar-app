import { useEffect, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { EnhancedButton } from "@/components/ui";
import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { createOrder } from "@/services/orders";
import { formatCurrency } from "@/utils";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/utils/cn";

interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  shippingOption: string;
  paymentMethod: "Cash" | "Card" | "RazorPay";
}

const shippingOptions = [
  {
    value: "Standard",
    title: "Standard delivery",
    description: "Arrives within 30-45 minutes with temperature-controlled bags.",
  },
  {
    value: "Express",
    title: "Express priority",
    description: "Limited availability — prioritised picking and doorstep drop-off.",
  },
];

const paymentMethods = [
  {
    value: "Cash" as const,
    title: "Cash on delivery",
    description: "Pay with cash or mobile wallet when your shopper arrives.",
  },
  {
    value: "Card" as const,
    title: "Card (coming soon)",
    description: "Secure card payments launch shortly.",
  },
  {
    value: "RazorPay" as const,
    title: "Razorpay (coming soon)",
    description: "Frictionless UPI and wallet checkout.",
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    accessToken,
    upsertShippingAddress,
    shippingAddress,
  } = useAuth();
  const { items, subtotal, clearCart, isEmpty } = useCart();
  const { globalSetting } = useSettings();
  const currency = globalSetting?.default_currency ?? "$";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
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

  const mutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      if (!accessToken) throw new Error("You need to login to place an order.");

      const userInfo = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        contact: data.contact,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        zipCode: data.zipCode,
      };

      await upsertShippingAddress(userInfo);

      const orderPayload = {
        user_info: userInfo,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "pending" as const,
        cart: items,
        subTotal: subtotal,
        shippingCost: 0,
        discount: 0,
        total: subtotal,
      };

      return createOrder(orderPayload, accessToken);
    },
    onSuccess: async (order) => {
      await clearCart();
      router.replace({
        pathname: "/checkout/success",
        params: { orderId: order._id },
      });
    },
  });

  const onSubmit = (data: CheckoutFormValues) => mutation.mutate(data);

  if (!isAuthenticated) {
    return (
      <Screen className="px-4 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-[0_15px_35px_rgba(15,118,110,0.1)]">
          <Text className="text-lg font-semibold text-slate-900">
            Almost there!
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Please sign in to finalize your order and keep your history synced.
          </Text>
          <EnhancedButton
            title="Login"
            className="mt-6"
            glass={true}
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </Screen>
    );
  }

  if (isEmpty) {
    return (
      <Screen className="px-4 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-[0_15px_35px_rgba(15,118,110,0.1)]">
          <Text className="text-lg font-semibold text-slate-900">
            Your cart is empty
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Add a few delicious items before you checkout.
          </Text>
          <EnhancedButton
            title="Browse products"
            className="mt-6"
            glass={true}
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push("/search")}
          />
        </View>
      </Screen>
    );
  }

  if (!user) {
    return <LoadingState message="Preparing checkout..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      className="flex-1"
    >
      <Screen
        scrollable
        edges={["bottom"]}
        contentContainerClassName="gap-8 pb-28"
      >
        <View className="flex-row items-center justify-between">
          <BackButton />
          <View className="flex-1 pl-3">
            <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-primary-500">
              Checkout
            </Text>
            <Text className="mt-1 font-display text-[28px] font-extrabold text-slate-900">
              Almost there
            </Text>
            <Text className="mt-1 text-[12px] text-slate-500">
              Provide delivery details and confirm your order.
            </Text>
          </View>
        </View>

        <CheckoutSection
          eyebrow="Shipping details"
          headline="Where should we deliver?"
          description="Double-check your contact info so we can hand off your groceries without a hitch."
        >
          <View>
            <View className="flex-row gap-4">
              <Controller
                control={control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInputField
                    label="First name"
                    placeholder="John"
                    value={value}
                    onChangeText={onChange}
                    error={errors.firstName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInputField
                    label="Last name"
                    placeholder="Doe"
                    value={value}
                    onChangeText={onChange}
                    error={errors.lastName?.message}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="Email"
                  placeholder="you@example.com"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="contact"
              rules={{ required: "Contact number is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="Contact number"
                  placeholder="+1 234 567 890"
                  value={value}
                  onChangeText={onChange}
                  error={errors.contact?.message}
                  keyboardType="phone-pad"
                />
              )}
            />
          </View>
        </CheckoutSection>

        <CheckoutSection
          eyebrow="Delivery address"
          headline="Where should the groceries go?"
          description="Accurate address details help us get your groceries to you on time."
        >
          <View>
            <Controller
              control={control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="Address"
                  placeholder="123 Greenway Ave"
                  value={value}
                  onChangeText={onChange}
                  error={errors.address?.message}
                />
              )}
            />

            <View className="flex-row gap-4">
              <Controller
                control={control}
                name="city"
                rules={{ required: "City is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInputField
                    label="City"
                    placeholder="San Francisco"
                    value={value}
                    onChangeText={onChange}
                    error={errors.city?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="country"
                rules={{ required: "Country is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInputField
                    label="Country"
                    placeholder="USA"
                    value={value}
                    onChangeText={onChange}
                    error={errors.country?.message}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="zipCode"
              rules={{ required: "ZIP code is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="ZIP code"
                  placeholder="94105"
                  value={value}
                  onChangeText={onChange}
                  error={errors.zipCode?.message}
                />
              )}
            />
          </View>
        </CheckoutSection>

        <CheckoutSection
          eyebrow="Delivery preferences"
          headline="Choose your shipping & payment"
          description="Cash on delivery is available right now; more options coming soon."
        >
          <View className="space-y-4">
            <Controller
              control={control}
              name="shippingOption"
              render={({ field: { onChange, value } }) => (
                <View className="space-y-3">
                  {shippingOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => onChange(option.value)}
                      className={cn(
                        "rounded-[28px] border px-4 py-4",
                        value === option.value
                          ? "border-primary-500 bg-emerald-50/60"
                          : "border-slate-200 bg-white/70"
                      )}
                    >
                      <Text className="text-[15px] font-bold text-slate-900">
                        {option.title}
                      </Text>
                      <Text className="mt-1 text-[12px] leading-relaxed text-slate-600">
                        {option.description}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { onChange, value } }) => (
                <View className="space-y-3">
                  {paymentMethods.map((method) => (
                    <PaymentOption
                      key={method.value}
                      title={method.title}
                      description={method.description}
                      active={value === method.value}
                      disabled={method.value !== "Cash"}
                      onPress={() => onChange(method.value)}
                    />
                  ))}
                </View>
              )}
            />
          </View>
        </CheckoutSection>

        <CheckoutSection
          eyebrow="Order summary"
          headline="Review and confirm"
          description="Check your totals before placing the order."
        >
          <View>
            <View className="space-y-3">
              <SummaryRow
                label="Subtotal"
                value={formatCurrency(subtotal, currency)}
              />
              <SummaryRow label="Delivery" value="Free" />
              <SummaryRow
                label="Discount"
                value={formatCurrency(0, currency)}
              />
            </View>
            <View className="mt-4 flex-row items-center justify-between rounded-[28px] bg-emerald-50/60 px-4 py-4 shadow-sm">
              <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary-600">
                Total due today
              </Text>
              <Text className="font-display text-[30px] font-extrabold text-slate-900">
                {formatCurrency(subtotal, currency)}
              </Text>
            </View>
            <EnhancedButton
              title={mutation.isPending ? "Placing order..." : "Confirm order"}
              className="mt-6 rounded-full"
              contentClassName="gap-2"
              glass
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSubmit(onSubmit)}
              loading={mutation.isPending}
            />
          </View>
        </CheckoutSection>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const CheckoutSection = ({
  eyebrow,
  headline,
  description,
  children,
}: {
  eyebrow: string;
  headline: string;
  description?: string;
  children: ReactNode;
}) => (
  <View
    className="overflow-hidden rounded-[36px] border border-white/70 bg-white/96 px-5 py-6"
    style={{
      shadowColor: "rgba(15,118,110,0.14)",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.16,
      shadowRadius: 28,
      elevation: 12,
    }}
  >
    <Text className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary-500">
      {eyebrow}
    </Text>
    <Text className="mt-2 font-display text-[24px] font-extrabold text-slate-900">
      {headline}
    </Text>
    {description ? (
      <Text className="mt-2 text-[13px] leading-relaxed text-slate-500">
        {description}
      </Text>
    ) : null}
    <View className="mt-5">{children}</View>
  </View>
);

const TextInputField: React.FC<
  {
    label: string;
    error?: string;
  } & React.ComponentProps<typeof TextInput>
> = ({ label, error, className, ...props }) => (
  <View className="mb-4 flex-1">
    <Text className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </Text>
    <TextInput
      className={cn(
        "rounded-[26px] border px-4 py-3.5 text-[15px] text-slate-900 shadow-[0_12px_24px_rgba(15,118,110,0.08)]",
        error
          ? "border-rose-400 bg-rose-50/40"
          : "border-white/70 bg-white/96",
        className
      )}
      placeholderTextColor="#94a3b8"
      {...props}
    />
    {error ? (
      <Text className="mt-1.5 text-xs text-rose-500">{error}</Text>
    ) : null}
  </View>
);

const SummaryRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-[13px] font-semibold text-slate-600">{label}</Text>
    <Text className="text-[15px] font-bold text-slate-900">{value}</Text>
  </View>
);

const PaymentOption: React.FC<{
  title: string;
  description: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}> = ({ title, description, active, disabled, onPress }) => (
  <Pressable
    onPress={disabled ? undefined : onPress}
    className={cn(
      "flex-row items-center rounded-[28px] border px-4 py-4",
      active
        ? "border-primary-500 bg-emerald-50/60"
        : "border-white/70 bg-white/95",
      disabled ? "opacity-50" : "active:bg-primary-50/60"
    )}
    >
    <View className="flex-1 pr-3">
      <Text className="text-[15px] font-bold text-slate-900">{title}</Text>
      <Text className="mt-1 text-[13px] leading-relaxed text-slate-600">
        {description}
      </Text>
      {disabled ? (
        <View className="mt-2 inline-flex self-start rounded-full bg-amber-50 px-2.5 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            Coming soon
          </Text>
        </View>
      ) : null}
    </View>
    <View
      className={cn(
        "h-7 w-7 items-center justify-center rounded-full border-2",
        active ? "border-primary-500 bg-white" : "border-slate-300 bg-white"
      )}
    >
      {active ? (
        <View className="h-3.5 w-3.5 rounded-full bg-primary-500" />
      ) : null}
    </View>
  </Pressable>
);
