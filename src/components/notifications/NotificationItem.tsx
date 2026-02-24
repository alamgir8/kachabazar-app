/**
 * NotificationItem — A single notification row with icon, colors, read status
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import type { CustomerNotification } from "@/services/tracking";

interface NotificationItemProps {
  notification: CustomerNotification;
  onPress: (notification: CustomerNotification) => void;
}

const NOTIFICATION_CONFIG: Record<
  string,
  {
    icon: keyof typeof Feather.glyphMap;
    color: string;
    bgColor: string;
  }
> = {
  "order-placed": {
    icon: "shopping-bag",
    color: "#3b82f6",
    bgColor: "#eff6ff",
  },
  "order-confirmed": {
    icon: "check-circle",
    color: "#6366f1",
    bgColor: "#eef2ff",
  },
  "order-preparing": {
    icon: "clock",
    color: "#eab308",
    bgColor: "#fefce8",
  },
  "order-ready": {
    icon: "package",
    color: "#f97316",
    bgColor: "#fff7ed",
  },
  "order-picked-up": {
    icon: "box" as any,
    color: "#a855f7",
    bgColor: "#faf5ff",
  },
  "order-on-the-way": {
    icon: "truck",
    color: "#06b6d4",
    bgColor: "#ecfeff",
  },
  "order-nearby": {
    icon: "map-pin",
    color: "#14b8a6",
    bgColor: "#f0fdfa",
  },
  "order-delivered": {
    icon: "home",
    color: "#22c55e",
    bgColor: "#f0fdf4",
  },
  "order-cancelled": {
    icon: "x-circle",
    color: "#ef4444",
    bgColor: "#fef2f2",
  },
  "delivery-assigned": {
    icon: "user-check",
    color: "#0f766e",
    bgColor: "#f0fdfa",
  },
  "rating-request": {
    icon: "star",
    color: "#eab308",
    bgColor: "#fefce8",
  },
  general: {
    icon: "bell",
    color: "#64748b",
    bgColor: "#f8fafc",
  },
};

const getNotificationConfig = (type: string) =>
  NOTIFICATION_CONFIG[type] ?? NOTIFICATION_CONFIG.general;

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const config = getNotificationConfig(notification.type);
  const isUnread = notification.status === "unread";
  const relativeTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <Pressable
      onPress={() => onPress(notification)}
      className={`mb-3 overflow-hidden rounded-2xl active:opacity-80 ${isUnread ? "bg-white" : "bg-slate-50/70"}`}
      style={
        isUnread
          ? {
              shadowColor: config.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
              borderLeftWidth: 3,
              borderLeftColor: config.color,
            }
          : {
              borderLeftWidth: 3,
              borderLeftColor: "transparent",
            }
      }
    >
      <View className="flex-row items-start gap-3 px-4 py-4">
        {/* Icon */}
        <View
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: config.bgColor }}
        >
          <Feather name={config.icon} size={20} color={config.color} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`flex-1 text-sm ${isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-600"}`}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {isUnread && (
              <View className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            )}
          </View>

          <Text
            className={`mt-0.5 text-[13px] leading-5 ${isUnread ? "text-slate-600" : "text-slate-400"}`}
            numberOfLines={2}
          >
            {notification.message}
          </Text>

          <Text className="mt-1.5 text-xs text-slate-400">{relativeTime}</Text>
        </View>
      </View>
    </Pressable>
  );
};
