import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/Screen";
import { BackButton } from "@/components/ui/BackButton";
import { EnhancedInput } from "@/components/ui/EnhancedInput";
import Button from "@/components/ui/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { CouponSection } from "@/components/checkout/CouponSection";
import { formatCurrency } from "@/utils";
import { useCheckoutSubmit } from "@/hooks/useCheckoutSubmit";
import { cn } from "@/utils/cn";

export default function CheckoutScreen() {
  const router = useRouter();
  const {
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
    shippingOptions,
    paymentMethods,
  } = useCheckoutSubmit();

  if (!isAuthenticated) {
    return (
      <Screen className="px-4 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-lg">
          <Text className="text-lg font-semibold text-slate-900">
            Almost there!
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Please sign in to finalize your order and keep your history synced.
          </Text>
          <Button
            title="Login"
            className="mt-6"
            variant="primary"
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </Screen>
    );
  }

  if (isEmpty) {
    return (
      <Screen className="px-4 pt-24">
        <View className="rounded-3xl bg-white p-10 shadow-lg">
          <Text className="text-lg font-semibold text-slate-900">
            Your cart is empty
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Add a few delicious items before you checkout.
          </Text>
          <Button
            title="Browse products"
            className="mt-6"
            variant="primary"
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
      <Screen scrollable edges={["bottom"]}>
        <View>
          {/* Back Button */}
          <BackButton
            subTitle="Checkout"
            subDescription="Complete your order"
          />

          {/* Shipping Details Section */}
          <View className="mt-6 rounded-3xl bg-white px-4 py-6 shadow-lg">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="user" size={20} color="#0f766e" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Shipping Details
                </Text>
                <Text className="text-xs text-slate-500">
                  Where should we deliver?
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="First Name"
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      error={errors.firstName?.message}
                      leftIcon="user"
                      containerClassName="mb-4"
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Last Name"
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      error={errors.lastName?.message}
                      leftIcon="user"
                      containerClassName="mb-4"
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <EnhancedInput
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  leftIcon="mail"
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="contact"
              render={({ field: { value, onChange } }) => (
                <EnhancedInput
                  label="Contact Number"
                  placeholder="+1 234 567 890"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  error={errors.contact?.message}
                  leftIcon="phone"
                  containerClassName="mb-4"
                />
              )}
            />
          </View>

          {/* Delivery Address Section */}
          <View className="mt-4 rounded-3xl bg-white px-4 py-6 shadow-lg">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="map-pin" size={20} color="#0f766e" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Delivery Address
                </Text>
                <Text className="text-xs text-slate-500">
                  Where should the groceries go?
                </Text>
              </View>
            </View>

            <Controller
              control={control}
              name="address"
              render={({ field: { value, onChange } }) => (
                <EnhancedInput
                  label="Address"
                  placeholder="123 Greenway Ave"
                  value={value}
                  onChangeText={onChange}
                  error={errors.address?.message}
                  leftIcon="home"
                  containerClassName="mb-4"
                />
              )}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="City"
                      placeholder="San Francisco"
                      value={value}
                      onChangeText={onChange}
                      error={errors.city?.message}
                      leftIcon="map"
                      containerClassName="mb-4"
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="country"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Country"
                      placeholder="USA"
                      value={value}
                      onChangeText={onChange}
                      error={errors.country?.message}
                      leftIcon="globe"
                      containerClassName="mb-4"
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="zipCode"
              render={({ field: { value, onChange } }) => (
                <EnhancedInput
                  label="ZIP Code"
                  placeholder="94105"
                  value={value}
                  onChangeText={onChange}
                  error={errors.zipCode?.message}
                  leftIcon="hash"
                  containerClassName="mb-4"
                />
              )}
            />
          </View>

          {/* Shipping Options Section */}
          <View className="mt-4 rounded-3xl bg-white px-4 py-6 shadow-lg">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="truck" size={20} color="#0f766e" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Shipping Option
                </Text>
                <Text className="text-xs text-slate-500">
                  Choose your delivery preference
                </Text>
              </View>
            </View>

            <Controller
              control={control}
              name="shippingOption"
              render={({ field: { onChange, value } }) => (
                <View className="gap-3">
                  {shippingOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        onChange(option.value);
                        handleShippingCost(option.cost);
                      }}
                      className={cn(
                        "rounded-2xl border p-4",
                        value === option.value
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                          <Text className="text-sm font-bold text-slate-900">
                            {option.title}
                          </Text>
                          <Text className="mt-1 text-xs text-slate-500">
                            {option.description}
                          </Text>
                        </View>
                        <View
                          className={cn(
                            "h-6 w-6 items-center justify-center rounded-full border-2",
                            value === option.value
                              ? "border-teal-500 bg-white"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {value === option.value ? (
                            <View className="h-3 w-3 rounded-full bg-teal-500" />
                          ) : null}
                        </View>
                      </View>
                      {option.cost > 0 && (
                        <Text className="mt-2 text-xs font-bold text-teal-600">
                          +{formatCurrency(option.cost, currency)}
                        </Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Payment Method Section */}
          <View className="mt-4 rounded-3xl bg-white px-4 py-6 shadow-lg">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="credit-card" size={20} color="#0f766e" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Payment Method
                </Text>
                <Text className="text-xs text-slate-500">
                  How would you like to pay?
                </Text>
              </View>
            </View>

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { onChange, value } }) => (
                <View className="gap-3">
                  {paymentMethods.map((method) => {
                    return (
                      <View key={method.value} className="gap-3">
                        <Pressable
                          onPress={() => onChange(method.value)}
                          className={cn(
                            "rounded-2xl border p-4",
                            value === method.value
                              ? "border-teal-500 bg-teal-50"
                              : "border-slate-200 bg-slate-50"
                          )}
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-3">
                              <Text className="text-sm font-bold text-slate-900">
                                {method.title}
                              </Text>
                              <Text className="mt-1 text-xs text-slate-500">
                                {method.description}
                              </Text>
                            </View>
                            <View
                              className={cn(
                                "h-6 w-6 items-center justify-center rounded-full border-2",
                                value === method.value
                                  ? "border-teal-500 bg-white"
                                  : "border-slate-300 bg-white"
                              )}
                            >
                              {value === method.value ? (
                                <View className="h-3 w-3 rounded-full bg-teal-500" />
                              ) : null}
                            </View>
                          </View>
                        </Pressable>

                        {value === "Card" && method.value === "Card" && (
                          <View className="rounded-2xl border border-slate-200 bg-white p-4 gap-4">
                            <Controller
                              control={control}
                              name="cardNumber"
                              render={({
                                field: { onChange, onBlur, value },
                              }) => (
                                <EnhancedInput
                                  label="Card Number"
                                  placeholder="0000 0000 0000 0000"
                                  keyboardType="numeric"
                                  maxLength={19}
                                  onBlur={onBlur}
                                  onChangeText={onChange}
                                  value={value}
                                  error={errors.cardNumber?.message}
                                />
                              )}
                            />
                            <View className="flex-row gap-4">
                              <View className="flex-1">
                                <Controller
                                  control={control}
                                  name="cardExpiry"
                                  render={({
                                    field: { onChange, onBlur, value },
                                  }) => (
                                    <EnhancedInput
                                      label="Expiry Date"
                                      placeholder="MM/YY"
                                      maxLength={5}
                                      onBlur={onBlur}
                                      onChangeText={onChange}
                                      value={value}
                                      error={errors.cardExpiry?.message}
                                    />
                                  )}
                                />
                              </View>
                              <View className="flex-1">
                                <Controller
                                  control={control}
                                  name="cardCvc"
                                  render={({
                                    field: { onChange, onBlur, value },
                                  }) => (
                                    <EnhancedInput
                                      label="CVC"
                                      placeholder="123"
                                      keyboardType="numeric"
                                      maxLength={4}
                                      onBlur={onBlur}
                                      onChangeText={onChange}
                                      value={value}
                                      error={errors.cardCvc?.message}
                                    />
                                  )}
                                />
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            />
          </View>

          {/* Coupon Section */}
          <View className="mt-4 rounded-3xl bg-white px-4 py-6 shadow-lg">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="tag" size={20} color="#0f766e" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Discount Code
                </Text>
                <Text className="text-xs text-slate-500">
                  Have a coupon? Apply it here
                </Text>
              </View>
            </View>

            <CouponSection
              cartTotal={cartTotal}
              onCouponApplied={handleCouponApplied}
              appliedCoupon={couponInfo}
              currency={currency}
            />
          </View>

          {/* Order Summary Section */}
          <View className="mt-4 rounded-3xl bg-white px-4 py-6 shadow-lg">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Feather name="shopping-bag" size={20} color="#0f766e" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Order Summary
                </Text>
                <Text className="text-xs text-slate-500">
                  Review your order details
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-slate-600">
                  Subtotal
                </Text>
                <Text className="text-sm font-bold text-slate-900">
                  {formatCurrency(cartTotal, currency)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-slate-600">
                  Delivery
                </Text>
                <Text className="text-sm font-bold text-teal-600">
                  {shippingCost > 0
                    ? formatCurrency(shippingCost, currency)
                    : "Free"}
                </Text>
              </View>
              {discountAmount > 0 ? (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-emerald-600">
                    Discount
                  </Text>
                  <Text className="text-sm font-bold text-emerald-600">
                    -{formatCurrency(discountAmount, currency)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mt-4 rounded-2xl bg-teal-50 p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-bold uppercase text-teal-900">
                  Total Due
                </Text>
                <Text className="text-2xl font-black text-teal-600">
                  {formatCurrency(total, currency)}
                </Text>
              </View>
            </View>

            <Button
              title={isCheckoutSubmit ? "Placing order..." : "Confirm Order"}
              onPress={handleSubmit(submitHandler)}
              disabled={isCheckoutSubmit}
              loading={isCheckoutSubmit}
              variant="teal"
              className="mt-6"
            />
          </View>

          <View className="h-8" />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
