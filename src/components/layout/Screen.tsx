import { ScrollView, ScrollViewProps, View, ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/utils/cn";

interface ScreenProps extends ViewProps {
  scrollable?: boolean;
  contentContainerClassName?: string;
  edges?: Array<"top" | "right" | "bottom" | "left">;
  bgColor?: "default" | "white" | "gradient";
}

export const Screen: React.FC<React.PropsWithChildren<ScreenProps>> = ({
  children,
  scrollable = false,
  className,
  contentContainerClassName,
  edges = ["top"],
  bgColor = "gradient",
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const Container = scrollable ? ScrollableWrapper : ViewWrapper;

  const paddingTop = edges.includes("top") ? insets.top : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom : 0;
  const paddingLeft = edges.includes("left") ? insets.left : 0;
  const paddingRight = edges.includes("right") ? insets.right : 0;

  return (
    <View className="flex-1" style={{ paddingTop, paddingLeft, paddingRight }}>
      {bgColor === "gradient" && (
        <LinearGradient
          colors={["#f0fdf4", "#ffffff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute inset-0"
        />
      )}
      {bgColor === "white" && <View className="absolute inset-0 bg-white" />}
      {bgColor === "default" && (
        <View className="absolute inset-0 bg-slate-50" />
      )}

      <Container
        className={cn("flex-1 px-4 pb-20 pt-4", className)}
        contentContainerClassName={contentContainerClassName}
        extraPaddingBottom={paddingBottom}
        {...props}
      >
        {children}
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
    contentContainerStyle={{ paddingBottom: extraPaddingBottom + 80 }}
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
