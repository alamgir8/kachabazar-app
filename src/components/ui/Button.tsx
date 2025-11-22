import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Button = ({
  title,
  variant,
  onPress,
  height = 44,
  textSize = 16,
  fontWeight = "600",
  borderRadius = 999,
  className = "flex-1",
  style: customStyle,
  disabled = false,
  loading = false,
}: {
  title: string;
  variant:
    | "outline"
    | "primary"
    | "teal"
    | "purple"
    | "sky"
    | "blue"
    | "rose"
    | "pink"
    | "cyan"
    | "amber"
    | "lime";
  onPress: () => void;
  height?: number;
  borderRadius?: number;
  className?: string;
  textSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  style?: any;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const variantStyles = {
    primary: {
      gradient: ["#1fcf99", "#19a35a", "#15803d"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    outline: {
      gradient: ["rgba(34,197,94,0.18)", "rgba(14,165,233,0.12)"] as const,
      interior: ["#ffffff", "rgba(255,255,255,0.92)"] as const,
      bubble: "rgba(29,205,135,0.12)",
      textColor: "#0f9c68",
    },
    teal: {
      gradient: ["#5EEAD4", "#14B8A6", "#0D9488"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    purple: {
      gradient: ["#C084FC", "#A855F7", "#9333EA"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    sky: {
      gradient: ["#7DD3FC", "#0EA5E9", "#0284C7"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    blue: {
      gradient: ["#60A5FA", "#3B82F6", "#2563EB"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    rose: {
      gradient: ["#FDA4AF", "#FB7185", "#F43F5E"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    pink: {
      gradient: ["#F9A8D4", "#EC4899", "#DB2777"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    cyan: {
      gradient: ["#67E8F9", "#06B6D4", "#0891B2"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    amber: {
      gradient: ["#FCD34D", "#F59E0B", "#D97706"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
    lime: {
      gradient: ["#BEF264", "#84CC16", "#65A30D"] as const,
      interior: undefined,
      bubble: "rgba(255,255,255,0.2)",
      textColor: "#ffffff",
    },
  };

  const style = variantStyles[variant];
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  // Disabled gradient colors (gray tones)
  const disabledGradient = isOutline
    ? (["rgba(148,163,184,0.18)", "rgba(148,163,184,0.12)"] as const)
    : (["#cbd5e1", "#94a3b8", "#64748b"] as const);

  const disabledInterior = isOutline
    ? (["#f8fafc", "rgba(248,250,252,0.92)"] as const)
    : undefined;

  // Use variant color for loading, disabled color for disabled
  const activeGradient = disabled ? disabledGradient : style.gradient;
  const activeInterior = disabled ? disabledInterior : style.interior;
  const activeTextColor = disabled
    ? isOutline
      ? "#94a3b8"
      : "#ffffff"
    : style.textColor;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      className={className}
      style={customStyle}
      android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={activeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height,
          borderRadius,
          padding: isOutline ? 1.5 : 2,
          justifyContent: "center",
          alignItems: "center",
          shadowColor:
            isDisabled || isOutline ? "transparent" : "rgba(34,197,94,0.35)",
          shadowOffset: { width: 0, height: isDisabled || isOutline ? 0 : 8 },
          shadowOpacity: isDisabled || isOutline ? 0 : 0.3,
          shadowRadius: isDisabled || isOutline ? 0 : 16,
          elevation: isDisabled || isOutline ? 0 : 5,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            borderRadius: borderRadius - 2,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {activeInterior && (
            <LinearGradient
              colors={activeInterior}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
          )}
          {!disabled && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -10,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: style.bubble,
              }}
            />
          )}
          {loading ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <ActivityIndicator size="small" color={activeTextColor} />
              <Text
                style={{
                  color: activeTextColor,
                  fontSize: textSize,
                  fontWeight: fontWeight,
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                Loading...
              </Text>
            </View>
          ) : (
            <Text
              style={{
                color: activeTextColor,
                fontSize: textSize,
                fontWeight: fontWeight,
                textAlign: "center",
                zIndex: 10,
              }}
            >
              {title}
            </Text>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default Button;
