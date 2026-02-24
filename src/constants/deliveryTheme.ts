/**
 * Delivery App Theme Colors
 * Centralized color palette for the delivery boy app
 */

import type { ColorValue } from "react-native";

type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

export const DELIVERY_COLORS = {
  // Primary gradient (header backgrounds, buttons)
  primary: "#4f46e5", // indigo-600
  primaryLight: "#6366f1", // indigo-500
  primaryLighter: "#818cf8", // indigo-400
  gradient: ["#4f46e5", "#6366f1", "#818cf8"] as GradientColors,
  gradientHorizontal: ["#4f46e5", "#6366f1"] as GradientColors,

  // Loading / disabled states
  loadingBg: "#a5b4fc", // indigo-300

  // Accent backgrounds (cards, badges)
  accentBg: "#eef2ff", // indigo-50
  accentBgLight: "#e0e7ff", // indigo-100
  accentBorder: "#c7d2fe", // indigo-200

  // Text colors
  accentText: "#3730a3", // indigo-800
  accentTextLight: "#4338ca", // indigo-700

  // Tab bar
  tabActive: "#4f46e5",
  tabBorderTop: "#eef2ff",
} as const;
