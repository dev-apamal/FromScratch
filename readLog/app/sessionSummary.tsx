// import { BookItem } from "@/types/bookItem";
// import StatCard from "@/components/statCard";
// import ErrorBoundary from "@/components/errorBoundary";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Image, Pressable, ScrollView, Text, View } from "react-native";
// import { Stack } from "expo-router";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withSpring,
//   withTiming,
//   Easing,
// } from "react-native-reanimated";
// import formatDuration from "@/utils/formatDuration";

// function getSessionMessage(durationSeconds: number): string {
//   const minutes = durationSeconds / 60;
//   if (minutes < 2) return "Every page is a step forward!";
//   if (minutes < 5) return "Small steps lead to big journeys!";
//   if (minutes < 10) return "Nice work! Keep the momentum going.";
//   if (minutes < 20) return "Solid session! You're building a great habit.";
//   if (minutes < 40) return "Another great session!";
//   if (minutes < 60) return "Impressive dedication today!";
//   return "You're absolutely on fire! 🔥";
// }

// function SessionSummaryContent() {
//   const router = useRouter();
//   const params = useLocalSearchParams<{
//     bookJson: string;
//     sessionSeconds: string;
//     pagesThisSession: string;
//     currentPage: string;
//     readingPacePerHour: string;
//   }>();

//   const book: BookItem = JSON.parse(params.bookJson);
//   const sessionSeconds = Number(params.sessionSeconds ?? 0);
//   const pagesThisSession = Number(params.pagesThisSession ?? 0);
//   const currentPage = Number(params.currentPage ?? book.currentPage);
//   const readingPacePerHour = Number(params.readingPacePerHour ?? 0);

//   const coverOpacity = useSharedValue(0);
//   const coverScale = useSharedValue(0.82);
//   const msgOpacity = useSharedValue(0);
//   const msgY = useSharedValue(12);
//   const statsOpacity = useSharedValue(0);
//   const statsY = useSharedValue(20);
//   const btnOpacity = useSharedValue(0);

//   useEffect(() => {
//     coverOpacity.value = withTiming(1, { duration: 480 });
//     coverScale.value = withSpring(1, { damping: 14, stiffness: 100 });
//     msgOpacity.value = withDelay(380, withTiming(1, { duration: 350 }));
//     msgY.value = withDelay(
//       380,
//       withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }),
//     );
//     statsOpacity.value = withDelay(620, withTiming(1, { duration: 380 }));
//     statsY.value = withDelay(
//       620,
//       withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }),
//     );
//     btnOpacity.value = withDelay(900, withTiming(1, { duration: 300 }));
//   }, []);

//   const coverStyle = useAnimatedStyle(() => ({
//     opacity: coverOpacity.value,
//     transform: [{ scale: coverScale.value }],
//   }));
//   const msgStyle = useAnimatedStyle(() => ({
//     opacity: msgOpacity.value,
//     transform: [{ translateY: msgY.value }],
//   }));
//   const statsStyle = useAnimatedStyle(() => ({
//     opacity: statsOpacity.value,
//     transform: [{ translateY: statsY.value }],
//   }));
//   const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

//   return (
//     <View className="flex-1 bg-pomegranate-50">
//       <Stack.Screen options={{ headerShown: false }} />
//       <ScrollView
//         className="flex-1"
//         contentContainerClassName="p-4 pt-safe pb-safe gap-6 items-center"
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={coverStyle}>
//           <Image
//             source={
//               book.coverUrl
//                 ? { uri: book.coverUrl }
//                 : require("@/assets/images/DummyBookIcon.png")
//             }
//             className="w-64 h-96 rounded-2xl"
//             resizeMode="cover"
//           />
//         </Animated.View>

//         <Animated.View style={msgStyle} className="items-center gap-1">
//           <Text className="text-2xl font-bold text-pomegranate-950 text-center">
//             {book.title}
//           </Text>
//           <Text className="text-base text-pomegranate-950 opacity-80">
//             by {book.author}
//           </Text>
//         </Animated.View>

//         <Animated.Text
//           style={msgStyle}
//           className="text-xl font-semibold text-pomegranate-950 opacity-80 text-center"
//         >
//           {getSessionMessage(sessionSeconds)}
//         </Animated.Text>

