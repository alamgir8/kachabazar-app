/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2fdfb",
          100: "#d6faf1",
          200: "#aeefe2",
          300: "#7fe0ce",
          400: "#4fcfba",
          500: "#26bda6",
          600: "#199e8a",
          700: "#147d71",
          800: "#106158",
          900: "#0c4641",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
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
      },
      fontFamily: {
        display: ["System"],
        body: ["System"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 118, 110, 0.08)",
      },
    },
  },
  plugins: [],
};
