// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { Animated, Image, Text, View } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import "../global.css";
// import QueryProvider from "@/providers/queryProvider";
// import { initDB } from "@/db";
// import AnalyticsProvider from "@/providers/analyticsProvider";
// import ErrorBoundary from "@/components/errorBoundary";
// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://96a6344905a8a4715049a4dace02a39b@o4511053465452544.ingest.de.sentry.io/4511053465976912',

//   // Adds more context data to events (IP address, cookies, user, etc.)
//   // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
//   sendDefaultPii: true,

//   // Enable Logs
//   enableLogs: true,

//   // Configure Session Replay
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1,
//   integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // spotlight: __DEV__,
// });

// function SplashScreen() {
//   const opacity = useState(new Animated.Value(0))[0];
//   const scale = useState(new Animated.Value(0.85))[0];

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(opacity, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scale, {
//         toValue: 1,
//         friction: 6,
//         tension: 80,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   return (
//     <View className="flex-1 bg-pomegranate-50 items-center justify-center gap-4">
//       <Animated.View
//         style={{ opacity, transform: [{ scale }] }}
//         className="items-center gap-4"
//       >
//         {/* App icon */}

//         <Image
//           source={require("../assets/images/Icon-Default.png")}
//           className="w-40 h-40"
//           resizeMode="contain"
//         />

//         {/* App name */}
//         <View className="flex items-center gap-1">
//           <Text className="text-2xl font-bold text-pomegranate-950 tracking-tight">
//             The Reading Nook
//           </Text>

//           {/* Tagline */}
//           <Text className="text-base text-pomegranate-950 opacity-80 font-medium tracking-tight">
//             Your Reading Companion
//           </Text>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// export default Sentry.wrap(function RootLayout() {
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const minDisplay = new Promise((r) => setTimeout(r, 1800));
//     Promise.all([initDB(), minDisplay])
//       .catch(console.error)
//       .finally(() => setIsReady(true));
//   }, []);

//   return (
//     <ErrorBoundary>
//       <AnalyticsProvider>
//         <QueryProvider>
//           <SafeAreaProvider>
//             {!isReady ? (
//               <SplashScreen />
//             ) : (
//               // Inner boundary: catches any screen-level crash without
//               // taking down the providers above it
//               (<ErrorBoundary>
//                 <Stack>
//                   <Stack.Screen
//                     name="(tabs)"
//                     options={{ headerShown: false }}
//                   />
//                 </Stack>
//               </ErrorBoundary>)
//             )}
//           </SafeAreaProvider>
//         </QueryProvider>
//       </AnalyticsProvider>
//     </ErrorBoundary>
//   );
// });

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
