import { View, ViewProps } from "react-native";

import { cn } from "@/utils/cn";

export const Surface: React.FC<ViewProps> = ({ className, ...props }) => (
  <View
    className={cn(
      "rounded-3xl bg-white p-4 shadow-[0_12px_40px_rgba(15,118,110,0.08)]",
      className
    )}
    {...props}
  />
);
