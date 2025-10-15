import { ScrollView, ScrollViewProps, View, ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/utils/cn";

interface ScreenProps extends ViewProps {
  scrollable?: boolean;
  contentContainerClassName?: string;
}

export const Screen: React.FC<React.PropsWithChildren<ScreenProps>> = ({
  children,
  scrollable = false,
  className,
  contentContainerClassName,
  ...props
}) => {
  const Container = scrollable ? ScrollableWrapper : ViewWrapper;
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#f5fbf7", "#f8fafc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <Container
        className={cn("flex-1 px-5 pb-24 pt-6", className)}
        contentContainerClassName={contentContainerClassName}
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
}

const ScrollableWrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  children,
  className,
  contentContainerClassName,
  ...props
}) => (
  <ScrollView
    className={className}
    contentContainerClassName={cn("pb-20", contentContainerClassName)}
    showsVerticalScrollIndicator={false}
    {...props}
  >
    {children}
  </ScrollView>
);

const ViewWrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  children,
  className,
  ...props
}) => (
  <View className={className} {...props}>
    {children}
  </View>
);
