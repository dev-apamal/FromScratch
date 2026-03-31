// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useLocationStore } from "@/store/locationStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  const hydrate = useLocationStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* 🧠 This registers the location page as a stack screen.
              presentation: "modal" gives it the iOS modal slide-up
              animation — feels native without any extra work.
              headerShown: false because we build our own header. */}
          <Stack.Screen
            name="location"
            options={{
              presentation: "modal",
              title: "Select Location",
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              title: "Search Results",
              headerBackTitle: "Home",
              // 🧠 headerBackTitle sets the back button label on iOS —
              // instead of just "<" it shows "< Home" so the user knows
              // exactly where they'll go back to.
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
