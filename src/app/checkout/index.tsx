import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { createOrder } from "@/services/orders";
import { formatCurrency } from "@/utils";
import { BackButton } from "@/components/ui/BackButton";

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
      <Screen className="px-5 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-[0_15px_35px_rgba(15,118,110,0.1)]">
          <Text className="text-lg font-semibold text-slate-900">
            Almost there!
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Please sign in to finalize your order and keep your history synced.
          </Text>
          <Button
            title="Login"
            className="mt-6"
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </Screen>
    );
  }

  if (isEmpty) {
    return (
      <Screen className="px-5 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-[0_15px_35px_rgba(15,118,110,0.1)]">
          <Text className="text-lg font-semibold text-slate-900">
            Your cart is empty
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Add a few delicious items before you checkout.
          </Text>
          <Button
            title="Browse products"
            className="mt-6"
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
      <Screen innerClassName="px-0" scrollable>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}
        >
          <View className="mt-6">
            <BackButton />
          </View>

          <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_40px_rgba(15,118,110,0.08)]">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Shipping Details
            </Text>
            <Text className="mt-2 font-display text-3xl text-slate-900">
              Where should we deliver?
            </Text>

            <View className="mt-6 flex-row space-x-4">
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
                  placeholder="john@kachabazar.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="contact"
              rules={{ required: "Contact number is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="Phone number"
                  placeholder="(+880)"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  error={errors.contact?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="Street address"
                  placeholder="House 57, Road 25, Gulshan"
                  value={value}
                  onChangeText={onChange}
                  error={errors.address?.message}
                />
              )}
            />

            <View className="mt-2 flex-row space-x-4">
              <Controller
                control={control}
                name="city"
                rules={{ required: "City is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInputField
                    label="City"
                    placeholder="Dhaka"
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
                    placeholder="Bangladesh"
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
                  label="Postal code"
                  placeholder="1212"
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  error={errors.zipCode?.message}
                />
              )}
            />
          </View>

          <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_40px_rgba(15,118,110,0.08)]">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Payment
            </Text>
            <Text className="mt-2 font-display text-3xl text-slate-900">
              Choose how to pay
            </Text>

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { onChange, value } }) => (
                <View className="mt-6 space-y-3">
                  {[
                    {
                      value: "Cash" as const,
                      title: "Cash on delivery",
                      description:
                        "Pay with cash or mobile wallet upon arrival",
                    },
                    {
                      value: "Card" as const,
                      title: "Card (coming soon)",
                      description: "Securely pay with Visa, Mastercard",
                    },
                    {
                      value: "RazorPay" as const,
                      title: "Razorpay (coming soon)",
                      description: "Frictionless UPI & wallet payments",
                    },
                  ].map((method) => (
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

          <View className="mt-6 rounded-3xl bg-white p-6 shadow-[0_15px_40px_rgba(15,118,110,0.08)]">
            <Text className="text-base font-semibold text-slate-900">
              Order summary
            </Text>
            <View className="mt-4 space-y-3">
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
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-sm font-semibold uppercase text-slate-500">
                Total due today
              </Text>
              <Text className="text-2xl font-bold text-slate-900">
                {formatCurrency(subtotal, currency)}
              </Text>
            </View>
            <Button
              title={mutation.isPending ? "Placing order..." : "Confirm order"}
              className="mt-6"
              onPress={handleSubmit(onSubmit)}
              loading={mutation.isPending}
            />
          </View>
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const TextInputField: React.FC<
  {
    label: string;
    error?: string;
  } & React.ComponentProps<typeof TextInput>
> = ({ label, error, className, ...props }) => (
  <View className="mb-4 flex-1">
    <Text className="mb-2 text-xs font-semibold uppercase text-slate-500">
      {label}
    </Text>
    <TextInput
      className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 shadow-[0_8px_20px_rgba(15,118,110,0.05)] ${className ?? ""}`}
      placeholderTextColor="#94a3b8"
      {...props}
    />
    {error ? <Text className="mt-1 text-xs text-rose-500">{error}</Text> : null}
  </View>
);

const SummaryRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-sm text-slate-500">{label}</Text>
    <Text className="text-sm font-semibold text-slate-900">{value}</Text>
  </View>
);

const PaymentOption: React.FC<{
  title: string;
  description: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}> = ({ title, description, active, disabled, onPress }) => (
  <View
    className={`rounded-3xl border px-4 py-4 ${
      active ? "border-primary-500 bg-primary-50" : "border-slate-200 bg-white"
    } ${disabled ? "opacity-60" : ""}`}
  >
    <Text className="text-base font-semibold text-slate-900">{title}</Text>
    <Text className="mt-1 text-sm text-slate-500">{description}</Text>
    <Button
      title={disabled ? "Coming soon" : active ? "Selected" : "Choose"}
      variant={active ? "primary" : "ghost"}
      className="mt-3"
      disabled={disabled}
      onPress={onPress}
    />
  </View>
);
