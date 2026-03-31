// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useLocationStore } from "@/store/locationStore";
import { useCartStore } from "@/store/cartStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  const hydrateLocation = useLocationStore((state) => state.hydrate);
  const hydrateCart = useCartStore((state) => state.hydrate);

  useEffect(() => {
    Promise.all([hydrateLocation(), hydrateCart()]);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="location"
            options={{ presentation: "modal", title: "Select Location" }}
          />
          <Stack.Screen
            name="search"
            options={{ title: "Search Results", headerBackTitle: "Home" }}
          />
          <Stack.Screen
            name="temple/[id]"
            options={{ title: "", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="temple/pooja/[id]"
            options={{ title: "", headerBackTitle: "Back" }}
          />
          {/* 🧠 Cart is now a regular full screen push — no modal.
              This gives us full SafeAreaView control and feels more
              like a proper checkout page than a floating sheet. */}
          <Stack.Screen
            name="cart"
            options={{ title: "Your Cart", headerBackTitle: "Back" }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
