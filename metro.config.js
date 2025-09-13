const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add custom path aliases for Metro
config.resolver.extraNodeModules = {
  "@/assets": path.resolve(__dirname, "src/assets"),
  "@/components": path.resolve(__dirname, "src/components"),
  "@/context": path.resolve(__dirname, "src/context"),
  "@/hooks": path.resolve(__dirname, "src/hooks"),
  "@/layout": path.resolve(__dirname, "src/layout"),
  "@/services": path.resolve(__dirname, "src/services"),
  "@/template": path.resolve(__dirname, "src/template"),
  "@/theme": path.resolve(__dirname, "src/theme"),
  "@/utils": path.resolve(__dirname, "src/utils"),
  "@/store": path.resolve(__dirname, "src/store"),
  "@/app": path.resolve(__dirname, "src/app"),
  "@/constants": path.resolve(__dirname, "src/constants"),
};

// Wrap the configuration for Reanimated
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// Wrap the configuration for NativeWind
const finalConfig = withNativeWind(reanimatedConfig, {
  input: "./src/assets/css/global.css",
});

module.exports = finalConfig;
