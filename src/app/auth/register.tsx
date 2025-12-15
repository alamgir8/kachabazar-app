import { useState, useRef, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TextInput,
  Pressable,
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

// Feature flag - set to true to show phone registration option
const ENABLE_PHONE_REGISTRATION = false;

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;
type Step = "form" | "otp";

/**
 * Email Registration Screen with OTP Verification
 * This is the primary registration method
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<RegisterInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpInputRefs = useRef<TextInput[]>([]);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const passwordValue = watch("password");

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

  const onSubmit = async (values: RegisterInput) => {
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await authApi.sendEmailOtp({
        email: values.email,
        name: values.name,
        password: values.password,
      });
      setFormData(values);
      setSuccessMessage(res.message);
      setExpiresIn(res.expiresIn || 600);
      setCountdown(60);
      setStep("otp");
    } catch (err) {
      setError((err as Error).message ?? "Failed to send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/[^0-9]/g, "").slice(-1);
      const newDigits = [...otpDigits];
      newDigits[index] = digit;
      setOtpDigits(newDigits);

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

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!formData) {
      setError("Registration data missing. Please start over.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await authApi.confirmEmailOtp({
        email: formData.email,
        code: otp,
        name: formData.name,
        password: formData.password,
      });

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
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);
    } catch (err) {
      setError((err as Error).message ?? "Failed to verify code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!formData || countdown > 0) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.resendEmailOtp({ email: formData.email });
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
            subTitle={step === "form" ? "Create Account" : "Verify Email"}
            subDescription={
              step === "form"
                ? "Sign up to get started"
                : `Enter the code sent to ${formData?.email}`
            }
          />

          <View className="mt-6 rounded-2xl px-1 py-4">
            {step === "form" ? (
              <>
                {/* Registration Form */}
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <EnhancedInput
                      label="Full Name"
                      placeholder="John Doe"
                      value={value}
                      onChangeText={onChange}
                      error={errors.name?.message}
                      leftIcon="user"
                      containerClassName="mb-5"
                    />
                  )}
                />
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
                      containerClassName="mb-5"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <View className="mb-5">
                      <EnhancedInput
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        error={errors.password?.message}
                        leftIcon="lock"
                      />
                      <PasswordStrengthIndicator password={value} />
                    </View>
                  )}
                />
              </>
            ) : (
              <>
                {/* OTP Verification */}
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
                        className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-semibold text-slate-800"
                        value={digit}
                        onChangeText={(text) => handleOtpChange(index, text)}
                        onKeyPress={({ nativeEvent }) =>
                          handleOtpKeyPress(index, nativeEvent.key)
                        }
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    ))}
                  </View>
                </View>

                {/* Timer */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-sm text-slate-500">
                    Code expires in{" "}
                    <Text className="font-medium text-emerald-600">
                      {formatTime(expiresIn)}
                    </Text>
                  </Text>
                  <Pressable onPress={handleResendOtp} disabled={countdown > 0}>
                    <Text
                      className={`text-sm font-medium ${
                        countdown > 0 ? "text-slate-400" : "text-emerald-600"
                      }`}
                    >
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Resend code"}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Messages */}
            {successMessage && (
              <View className="mb-4 rounded-xl bg-emerald-50 p-3 flex-row items-center border border-emerald-100">
                <Feather name="check-circle" size={18} color="#10b981" />
                <Text className="ml-2 text-sm text-emerald-600 flex-1">
                  {successMessage}
                </Text>
              </View>
            )}
            {error && (
              <View className="mb-4 rounded-xl bg-red-50 p-3 flex-row items-center border border-red-100">
                <Feather name="alert-triangle" size={18} color="#ef4444" />
                <Text className="ml-2 text-sm text-red-600 flex-1">
                  {error}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            {step === "form" ? (
              <>
                <Button
                  title={isSubmitting ? "Sending code..." : "Continue"}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  variant="teal"
                  className="mt-4"
                />

                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-px bg-slate-200" />
                  <Text className="mx-4 text-sm text-slate-500">
                    Already have an account?
                  </Text>
                  <View className="flex-1 h-px bg-slate-200" />
                </View>

                <Button
                  title="Back to Login"
                  variant="outline"
                  onPress={() => router.back()}
                />

                {/* Phone Registration Option (if enabled) */}
                {ENABLE_PHONE_REGISTRATION && (
                  <>
                    <View className="flex-row items-center my-6">
                      <View className="flex-1 h-px bg-slate-200" />
                      <Text className="mx-4 text-sm text-slate-500">or</Text>
                      <View className="flex-1 h-px bg-slate-200" />
                    </View>
                    <Button
                      title="Sign up with Phone"
                      variant="outline"
                      onPress={() => router.push("/auth/phone-register")}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  title={isSubmitting ? "Verifying..." : "Verify & Register"}
                  onPress={handleVerifyOtp}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  variant="teal"
                  className="mt-4"
                />
                <Button
                  title="Change Email"
                  variant="outline"
                  onPress={() => {
                    setStep("form");
                    setOtpDigits(["", "", "", "", "", ""]);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="mt-3"
                />
              </>
            )}

            {/* Security Note */}
            <View className="mt-8 p-4 bg-slate-50 rounded-xl">
              <View className="flex-row items-start">
                <Feather name="shield" size={20} color="#64748b" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Your data is secure
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    We use OTP verification to ensure your account is protected.
                    Verification codes expire after 10 minutes.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
