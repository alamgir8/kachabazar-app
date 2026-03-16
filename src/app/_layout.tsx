import { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { LogBox, View, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useSegments, useRouter } from "expo-router";

// Prevent the splash screen from auto-hiding.
// Wrapped in a flag so we know whether it succeeded.
let splashScreenReady = false;
try {
  SplashScreen.preventAutoHideAsync();
  splashScreenReady = true;
} catch {
  // Ignore – on web or when the native module is unavailable
}
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppModeProvider, useAppMode } from "@/contexts/AppModeContext";
import { DeliveryAuthProvider } from "@/contexts/DeliveryAuthContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import AppModeChooser from "@/components/common/AppModeChooser";
import { theme } from "@/theme";
import { logger } from "@/utils/logger";
import { analytics } from "@/utils/analytics";
import { env, validateEnvironmentConfig } from "@/config/environment";
import { toastConfig } from "@/components/ui/ToastConfig";
import Toast from "react-native-toast-message";
import "../styles/global.css";

const RootContent = () => {
  const segments = useSegments();
  const router = useRouter();
  const { mode, isReady: modeReady, isFirstLaunch } = useAppMode();
  const [isReady, setReady] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          // Add any custom fonts here if needed
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }

    prepare();
  }, []);

  // Hide the splash screen once everything is ready
  const hideSplash = useCallback(async () => {
    if (splashHidden) return;
    if (!splashScreenReady) {
      // Native splash was never registered – just mark as hidden
      setSplashHidden(true);
      return;
    }
    try {
      await SplashScreen.hideAsync();
    } catch {
      // Ignore - splash screen may already be hidden
    } finally {
      setSplashHidden(true);
    }
  }, [splashHidden]);

  useEffect(() => {
    if (isReady && modeReady) {
      void hideSplash();
    }
  }, [isReady, modeReady, hideSplash]);

  // Navigate to delivery login when mode switches to delivery
  useEffect(() => {
    if (!isReady || !modeReady || isFirstLaunch) return;

    const inDeliveryRoute = segments[0] === "delivery";

    if (mode === "delivery" && !inDeliveryRoute) {
      router.replace("/delivery/login");
    } else if (mode === "store" && inDeliveryRoute) {
      router.replace("/(tabs)");
    }
  }, [mode, isReady, modeReady, isFirstLaunch]);

  // Show a loading indicator while resources and mode are loading
  if (!isReady || !modeReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <AppModeChooser />
    </SafeAreaView>
  );
};

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: env.maxRetries,
            staleTime: 1000 * 60,
            cacheTime: env.cacheTimeout,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Validate environment configuration
        const validation = validateEnvironmentConfig();
        if (!validation.valid) {
          logger.warn(
            "Environment configuration issues",
            validation.errors,
            "App",
          );
        }

        // Initialize analytics
        analytics.initialize({ enabled: env.enableAnalytics });

        logger.info(
          "App initialized successfully",
          {
            environment: env.env,
            version: "1.0.0",
          },
          "App",
        );
      } catch (error) {
        logger.error("App initialization failed", error, "App");
      }
    };

    initializeApp();

    // Silence animation warnings during development
    if (__DEV__) {
      LogBox.ignoreAllLogs();
    }
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <AppModeProvider>
              <SettingsProvider>
                <AuthProvider>
                  <CartProvider>
                    <DeliveryAuthProvider>
                      <RootContent />
                      <Toast config={toastConfig} />
                    </DeliveryAuthProvider>
                  </CartProvider>
                </AuthProvider>
              </SettingsProvider>
            </AppModeProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
