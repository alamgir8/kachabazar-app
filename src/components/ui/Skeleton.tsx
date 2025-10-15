import React from "react";
import { View, ActivityIndicator, DimensionValue } from "react-native";
import { cn } from "@/utils/cn";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const roundedStyles = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  rounded = "md",
  className,
}) => {
  return (
    <View
      style={{ width, height }}
      className={cn(
        "bg-neutral-200 animate-pulse",
        roundedStyles[rounded],
        className
      )}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <Skeleton width="100%" height={160} rounded="lg" className="mb-3" />
      <Skeleton width="80%" height={16} className="mb-2" />
      <Skeleton width="60%" height={14} className="mb-3" />
      <View className="flex-row justify-between items-center">
        <Skeleton width={80} height={24} rounded="lg" />
        <Skeleton width={40} height={40} rounded="lg" />
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View className="gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number }> = ({
  count = 1,
}) => {
  return (
    <View className="flex-1 p-5">
      <SkeletonList count={count} />
    </View>
  );
};

export const LoadingSpinner: React.FC<{
  size?: "small" | "large";
  color?: string;
}> = ({ size = "large", color = "#10b981" }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
