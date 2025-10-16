import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { cn } from "@/utils/cn";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "danger"
  | "warning";

interface CMButtonProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  variant?: Variant;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  w?: string;
  width?: number | string;
  py?: string;
  px?: string;
  mx?: string;
  height?: string;
  rounded?: string | boolean;
  shadow?: string;
  bgColor?: string;
  borderColor?: string;
  disabledBg?: string;

  /** enables classic gradient fill */
  gradient?: boolean;

  /** enables liquid glass effect */
  glass?: boolean;
  glassTint?: "light" | "default" | "dark";

  textSize?: string;
  textColor?: string;
  fontWeight?: string;
  alignItems?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  contentClassName?: string;
  onPress?: (event?: GestureResponderEvent) => void;
  style?: ViewStyle | TextStyle;
  color?: string;
}

const sizeConfig = {
  xs: {
    container: "h-8 px-3",
    text: "text-xs",
    radius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  sm: {
    container: "h-10 px-4",
    text: "text-sm",
    radius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  md: {
    container: "h-12 px-6",
    text: "text-[15px]",
    radius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  lg: {
    container: "h-14 px-8",
    text: "text-base",
    radius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    minHeight: 56,
  },
  xl: {
    container: "h-16 px-10",
    text: "text-xl",
    radius: 18,
    paddingHorizontal: 40,
    paddingVertical: 16,
    minHeight: 64,
  },
} as const;

const DEFAULT_GRADIENT = [
  "#34D399",
  "#10B981",
  "#059669",
] as [string, string, string];

const variantConfig: Record<
  Variant,
  {
    bg: string;
    text: string;
    border: string;
    gradient?: string[]; // solid gradient
    hue?: string[]; // glass hue overlay
    spinner?: string;
  }
> = {
  primary: {
    bg: "bg-emerald-500",
    text: "text-white",
    border: "border-transparent",
    gradient: ["#34D399", "#10B981", "#059669"],
    hue: [
      "rgba(16,185,129,0.35)",
      "rgba(5,150,105,0.08)",
      "rgba(5,150,105,0.04)",
    ],
    spinner: "#FFFFFF",
  },
  secondary: {
    bg: "bg-slate-600",
    text: "text-white",
    border: "border-transparent",
    gradient: ["#CBD5E1", "#64748B", "#475569"],
    hue: [
      "rgba(100,116,139,0.35)",
      "rgba(71,85,105,0.10)",
      "rgba(71,85,105,0.05)",
    ],
    spinner: "#FFFFFF",
  },
  outline: {
    bg: "bg-white",
    text: "text-emerald-600",
    border: "border-2 border-emerald-500",
    gradient: undefined,
    hue: [
      "rgba(255,255,255,0.45)",
      "rgba(255,255,255,0.12)",
      "rgba(255,255,255,0.06)",
    ],
    spinner: "#10B981",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-slate-700",
    border: "border-transparent",
    gradient: undefined,
    hue: [
      "rgba(255,255,255,0.35)",
      "rgba(255,255,255,0.10)",
      "rgba(255,255,255,0.05)",
    ],
    spinner: "#0F172A",
  },
  success: {
    bg: "bg-green-600",
    text: "text-white",
    border: "border-transparent",
    gradient: ["#4ADE80", "#22C55E", "#16A34A"],
    hue: [
      "rgba(34,197,94,0.35)",
      "rgba(22,163,74,0.10)",
      "rgba(22,163,74,0.05)",
    ],
    spinner: "#FFFFFF",
  },
  danger: {
    bg: "bg-red-600",
    text: "text-white",
    border: "border-transparent",
    gradient: ["#F87171", "#EF4444", "#B91C1C"],
    hue: [
      "rgba(239,68,68,0.35)",
      "rgba(185,28,28,0.10)",
      "rgba(185,28,28,0.05)",
    ],
    spinner: "#FFFFFF",
  },
  warning: {
    bg: "bg-amber-500",
    text: "text-white",
    border: "border-transparent",
    gradient: ["#FBBF24", "#F59E0B", "#D97706"],
    hue: [
      "rgba(245,158,11,0.35)",
      "rgba(217,119,6,0.10)",
      "rgba(217,119,6,0.05)",
    ],
    spinner: "#FFFFFF",
  },
};

const CMButton: React.FC<CMButtonProps> = ({
  title,
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  w,
  width,
  py,
  px,
  mx,
  height,
  rounded,
  shadow,
  bgColor,
  borderColor,
  disabledBg,
  gradient = false,
  glass = false,
  glassTint = "default",
  textSize,
  textColor,
  fontWeight,
  alignItems,
  icon,
  iconPosition = "left",
  className,
  contentClassName,
  onPress,
  style,
  color,
}) => {
  const isDisabled = disabled || loading;
  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];
  const gradientColors = (config.gradient ?? DEFAULT_GRADIENT) as [
    string,
    string,
    ...string[],
  ];
  const hueColors =
    (config.hue ??
      [
        "rgba(16,185,129,0.3)",
        "rgba(16,185,129,0.12)",
        "rgba(16,185,129,0.05)",
      ]) as [string, string, ...string[]];
  const interactiveOpacity = loading ? 0.82 : disabled ? 0.6 : 1;

  const roundedClass =
    typeof rounded === "string"
      ? rounded
      : rounded === true
        ? "rounded-full"
        : rounded === false
          ? "rounded-none"
          : "rounded-xl";

  const containerClasses = cn(
    "items-center justify-center border overflow-hidden",
    !height && !py && sizeStyle.container,
    py,
    px,
    mx,
    w,
    height,
    !bgColor && !gradient && !glass && config.bg,
    !borderColor && config.border,
    fullWidth && "w-full",
    roundedClass,
    shadow || (glass ? "shadow-lg shadow-black/10" : "shadow-md"),
    bgColor,
    borderColor,
    alignItems,
    className
  );

  const textClasses = cn(
    "font-semibold",
    !textSize && sizeStyle.text,
    !textColor && (glass ? "text-white" : config.text),
    textSize,
    textColor,
    fontWeight
  );

  const borderRadius = React.useMemo(() => {
    const tokens = `${roundedClass ?? ""} ${className ?? ""}`.trim();

    if (rounded === false || tokens.includes("rounded-none")) {
      return 0;
    }
    if (rounded === true || tokens.includes("rounded-full")) {
      return sizeStyle.minHeight;
    }
    if (tokens.includes("rounded-4xl")) {
      return Math.max(sizeStyle.radius, Math.round(sizeStyle.minHeight * 0.9));
    }
    if (tokens.includes("rounded-3xl")) {
      return Math.max(sizeStyle.radius, Math.round(sizeStyle.minHeight * 0.75));
    }
    if (tokens.includes("rounded-2xl")) {
      return Math.max(sizeStyle.radius, Math.round(sizeStyle.minHeight * 0.6));
    }
    if (tokens.includes("rounded-xl")) {
      return Math.max(sizeStyle.radius, 20);
    }
    if (tokens.includes("rounded-lg")) {
      return Math.max(sizeStyle.radius, 16);
    }
    if (tokens.includes("rounded-md")) {
      return Math.max(sizeStyle.radius, 12);
    }
    if (tokens.includes("rounded-sm")) {
      return Math.max(sizeStyle.radius, 10);
    }

    return sizeStyle.radius;
  }, [
    className,
    rounded,
    roundedClass,
    sizeStyle.minHeight,
    sizeStyle.radius,
  ]);

  const renderContent = () => (
    <View
      className={cn(
        "flex-row items-center justify-center gap-2",
        contentClassName
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={color || config.spinner || "#ffffff"}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {(title || children) && (
            <Text className={textClasses} style={style as TextStyle}>
              {title || children}
            </Text>
          )}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </View>
  );

  // ----- GLASS / LIQUID MODE -----
  if (glass) {
    const sheenSize = borderRadius > 0 ? borderRadius : sizeStyle.minHeight;
    const blurIntensity = Platform.OS === "ios" ? 55 : 85;
    const tintValue =
      glassTint === "default" && (variant === "outline" || variant === "ghost")
        ? "light"
        : glassTint;
    const glowColor =
      hueColors?.[0] ?? config.hue?.[0] ?? "rgba(16,185,129,0.35)";

    const glassStyle = {
      ...(width !== undefined && { width: width as any }),
      borderRadius,
      overflow: "hidden" as const,
      opacity: interactiveOpacity,
    };

    const shadowStyle = Platform.select({
      ios: {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.32,
        shadowRadius: 22,
      },
      android: {
        elevation: 14,
        shadowColor: glowColor,
      },
    });

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        className={cn(
          fullWidth && "w-full",
          w,
          mx,
          roundedClass,
          shadow || "shadow-lg shadow-black/10"
        )}
        style={[glassStyle, shadowStyle] as any}
        activeOpacity={0.88}
      >
        {/* Atmospheric glass layers */}
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius,
            overflow: "hidden",
            borderWidth: 1.2,
            borderColor: "rgba(255,255,255,0.28)",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        >
          <BlurView
            intensity={blurIntensity}
            tint={tintValue}
            style={StyleSheet.absoluteFillObject}
          />

          {Platform.OS === "android" && (
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.2)",
                "rgba(255,255,255,0.08)",
                "rgba(255,255,255,0.02)",
              ]}
              locations={[0, 0.55, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          )}

          <LinearGradient
            colors={hueColors}
            locations={[0, 0.65, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <LinearGradient
            colors={["rgba(255,255,255,0.72)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.52 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "42%",
            }}
          />

          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.2)"]}
            start={{ x: 0.2, y: 0.45 }}
            end={{ x: 0.8, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "34%",
            }}
          />

          <LinearGradient
            colors={[
              "rgba(255,255,255,0.55)",
              "rgba(255,255,255,0.18)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: -sheenSize * 0.18,
              width: sheenSize * 0.55,
            }}
          />

          <LinearGradient
            colors={[
              "rgba(255,255,255,0.34)",
              "rgba(255,255,255,0.08)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0.25, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={{
              position: "absolute",
              top: -sheenSize * 0.35,
              right: -sheenSize * 0.45,
              width: sheenSize * 1.8,
              height: sheenSize * 1.6,
              transform: [{ rotate: "24deg" }],
              opacity: 0.92,
            }}
          />

          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: Math.max(borderRadius - 2, 0),
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.16)",
              opacity: 0.6,
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: sizeStyle.paddingHorizontal,
            paddingVertical: sizeStyle.paddingVertical,
            minHeight: sizeStyle.minHeight,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderContent()}
        </View>
      </TouchableOpacity>
    );
  }

  // ----- CLASSIC GRADIENT MODE -----
  if (gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        className={cn(
          fullWidth && "w-full",
          w,
          mx,
          roundedClass,
          shadow || "shadow-md"
        )}
        style={[
          width !== undefined ? ({ width } as any) : null,
          {
            borderRadius,
            overflow: "hidden",
            opacity: interactiveOpacity,
          },
        ]}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: sizeStyle.paddingHorizontal,
            paddingVertical: sizeStyle.paddingVertical,
            minHeight: sizeStyle.minHeight,
          }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // ----- STANDARD BUTTON -----
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={containerClasses}
      style={[
        width !== undefined ? ({ width } as any) : {},
        { opacity: interactiveOpacity },
      ]}
      activeOpacity={0.9}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default CMButton;
export { CMButton };
export const Button = CMButton;
export const EnhancedButton = CMButton;
