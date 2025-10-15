/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9f1",
          100: "#d6f1de",
          200: "#b2e3c2",
          300: "#88d3a4",
          400: "#61c28a",
          500: "#35b06f",
          600: "#27945a",
          700: "#1c7646",
          800: "#145934",
          900: "#0c3b21"
        },
        accent: {
          100: "#fdf2f2",
          200: "#fde8e8",
          300: "#fbd5d5",
          400: "#f8b4b4",
          500: "#f98080"
        }
      },
      fontFamily: {
        display: ["Lora_600SemiBold", "System"],
        body: ["Lora_400Regular", "System"]
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 118, 110, 0.08)"
      }
    }
  },
  plugins: []
};
