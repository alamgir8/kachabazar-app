export const theme = {
  colors: {
    // Primary palette - Fresh green theme inspired by Big Cart
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    // Accent palette - Vibrant green
    accent: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    // Neutrals
    slate: {
      25: "#fafbff",
      50: "#f4f6fb",
      100: "#e8ecf4",
      200: "#d4dbea",
      300: "#b8c2d6",
      400: "#8c9ab5",
      500: "#667493",
      600: "#4a5975",
      700: "#36435b",
      800: "#243145",
      900: "#121a28",
    },
    // Status colors
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Background & Surface
    background: "#f5f7fb",
    backgroundAlt: "#eff7f6",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",

    // Text
    text: {
      primary: "#121a28",
      secondary: "#4a5975",
      tertiary: "#8c9ab5",
      inverse: "#ffffff",
    },

    // Borders
    border: {
      light: "#e8ecf4",
      default: "#d4dbea",
      dark: "#b8c2d6",
    },
    // Elevated glass overlay
    glass: "rgba(255, 255, 255, 0.72)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 18,
    xl: 24,
    "2xl": 28,
    "3xl": 36,
    "4xl": 48,
    "5xl": 56,
    "6xl": 72,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 34,
    "5xl": 42,
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  borderRadius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    "2xl": 28,
    "3xl": 36,
    pill: 999,
    full: 9999,
  },

  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.09,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#0f4b52",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
      elevation: 10,
    },
    xl: {
      shadowColor: "#0c3740",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 28,
      elevation: 16,
    },
  },
  layout: {
    maxWidth: 1080,
  },
} as const;

export type Theme = typeof theme;