//         <Animated.View
//           style={[msgStyle, { width: "100%" }]}
//           className="bg-pomegranate-100 rounded-2xl p-4 gap-3"
//         >
//           <Text className="text-xs text-pomegranate-950 opacity-60 uppercase tracking-widest">
//             Progress made
//           </Text>
//           <View className="gap-2">
//             <View className="flex-row justify-between">
//               <Text className="text-sm text-pomegranate-950 opacity-80">
//                 {currentPage - pagesThisSession} pages before
//               </Text>
//               <Text className="text-sm font-semibold text-pomegranate-950 opacity-80">
//                 {currentPage} / {book.pageCount}
//               </Text>
//             </View>
//             <View className="h-2 bg-pomegranate-200 rounded-full overflow-hidden">
//               <View
//                 className="h-full bg-pomegranate-300 rounded-full absolute"
//                 style={{
//                   width: `${((currentPage - pagesThisSession) / book.pageCount) * 100}%`,
//                 }}
//               />
//               <View
//                 className="h-full bg-pomegranate-500 rounded-full"
//                 style={{
//                   width: `${Math.min((currentPage / book.pageCount) * 100, 100)}%`,
//                 }}
//               />
//             </View>
//           </View>
//           <Text className="text-sm text-pomegranate-950 font-medium">
//             +{pagesThisSession} pages this session ·{" "}
//             {Math.max(0, book.pageCount - currentPage)} to go
//           </Text>
//         </Animated.View>

//         <Animated.View
//           style={[statsStyle, { width: "100%" }]}
//           className="gap-4"
//         >
//           <View className="flex-row gap-3">
//             <StatCard
//               label={"Pages read this\nsession"}
//               value={String(pagesThisSession)}
//               flex
//             />
//             <StatCard
//               label={"Time in this\nsession"}
//               value={formatDuration(sessionSeconds)}
//               flex
//             />
//           </View>
//           <View className="flex-row gap-3">
//             <StatCard
//               label={"Reading pace\n(per hour)"}
//               value={`${readingPacePerHour} pg`}
//               flex
//             />
//             <StatCard
//               label={"Total pages read\nso far"}
//               value={`${currentPage}/${book.pageCount}`}
//               flex
//             />
//           </View>
//         </Animated.View>

//         <Animated.View style={btnStyle} className="p4 w-full bg-pomegranate-50">
//           <Pressable
//             onPress={() => router.replace("./(tabs)/")}
//             className="w-full bg-pomegranate-500 rounded-full py-5 items-center active:opacity-80"
//           >
//             <Text className="text-white text-base font-semibold">
//               Back to Shelf
//             </Text>
//           </Pressable>
//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// }

// export default function SessionSummaryScreen() {
//   return (
//     <ErrorBoundary>
//       <SessionSummaryContent />
//     </ErrorBoundary>
//   );
// }

import StatCard from "@/components/statCard";
import ErrorBoundary from "@/components/errorBoundary";
import { useBookById } from "@/hooks/useShelf";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import formatDuration from "@/utils/formatDuration";
import { Colors } from "@/constants/colors";

function getSessionMessage(durationSeconds: number): string {
  const minutes = durationSeconds / 60;
  if (minutes < 2) return "Every page is a step forward!";
  if (minutes < 5) return "Small steps lead to big journeys!";
  if (minutes < 10) return "Nice work! Keep the momentum going.";
  if (minutes < 20) return "Solid session! You're building a great habit.";
  if (minutes < 40) return "Another great session!";
  if (minutes < 60) return "Impressive dedication today!";
  return "You're absolutely on fire! 🔥";
}

