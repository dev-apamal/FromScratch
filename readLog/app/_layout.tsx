import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import QueryProvider from "@/providers/queryProvider";
import { initDB } from "@/db";
import AnalyticsProvider from "@/providers/analyticsProvider";

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
        {/* App icon */}

        <Image
          source={require("../assets/images/Icon-Default.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />

        {/* App name */}
        <View className="flex items-center gap-1">
          <Text className="text-2xl font-bold text-pomegranate-950 tracking-tight">
            The Reading Nook
          </Text>

          {/* Tagline */}
          <Text className="text-sm text-pomegranate-950 opacity-80 font-medium tracking-tight">
            Your Reading Companion
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <AnalyticsProvider>
      <QueryProvider>
        <SafeAreaProvider>
          {!isReady ? (
            <SplashScreen />
          ) : (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          )}
        </SafeAreaProvider>
      </QueryProvider>
    </AnalyticsProvider>
  );
}
