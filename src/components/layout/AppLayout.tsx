import React, { ReactNode } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AppLayoutProps {
  children: ReactNode;
  edges?: Array<"top" | "right" | "bottom" | "left">;
  backgroundColor?: "default" | "white" | "gradient";
  paddingHorizontal?: number;
  paddingVertical?: number;
  maxContentWidth?: number;
  showBackgroundGradient?: boolean;
}

/**
 * Consistent layout component for all screens
 * Ensures uniform height, width, and spacing across the app
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  edges = ["top", "bottom"],
  backgroundColor = "default",
  paddingHorizontal = 16,
  paddingVertical = 0,
  maxContentWidth = theme.layout.maxWidth,
  showBackgroundGradient = true,
}) => {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes("top") ? insets.top : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom : 0;
  const paddingLeft = edges.includes("left") ? insets.left : 0;
  const paddingRight = edges.includes("right") ? insets.right : 0;

  const getBackground = () => {
    if (backgroundColor === "gradient") {
      return (
        <LinearGradient
          colors={["#f7fafc", "#f5fff6", "#ffffff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      );
    }
    if (backgroundColor === "white") {
      return <View style={[StyleSheet.absoluteFill, { backgroundColor: "#ffffff" }]} />;
    }
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: "#f8fafc" }]} />;
  };

  return (
    <View
      style={{
        flex: 1,
        width: SCREEN_WIDTH,
        minHeight: SCREEN_HEIGHT,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
      }}
    >
      {getBackground()}

      {showBackgroundGradient && backgroundColor === "default" && (
        <>
          <LinearGradient
            colors={[
              "rgba(22,197,94,0.12)",
              "rgba(22,197,94,0.04)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              top: theme.spacing["5xl"],
              right: -140,
              width: 320,
              height: 380,
              borderRadius: 180,
              transform: [{ rotate: "-18deg" }],
            }}
          />
          <LinearGradient
            colors={[
              "rgba(134,239,172,0.28)",
              "rgba(134,239,172,0.12)",
              "transparent",
            ]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={{
              position: "absolute",
              bottom: -220,
              left: -160,
              width: 420,
              height: 420,
              borderRadius: 210,
            }}
          />
        </>
      )}

      <View
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal,
          paddingVertical,
          maxWidth: maxContentWidth,
          alignSelf: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
};

/**
 * Standard content container with consistent spacing
 */
export const ContentContainer: React.FC<{
  children: ReactNode;
  spacing?: number;
  className?: string;
}> = ({ children, spacing = 16, className }) => {
  return (
    <View
      style={{ gap: spacing }}
      className={className}
    >
      {children}
    </View>
  );
};

/**
 * Section wrapper with consistent styling
 */
export const Section: React.FC<{
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}> = ({ children, title, subtitle, className }) => {
  return (
    <View className={className}>
      {title && (
        <View className="mb-4">
          <Text className="text-lg font-bold text-slate-900">{title}</Text>
          {subtitle && (
            <Text className="mt-1 text-sm text-slate-600">{subtitle}</Text>
          )}
        </View>
      )}
      {children}
    </View>
  );
};