function SessionSummaryContent() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookId: string;
    sessionSeconds: string;
    pagesThisSession: string;
    currentPage: string;
    readingPacePerHour: string;
  }>();

  // Fetch book fresh from SQLite — no JSON parsing from URL params
  const { data: book, isLoading: bookLoading } = useBookById(params.bookId);

  const sessionSeconds = Number(params.sessionSeconds ?? 0);
  const pagesThisSession = Number(params.pagesThisSession ?? 0);
  const currentPage = Number(params.currentPage ?? 0);
  const readingPacePerHour = Number(params.readingPacePerHour ?? 0);

  const coverOpacity = useSharedValue(0);
  const coverScale = useSharedValue(0.82);
  const msgOpacity = useSharedValue(0);
  const msgY = useSharedValue(12);
  const statsOpacity = useSharedValue(0);
  const statsY = useSharedValue(20);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    if (!book) return;
    coverOpacity.value = withTiming(1, { duration: 480 });
    coverScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    msgOpacity.value = withDelay(380, withTiming(1, { duration: 350 }));
    msgY.value = withDelay(
      380,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }),
    );
    statsOpacity.value = withDelay(620, withTiming(1, { duration: 380 }));
    statsY.value = withDelay(
      620,
      withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }),
    );
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 300 }));
  }, [book]);

  const coverStyle = useAnimatedStyle(() => ({
    opacity: coverOpacity.value,
    transform: [{ scale: coverScale.value }],
  }));
  const msgStyle = useAnimatedStyle(() => ({
    opacity: msgOpacity.value,
    transform: [{ translateY: msgY.value }],
  }));
  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [{ translateY: statsY.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  // ── Loading state ──────────────────────────────────────────────────────────

  if (bookLoading) {
    return (
      <View className="flex-1 bg-pomegranate-50 items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={Colors.pomegranate[500]} size="large" />
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 bg-pomegranate-50 items-center justify-center p-8 gap-4">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-lg text-pomegranate-950 text-center opacity-60">
          Session saved, but the book could not be loaded.
        </Text>
        <Pressable
          onPress={() => router.replace("./(tabs)/")}
          className="bg-pomegranate-500 rounded-full px-6 py-3"
        >
          <Text className="text-white text-base font-semibold">
            Go to shelf
          </Text>
        </Pressable>
      </View>
    );
  }

  // ── Main summary (book is guaranteed non-null below this line) ─────────────

  return (
    <View className="flex-1 bg-pomegranate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pt-safe pb-safe gap-6 items-center"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={coverStyle}>
          <Image
            source={
              book.coverUrl
                ? { uri: book.coverUrl }
                : require("@/assets/images/DummyBookIcon.png")
            }
            className="w-64 h-96 rounded-2xl"
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View style={msgStyle} className="items-center gap-1">
          <Text className="text-2xl font-bold text-pomegranate-950 text-center">
            {book.title}
          </Text>
          <Text className="text-base text-pomegranate-950 opacity-80">
            by {book.author}
          </Text>
        </Animated.View>

        <Animated.Text
          style={msgStyle}
          className="text-xl font-semibold text-pomegranate-950 opacity-80 text-center"
        >
          {getSessionMessage(sessionSeconds)}
        </Animated.Text>

        <Animated.View
          style={[msgStyle, { width: "100%" }]}
          className="bg-pomegranate-100 rounded-2xl p-4 gap-3"
        >
          <Text className="text-xs text-pomegranate-950 opacity-60 uppercase tracking-widest">
            Progress made
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-pomegranate-950 opacity-80">
                {currentPage - pagesThisSession} pages before
              </Text>
              <Text className="text-sm font-semibold text-pomegranate-950 opacity-80">
                {currentPage} / {book.pageCount}
              </Text>
            </View>
            <View className="h-2 bg-pomegranate-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-pomegranate-300 rounded-full absolute"
                style={{
                  width: `${((currentPage - pagesThisSession) / book.pageCount) * 100}%`,
                }}
              />
              <View
                className="h-full bg-pomegranate-500 rounded-full"
                style={{
                  width: `${Math.min((currentPage / book.pageCount) * 100, 100)}%`,
                }}
              />
            </View>
          </View>
          <Text className="text-sm text-pomegranate-950 font-medium">
            +{pagesThisSession} pages this session ·{" "}
            {Math.max(0, book.pageCount - currentPage)} to go
          </Text>
        </Animated.View>

        <Animated.View
          style={[statsStyle, { width: "100%" }]}
          className="gap-4"
        >
          <View className="flex-row gap-3">
            <StatCard
              label={"Pages read this\nsession"}
              value={String(pagesThisSession)}
              flex
            />
            <StatCard
              label={"Time in this\nsession"}
              value={formatDuration(sessionSeconds)}
              flex
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              label={"Reading pace\n(per hour)"}
              value={`${readingPacePerHour} pg`}
              flex
            />
            <StatCard
              label={"Total pages read\nso far"}
              value={`${currentPage}/${book.pageCount}`}
              flex
            />
          </View>
        </Animated.View>

        <Animated.View style={btnStyle} className="p4 w-full bg-pomegranate-50">
          <Pressable
            onPress={() => router.replace("./(tabs)/")}
            className="w-full bg-pomegranate-500 rounded-full py-5 items-center active:opacity-80"
          >
            <Text className="text-white text-base font-semibold">
              Back to Shelf
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export default function SessionSummaryScreen() {
  return (
    <ErrorBoundary>
      <SessionSummaryContent />
    </ErrorBoundary>
  );
}
