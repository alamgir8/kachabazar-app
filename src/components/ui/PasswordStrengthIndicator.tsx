import React, { useMemo } from "react";
import { View, Text } from "react-native";

interface PasswordStrengthIndicatorProps {
  password: string;
  showLabel?: boolean;
  className?: string;
}

interface StrengthResult {
  score: number;
  level: "weak" | "fair" | "good" | "strong";
  label: string;
  color: string;
  barColor: string;
}

/**
 * Calculate password strength based on various criteria
 */
const calculatePasswordStrength = (password: string): StrengthResult => {
  if (!password || password.length === 0) {
    return {
      score: 0,
      level: "weak",
      label: "",
      color: "#94a3b8",
      barColor: "#e2e8f0",
    };
  }

  let score = 0;

  // Length checks
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 2; // special characters

  // Bonus for mixing character types
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (typeCount >= 3) score += 2;
  if (typeCount >= 4) score += 2;

  // Penalties
  // Common patterns
  if (/^[a-zA-Z]+$/.test(password)) score -= 1; // only letters
  if (/^[0-9]+$/.test(password)) score -= 2; // only numbers
  if (/(.)\1{2,}/.test(password)) score -= 1; // repeating characters
  if (/^(123|abc|qwerty|password)/i.test(password)) score -= 3; // common patterns

  // Normalize score to 0-4 range
  score = Math.max(0, Math.min(score, 12));

  // Map score to strength level
  if (score <= 3) {
    return {
      score: 1,
      level: "weak",
      label: "Weak",
      color: "#ef4444", // red
      barColor: "#ef4444",
    };
  } else if (score <= 5) {
    return {
      score: 2,
      level: "fair",
      label: "Fair",
      color: "#f59e0b", // amber
      barColor: "#f59e0b",
    };
  } else if (score <= 8) {
    return {
      score: 3,
      level: "good",
      label: "Good",
      color: "#22c55e", // green
      barColor: "#22c55e",
    };
  } else {
    return {
      score: 4,
      level: "strong",
      label: "Strong",
      color: "#10b981", // emerald
      barColor: "#10b981",
    };
  }
};

/**
 * Password Strength Indicator Component
 * Shows visual bars and label indicating password strength
 */
export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, showLabel = true, className = "" }) => {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  if (!password || password.length === 0) {
    return null;
  }

  return (
    <View className={`mt-2 ${className}`}>
      {/* Strength Bars */}
      <View className="flex-row items-center gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            className="flex-1 h-1.5 rounded-full"
            style={{
              backgroundColor:
                level <= strength.score ? strength.barColor : "#e2e8f0",
            }}
          />
        ))}
        {showLabel && strength.label && (
          <Text
            className="ml-2 text-sm font-medium"
            style={{ color: strength.color }}
          >
            {strength.label}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * Hook to get password strength
 */
export const usePasswordStrength = (password: string) => {
  return useMemo(() => calculatePasswordStrength(password), [password]);
};

export default PasswordStrengthIndicator;
