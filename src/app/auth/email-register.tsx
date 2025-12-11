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
import { BackButton, EnhancedInput } from "@/components/ui";
import { authApi } from "@/services/auth";
import { setTokens } from "@/services/api-client";
import Button from "@/components/ui/Button";

// Validation schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type EmailInput = z.infer<typeof emailSchema>;

type Step = "email" | "otp";

export default function EmailRegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [emailData, setEmailData] = useState<EmailInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(600);
  const otpInputRefs = useRef<TextInput[]>([]);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  // Email form
  const emailForm = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
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

  const handleEmailSubmit = async (values: EmailInput) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await authApi.sendEmailOtp({
        email: values.email,
        name: values.name,
        password: values.password,
      });
      setEmailData(values);
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

      // Auto-focus next input
      if (digit && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    },
    [otpDigits]
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

    if (!emailData) {
      setError("Email data missing. Please start over.");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.confirmEmailOtp({
        email: emailData.email,
        code: otp,
        name: emailData.name,
        password: emailData.password,
      });

      // Set tokens and login
      setTokens(res.token, res.refreshToken, 900);
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
    if (!emailData || countdown > 0) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.resendEmailOtp({ email: emailData.email });
      setSuccessMessage(res.message);
      setExpiresIn(res.expiresIn || 600);
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
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
            subTitle={step === "email" ? "Sign Up with Email" : "Verify Email"}
            subDescription={
              step === "email"
                ? "Create your account with email"
                : `Enter the 6-digit code sent to ${emailData?.email}`
            }
          />

          <View className="mt-6 rounded-2xl px-1 py-4 shadow-sm">
            {step === "email" ? (
              <>
                <Controller
                  control={emailForm.control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Full name"
                      placeholder="Jane Doe"
                      value={value}
                      onChangeText={onChange}
                      error={emailForm.formState.errors.name?.message}
                      leftIcon="user"
                      containerClassName="mb-5"
                    />
                  )}
                />
                <Controller
                  control={emailForm.control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Email address"
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      error={emailForm.formState.errors.email?.message}
                      leftIcon="mail"
                      containerClassName="mb-5"
                    />
                  )}
                />
                <Controller
                  control={emailForm.control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Password"
                      placeholder="••••••••"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      error={emailForm.formState.errors.password?.message}
                      leftIcon="lock"
                      containerClassName="mb-5"
                    />
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
            {step === "email" ? (
              <Button
                title={
                  emailForm.formState.isSubmitting
                    ? "Sending code..."
                    : "Send Verification Code"
                }
                onPress={() => emailForm.handleSubmit(handleEmailSubmit)()}
                disabled={emailForm.formState.isSubmitting}
                loading={emailForm.formState.isSubmitting}
                variant="teal"
                className="mt-6"
              />
            ) : (
              <Button
                title="Verify & Register"
                onPress={handleOtpSubmit}
                variant="teal"
                className="mt-2"
              />
            )}

            {/* Back Button */}
            {step === "otp" ? (
              <Button
                title="Change Email"
                variant="outline"
                className="mt-4"
                onPress={() => {
                  setStep("email");
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

            {/* Or continue with phone */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="mx-4 text-sm text-slate-500">or</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            <Button
              title="Sign up with Phone"
              variant="outline"
              onPress={() => router.replace("/auth/phone-register")}
            />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
