import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import QueryProvider from "@/providers/queryProvider";
import { initDB } from "@/db";
import AnalyticsProvider from "@/providers/analyticsProvider";
import ErrorBoundary from "@/components/errorBoundary";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Only send events in production — keeps your Sentry dashboard clean
  enabled: !__DEV__,
  // Capture 20% of sessions as performance traces
  // enabled: true,
  tracesSampleRate: 0.2,
});

function SplashScreen() {
  const opacity = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.85))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-pomegranate-50 items-center justify-center gap-4">
      <Animated.View
        style={{ opacity, transform: [{ scale }] }}
        className="items-center gap-4"
      >
        <Image
          source={require("../assets/images/Icon-Default.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />
        <View className="flex items-center gap-1">
          <Text className="text-2xl font-bold text-pomegranate-950 tracking-tight">
            The Reading Nook
          </Text>
          <Text className="text-base text-pomegranate-950 opacity-80 font-medium tracking-tight">
            Your Reading Companion
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default Sentry.wrap(function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const minDisplay = new Promise((r) => setTimeout(r, 1800));
    Promise.all([initDB(), minDisplay])
      .catch(console.error)
      .finally(() => setIsReady(true));
  }, []);

  return (
    // Outermost boundary: catches errors in providers themselves.
    // bare=true because SafeAreaProvider is not mounted yet at this level.
    <ErrorBoundary bare>
      <AnalyticsProvider>
        <QueryProvider>
          <SafeAreaProvider>
            {!isReady ? (
              <SplashScreen />
            ) : (
              // Inner boundary: catches any screen-level crash without
              // taking down the providers above it
              <ErrorBoundary>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </ErrorBoundary>
            )}
          </SafeAreaProvider>
        </QueryProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
});
