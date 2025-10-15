import { Text, TextProps } from "react-native";
import { cn } from "@/utils/cn";

export const Title: React.FC<TextProps> = ({ className, ...props }) => (
  <Text
    className={cn(
      "font-display text-2xl text-slate-900 tracking-tight",
      className
    )}
    {...props}
  />
);

export const Subtitle: React.FC<TextProps> = ({ className, ...props }) => (
  <Text
    className={cn(
      "font-semibold text-lg text-slate-700 tracking-tight",
      className
    )}
    {...props}
  />
);

export const Body: React.FC<TextProps> = ({ className, ...props }) => (
  <Text className={cn("text-base text-slate-600", className)} {...props} />
);
