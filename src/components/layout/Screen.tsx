import {
  RefreshControl,
  RefreshControlProps,
  ScrollView,
  ScrollViewProps,
  View,
  ViewProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme";
import { cn } from "@/utils/cn";

interface ScreenProps extends ViewProps {
  scrollable?: boolean;
  contentContainerClassName?: string;
  edges?: Array<"top" | "right" | "bottom" | "left">;
  bgColor?: "default" | "white" | "gradient";
  innerClassName?: string;
  noPadding?: boolean; // Allow opt-out of default padding
  noHorizontalPadding?: boolean; // Allow opt-out of horizontal padding only
  refreshControl?: React.ReactElement<
    RefreshControlProps,
    typeof RefreshControl
  >;
}

export const Screen: React.FC<React.PropsWithChildren<ScreenProps>> = ({
  children,
  scrollable = false,
  className,
  contentContainerClassName,
  edges = ["top"],
  bgColor = "gradient",
  innerClassName,
  noPadding = false,
  noHorizontalPadding = false,
  refreshControl,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const Container = scrollable ? ScrollableWrapper : ViewWrapper;

  const paddingTop = edges.includes("top") ? insets.top : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom : 0;
  const paddingLeft = edges.includes("left") ? insets.left : 0;
  const paddingRight = edges.includes("right") ? insets.right : 0;

  // Determine inner padding class - use px-4 (16px) for consistency
  const innerPaddingClass = noPadding
    ? ""
    : noHorizontalPadding
      ? "py-4"
      : "px-4 py-4";

  return (
    <View className="flex-1" style={{ paddingTop, paddingLeft, paddingRight }}>
      {bgColor === "gradient" && (
        <LinearGradient
          colors={["#f7fafc", "#f5fff6", "#ffffff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
      )}
      {bgColor === "white" && <View className="absolute inset-0 bg-white" />}
      {bgColor === "default" && (
        <View className="absolute inset-0 bg-slate-50" />
      )}

      {bgColor === "gradient" ? (
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
          <LinearGradient
            colors={[
              "rgba(241,245,249,0.85)",
              "rgba(244,246,251,0.45)",
              "transparent",
            ]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={{
              position: "absolute",
              top: -140,
              left: -120,
              width: 360,
              height: 360,
              borderRadius: 180,
              transform: [{ rotate: "12deg" }],
            }}
          />
        </>
      ) : null}
      <Container
        className={cn("flex-1", className)}
        contentContainerClassName={contentContainerClassName}
        extraPaddingBottom={paddingBottom}
        refreshControl={refreshControl}
        {...props}
      >
        <View
          className={cn("w-full", innerPaddingClass, innerClassName)}
          style={{
            maxWidth: theme.layout.maxWidth,
            alignSelf: "center",
          }}
        >
          {children}
        </View>
      </Container>
    </View>
  );
};

interface WrapperProps extends ScrollViewProps {
  className?: string;
  contentContainerClassName?: string;
  extraPaddingBottom?: number;
}

const ScrollableWrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  children,
  className,
  contentContainerClassName,
  extraPaddingBottom = 0,
  ...props
}) => (
  <ScrollView
    className={className}
    contentContainerClassName={cn("pb-20", contentContainerClassName)}
    contentContainerStyle={{
      paddingBottom: extraPaddingBottom + theme.spacing["4xl"],
    }}
    showsVerticalScrollIndicator={false}
    {...props}
  >
    {children}
  </ScrollView>
);

const ViewWrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  children,
  className,
  extraPaddingBottom = 0,
  refreshControl: _refreshControl,
  ...props
}) => (
  <View
    className={className}
    style={{ paddingBottom: extraPaddingBottom }}
    {...props}
  >
    {children}
  </View>
);
