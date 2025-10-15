import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useSegments, useRouter } from "expo-router";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { theme } from "@/theme";
import "../styles/global.css";

const RootContent = () => {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setReady] = useState(false);

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

  useEffect(() => {
    const maybeHideSplash = async () => {
      if (isReady) {
        await SplashScreen.hideAsync();
      }
    };
    void maybeHideSplash();
  }, [isReady]);

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1 }}
      // className="[bg-[#f8f7f4]"
    >
      {/* <Slot /> */}
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
      {/* <Toast /> */}
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
            retry: 1,
          },
        },
      })
  );
  useEffect(() => {
    // Silence animation warnings during development
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <AuthProvider>
              <CartProvider>
                <RootContent />
              </CartProvider>
            </AuthProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
