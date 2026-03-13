import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import QueryProvider from "@/providers/queryProvider";
import { initDB } from "@/db";

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
        <View className="w-28 h-28 rounded-3xl bg-pomegranate-500 items-center justify-center shadow-lg">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>

        {/* App name */}
        <Text className="text-5xl font-bold text-pomegranate-950 tracking-tight">
          Nook
        </Text>

        {/* Tagline */}
        <Text className="text-base text-pomegranate-950 opacity-50 font-medium">
          your reading companion
        </Text>
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
    <QueryProvider>
      <SafeAreaProvider>
        {!isReady ? (
          <SplashScreen />
        ) : (
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        )}
      </SafeAreaProvider>
    </QueryProvider>
  );
}
