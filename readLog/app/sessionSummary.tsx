import { BookItem } from "@/types/bookItem";
import StatCard from "@/components/statCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
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

export default function SessionSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookJson: string;
    sessionSeconds: string;
    pagesThisSession: string;
    currentPage: string;
    readingPacePerHour: string;
  }>();

  const book: BookItem = JSON.parse(params.bookJson);
  const sessionSeconds = Number(params.sessionSeconds ?? 0);
  const pagesThisSession = Number(params.pagesThisSession ?? 0);
  const currentPage = Number(params.currentPage ?? book.currentPage);
  const readingPacePerHour = Number(params.readingPacePerHour ?? 0);

  // ── Animation values ───────────────────────────────────────────────────────
  const coverOpacity = useSharedValue(0);
  const coverScale = useSharedValue(0.82);
  const msgOpacity = useSharedValue(0);
  const msgY = useSharedValue(12);
  const statsOpacity = useSharedValue(0);
  const statsY = useSharedValue(20);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Cover fades + springs in
    coverOpacity.value = withTiming(1, { duration: 480 });
    coverScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    // 2. Message slides up after cover lands
    msgOpacity.value = withDelay(380, withTiming(1, { duration: 350 }));
    msgY.value = withDelay(
      380,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }),
    );
    // 3. Stats rise after message
    statsOpacity.value = withDelay(620, withTiming(1, { duration: 380 }));
    statsY.value = withDelay(
      620,
      withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }),
    );
    // 4. Continue button last
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 300 }));
  }, []);

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

  return (
    <View className="flex-1 bg-pomegranate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-16 pb-36 gap-6 items-center"
        showsVerticalScrollIndicator={false}
      >
        {/* Book cover */}
        <Animated.View style={coverStyle}>
          <Image
            source={
              book.coverUrl
                ? { uri: book.coverUrl }
                : require("@/assets/images/DummyBookCover.png")
            }
            className="w-64 h-96 rounded-2xl"
            resizeMode="cover"
          />
        </Animated.View>

        {/* Headline */}
        <Animated.Text
          style={msgStyle}
          className="text-2xl font-bold text-pomegranate-950 text-center"
        >
          {getSessionMessage(sessionSeconds)}
        </Animated.Text>

        {/* Stats grid */}
        <Animated.View
          style={[statsStyle, { width: "100%" }]}
          className="gap-3"
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
      </ScrollView>

      {/* Continue button */}
      <Animated.View
        style={btnStyle}
        className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-3 bg-pomegranate-50"
      >
        <Pressable
          onPress={() => router.replace("./(tabs)/")}
          className="w-full bg-pomegranate-500 rounded-full py-5 items-center active:opacity-80"
        >
          <Text className="text-white text-base font-semibold">Continue</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
