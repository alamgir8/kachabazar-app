import { useState, useRef, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { z } from "zod";

import { Screen } from "@/components/layout/Screen";
import {
  BackButton,
  EnhancedInput,
  PasswordStrengthIndicator,
} from "@/components/ui";
import { authApi } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

// Validation schemas
const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^\+?[1-9]\d{6,14}$/,
      "Please enter a valid phone number with country code"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type PhoneInput = z.infer<typeof phoneSchema>;
type OtpInput = z.infer<typeof otpSchema>;

type Step = "phone" | "otp";

export default function PhoneRegisterScreen() {
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phoneData, setPhoneData] = useState<PhoneInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(600);
  const otpInputRefs = useRef<TextInput[]>([]);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  // Phone form
  const phoneForm = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
      name: "",
      password: "",
    },
  });

  // OTP form
  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Expiry timer
  useEffect(() => {
    if (step === "otp" && expiresIn > 0) {
      const timer = setTimeout(() => setExpiresIn(expiresIn - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, expiresIn]);

  const handlePhoneSubmit = async (values: PhoneInput) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await authApi.requestPhoneOtp({
        phone: values.phone,
        name: values.name,
        password: values.password,
      });
      setPhoneData(values);
      setSuccessMessage(res.message);
      setExpiresIn(res.expiresIn || 600);
      setCountdown(60);
      setStep("otp");
    } catch (err) {
      setError((err as Error).message ?? "Failed to send verification code.");
    }
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      const digit = value.replace(/[^0-9]/g, "").slice(-1);
      const newDigits = [...otpDigits];
      newDigits[index] = digit;
      setOtpDigits(newDigits);

      // Update form value
      const otpValue = newDigits.join("");
      otpForm.setValue("otp", otpValue);

      // Auto-focus next input
      if (digit && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    },
    [otpDigits, otpForm]
  );

  const handleOtpKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    },
    [otpDigits]
  );

  const handleOtpSubmit = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!phoneData) {
      setError("Phone data missing. Please start over.");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.confirmPhoneOtp({
        phone: phoneData.phone,
        code: otp,
        name: phoneData.name,
        password: phoneData.password,
      });

      // Login with the received tokens
      await loginWithToken({
        _id: res._id,
        name: res.name,
        email: res.email,
        phone: res.phone,
        image: res.image,
        address: res.address,
        token: res.token,
        refreshToken: res.refreshToken,
      });

      setSuccessMessage("Registration successful!");

      // Navigate to home
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);
    } catch (err) {
      setError((err as Error).message ?? "Failed to verify code.");
    }
  };

  const handleResendOtp = async () => {
    if (!phoneData || countdown > 0) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.resendPhoneOtp({ phone: phoneData.phone });
      setSuccessMessage(res.message);
      setExpiresIn(res.expiresIn || 600);
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpForm.setValue("otp", "");
    } catch (err) {
      setError((err as Error).message ?? "Failed to resend code.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      className="flex-1"
    >
      <Screen scrollable edges={["bottom"]}>
        <View className="">
          <BackButton
            subTitle={step === "phone" ? "Sign Up with Phone" : "Verify Phone"}
            subDescription={
              step === "phone"
                ? "Register using your phone number"
                : `Enter the 6-digit code sent to ${phoneData?.phone}`
            }
          />

          <View className="mt-6 rounded-2xl px-1 py-4 shadow-sm">
            {step === "phone" ? (
              <>
                <Controller
                  control={phoneForm.control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Full name"
                      placeholder="Jane Doe"
                      value={value}
                      onChangeText={onChange}
                      error={phoneForm.formState.errors.name?.message}
                      leftIcon="user"
                      containerClassName="mb-5"
                    />
                  )}
                />
                <Controller
                  control={phoneForm.control}
                  name="phone"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Phone number"
                      placeholder="+1234567890"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      error={phoneForm.formState.errors.phone?.message}
                      leftIcon="phone"
                      containerClassName="mb-5"
                    />
                  )}
                />
                <Controller
                  control={phoneForm.control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <View className="mb-5">
                      <EnhancedInput
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        error={phoneForm.formState.errors.password?.message}
                        leftIcon="lock"
                      />
                      <PasswordStrengthIndicator password={value} />
                    </View>
                  )}
                />
              </>
            ) : (
              <>
                {/* OTP Input */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-slate-700 mb-3">
                    Verification Code
                  </Text>
                  <View className="flex-row justify-between gap-2">
                    {otpDigits.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) otpInputRefs.current[index] = ref;
                        }}
                        className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-bold text-slate-800 bg-white"
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(index, value)}
                        onKeyPress={({ nativeEvent }) =>
                          handleOtpKeyPress(index, nativeEvent.key)
                        }
                        selectTextOnFocus
                      />
                    ))}
                  </View>
                  {expiresIn > 0 && (
                    <Text className="text-xs text-slate-500 mt-2 text-center">
                      Code expires in {formatTime(expiresIn)}
                    </Text>
                  )}
                </View>

                {/* Resend Button */}
                <View className="flex-row justify-center mb-4">
                  {countdown > 0 ? (
                    <Text className="text-sm text-slate-500">
                      Resend code in {countdown}s
                    </Text>
                  ) : (
                    <Button
                      title="Resend Code"
                      variant="outline"
                      onPress={handleResendOtp}
                      disabled={countdown > 0}
                    />
                  )}
                </View>
              </>
            )}

            {/* Messages */}
            {successMessage ? (
              <View className="mb-4 rounded-xl bg-emerald-50 p-3 flex-row items-center border border-emerald-100">
                <Feather name="check-circle" size={18} color="#10b981" />
                <Text className="ml-2 text-sm text-emerald-600 flex-1">
                  {successMessage}
                </Text>
              </View>
            ) : null}
            {error ? (
              <View className="mb-4 rounded-xl bg-red-50 p-3 flex-row items-center border border-red-100">
                <Feather name="alert-triangle" size={18} color="#ef4444" />
                <Text className="ml-2 text-sm text-red-600 flex-1">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Submit Button */}
            {step === "phone" ? (
              <Button
                title={
                  phoneForm.formState.isSubmitting
                    ? "Sending code..."
                    : "Send Verification Code"
                }
                onPress={() => phoneForm.handleSubmit(handlePhoneSubmit)()}
                disabled={phoneForm.formState.isSubmitting}
                loading={phoneForm.formState.isSubmitting}
                variant="teal"
                className="mt-6"
              />
            ) : (
              <Button
                title={
                  otpForm.formState.isSubmitting
                    ? "Verifying..."
                    : "Verify & Register"
                }
                onPress={handleOtpSubmit}
                disabled={otpForm.formState.isSubmitting}
                loading={otpForm.formState.isSubmitting}
                variant="teal"
                className="mt-2"
              />
            )}

            {/* Back Button */}
            {step === "otp" ? (
              <Button
                title="Change Phone Number"
                variant="outline"
                className="mt-4"
                onPress={() => {
                  setStep("phone");
                  setOtpDigits(["", "", "", "", "", ""]);
                  setError(null);
                  setSuccessMessage(null);
                }}
              />
            ) : (
              <Button
                title="Back to Login"
                variant="outline"
                className="mt-4"
                onPress={() => router?.back()}
              />
            )}

            {/* Or continue with email */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="mx-4 text-sm text-slate-500">or</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            <Button
              title="Sign up with Email"
              variant="outline"
              onPress={() => router.replace("/auth/register")}
            />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
