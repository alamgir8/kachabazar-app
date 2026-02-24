/**
 * TrackingTimeline — A beautiful vertical timeline showing order tracking history
 * Matches the store's tracking timeline with mobile-optimized design
 */

import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow, format } from "date-fns";
import type { TrackingHistoryEntry } from "@/services/tracking";

interface TrackingTimelineProps {
  history: TrackingHistoryEntry[];
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    bgColor: string;
    iconColor: string;
    lineColor: string;
    dotColor: string;
  }
> = {
  "order-placed": {
    label: "Order Placed",
    icon: "shopping-bag",
    bgColor: "bg-blue-50",
    iconColor: "#3b82f6",
    lineColor: "#93c5fd",
    dotColor: "#3b82f6",
  },
  confirmed: {
    label: "Confirmed",
    icon: "check-circle",
    bgColor: "bg-indigo-50",
    iconColor: "#6366f1",
    lineColor: "#a5b4fc",
    dotColor: "#6366f1",
  },
  preparing: {
    label: "Preparing",
    icon: "clock",
    bgColor: "bg-yellow-50",
    iconColor: "#eab308",
    lineColor: "#fde68a",
    dotColor: "#eab308",
  },
  "ready-for-pickup": {
    label: "Ready for Pickup",
    icon: "package",
    bgColor: "bg-orange-50",
    iconColor: "#f97316",
    lineColor: "#fdba74",
    dotColor: "#f97316",
  },
  "picked-up": {
    label: "Picked Up",
    icon: "box" as any,
    bgColor: "bg-purple-50",
    iconColor: "#a855f7",
    lineColor: "#c4b5fd",
    dotColor: "#a855f7",
  },
  "on-the-way": {
    label: "On the Way",
    icon: "truck",
    bgColor: "bg-cyan-50",
    iconColor: "#06b6d4",
    lineColor: "#67e8f9",
    dotColor: "#06b6d4",
  },
  nearby: {
    label: "Out for Delivery",
    icon: "map-pin",
    bgColor: "bg-teal-50",
    iconColor: "#14b8a6",
    lineColor: "#5eead4",
    dotColor: "#14b8a6",
  },
  delivered: {
    label: "Delivered",
    icon: "home",
    bgColor: "bg-green-50",
    iconColor: "#22c55e",
    lineColor: "#86efac",
    dotColor: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    icon: "x-circle",
    bgColor: "bg-red-50",
    iconColor: "#ef4444",
    lineColor: "#fca5a5",
    dotColor: "#ef4444",
  },
  returned: {
    label: "Returned",
    icon: "rotate-ccw",
    bgColor: "bg-slate-50",
    iconColor: "#64748b",
    lineColor: "#cbd5e1",
    dotColor: "#64748b",
  },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    label: status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: "circle" as keyof typeof Feather.glyphMap,
    bgColor: "bg-slate-50",
    iconColor: "#64748b",
    lineColor: "#cbd5e1",
    dotColor: "#64748b",
  };

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  history,
}) => {
  // Show newest first
  const sortedHistory = [...history].reverse();

  return (
    <View className="px-1">
      {sortedHistory.map((entry, index) => {
        const config = getStatusConfig(entry.status);
        const isFirst = index === 0;
        const isLast = index === sortedHistory.length - 1;
        const relativeTime = formatDistanceToNow(new Date(entry.timestamp), {
          addSuffix: true,
        });
        const fullTime = format(
          new Date(entry.timestamp),
          "MMM dd, yyyy • h:mm a",
        );

        return (
          <View key={`${entry.status}-${entry.timestamp}`} className="flex-row">
            {/* Timeline column */}
            <View className="mr-4 items-center" style={{ width: 44 }}>
              {/* Icon circle */}
              <View
                className={`h-11 w-11 items-center justify-center rounded-full ${config.bgColor}`}
                style={
                  isFirst
                    ? {
                        shadowColor: config.iconColor,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 4,
                      }
                    : undefined
                }
              >
                <Feather
                  name={config.icon}
                  size={isFirst ? 20 : 18}
                  color={config.iconColor}
                />
              </View>
              {/* Connecting line */}
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    backgroundColor: config.lineColor,
                  }}
                />
              )}
            </View>

            {/* Content column */}
            <View
              className={`flex-1 pb-5 ${isFirst ? "" : "opacity-80"}`}
              style={{ paddingTop: 2 }}
            >
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-sm font-bold ${isFirst ? "text-slate-900" : "text-slate-600"}`}
                >
                  {config.label}
                </Text>
                {isFirst && (
                  <View className="rounded-full bg-green-100 px-2 py-0.5">
                    <Text className="text-[10px] font-bold text-green-700">
                      LATEST
                    </Text>
                  </View>
                )}
              </View>

              <Text className="mt-0.5 text-xs text-slate-400">
                {relativeTime}
              </Text>

              {entry.message ? (
                <Text className="mt-1.5 text-[13px] leading-5 text-slate-600">
                  {entry.message}
                </Text>
              ) : null}

              {entry.location?.address ? (
                <View className="mt-1.5 flex-row items-center gap-1">
                  <Feather name="map-pin" size={12} color="#94a3b8" />
                  <Text className="flex-1 text-xs text-slate-400">
                    {entry.location.address}
                  </Text>
                </View>
              ) : null}

              <Text className="mt-1 text-[10px] text-slate-300">
                {fullTime}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
