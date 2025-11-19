const IS_DEV = process.env.EXPO_PUBLIC_ENV === "development";
const IS_STAGING = process.env.EXPO_PUBLIC_ENV === "staging";

export default {
  expo: {
    name: IS_DEV ? "KachaBazar (Dev)" : "KachaBazar",
    slug: "kachabazar-mobile",
    scheme: "kachabazar",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./src/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#f8fafc",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: IS_DEV
        ? "com.kachabazar.mobile.dev"
        : IS_STAGING
          ? "com.kachabazar.mobile.staging"
          : "com.kachabazar.mobile",
      buildNumber: "1",
      infoPlist: {
        NSCameraUsageDescription:
          "This app needs access to your camera to scan barcodes and take photos.",
        NSPhotoLibraryUsageDescription:
          "This app needs access to your photo library to upload product images.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: IS_DEV
        ? "com.kachabazar.mobile.dev"
        : IS_STAGING
          ? "com.kachabazar.mobile.staging"
          : "com.kachabazar.mobile",
      versionCode: 1,
      permissions: [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
          },
          ios: {
            deploymentTarget: "15.1",
          },
        },
      ],
      "expo-web-browser",
      [
        "expo-camera",
        {
          cameraPermission: "Allow KachaBazar to access your camera.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || "",
      },
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      apiPort: process.env.EXPO_PUBLIC_API_PORT,
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
      paypalClientId: process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID,
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    },
    experiments: {
      typedRoutes: true,
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: process.env.EXPO_PUBLIC_UPDATES_URL,
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
};
