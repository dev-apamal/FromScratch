import { BookItem } from "@/types/bookItem";
import { getBookSessionData, saveSession } from "@/store/sessionStore";
import { SessionItem } from "@/types/sessionItem";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useFinishBook, useUpdateBookProgress } from "@/hooks/useShelf";
import StatCard from "@/components/statCard";
import PageStepper from "@/components/pageStepper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import formatDuration from "@/utils/formatDuration";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function UpdateProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookJson: string }>();
  const book: BookItem = JSON.parse(params.bookJson);

  const {
    sessionSeconds,
    isRunning,
    sessionStartTime,
    handleStart,
    handleStop,
  } = useSessionTimer();

  const [currentPage, setCurrentPage] = useState(book.currentPage);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [pastSessions, setPastSessions] = useState<SessionItem[]>([]);

  const { mutate: updateProgress } = useUpdateBookProgress();
  const { mutate: finishBook } = useFinishBook();

  useEffect(() => {
    getBookSessionData(book.id).then((data) => {
      setTotalTimeSeconds(data.totalTimeSeconds);
      setPastSessions(data.sessions);
      if (data.totalPagesRead > 0) setCurrentPage(data.totalPagesRead);
    });
  }, []);

  async function handleEndSession() {
    handleStop();

    const endTime = Date.now();
    const startTime = sessionStartTime ?? endTime - sessionSeconds * 1000;
    const pagesThisSession = Math.max(0, currentPage - book.currentPage);
    const readingPacePerHour =
      sessionSeconds > 0
        ? Math.round((pagesThisSession / sessionSeconds) * 3600)
        : 0;

    const session: SessionItem = {
      id: String(Date.now()),
      bookId: book.id,
      startTime,
      endTime,
      durationSeconds: sessionSeconds,
      pagesReadInSession: pagesThisSession,
      startPage: book.currentPage,
      endPage: currentPage,
    };

    const updated = await saveSession(book.id, session, currentPage);
    setTotalTimeSeconds(updated.totalTimeSeconds);
    setPastSessions(updated.sessions);

    // Persist current page to SQLite
    updateProgress({ id: book.id, currentPage });

    router.replace({
      pathname: "/sessionSummary",
      params: {
        bookJson: params.bookJson,
        sessionSeconds: String(sessionSeconds),
        pagesThisSession: String(pagesThisSession),
        currentPage: String(currentPage),
        readingPacePerHour: String(readingPacePerHour),
      },
    });
  }

  function handleFinishBook() {
    Alert.alert(
      "Finish this book?",
      `Mark "${book.title}" as finished. This will move it to your Finished shelf.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, I finished it!",
          onPress: () => {
            if (isRunning) handleStop();
            updateProgress({ id: book.id, currentPage: book.pageCount });
            finishBook(book.id);
            router.replace("/(tabs)/finished");
          },
        },
      ],
    );
  }

  // Derived stats
  const pagesReadThisSession = Math.max(0, currentPage - book.currentPage);
  const pagesLeft = Math.max(0, book.pageCount - currentPage);
  const readingPacePerHour =
    sessionSeconds > 0
      ? Math.round((pagesReadThisSession / sessionSeconds) * 3600)
      : 0;
  const totalSessions = pastSessions.length + (sessionSeconds > 0 ? 1 : 0);
  const avgSessionSeconds =
    totalSessions > 0
      ? Math.round((totalTimeSeconds + sessionSeconds) / totalSessions)
      : 0;

  //Animated Progress Bar
  const progressAnim = useSharedValue(
    book.pageCount > 0 ? book.currentPage / book.pageCount : 0,
  );
  useEffect(() => {
    const target = book.pageCount > 0 ? currentPage / book.pageCount : 0;
    progressAnim.value = withTiming(Math.min(target, 1), {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentPage]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));
  
  return (
    <View className="flex-1 bg-pomegranate-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Nav header */}
      <View className="pt-14 pb-3 px-4 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-pomegranate-100 items-center justify-center"
        >
          <Text className="text-pomegranate-950 text-lg font-semibold">‹</Text>
        </Pressable>
        <View>
          <Text className="text-lg font-bold text-pomegranate-950">
            {book.title}
          </Text>
          <Text className="text-sm text-pomegranate-950 opacity-60">
            Update Progress
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-44 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Book hero */}
        <View className="bg-pomegranate-300 rounded-2xl p-4 flex-row gap-4 items-center">
          <Image
            source={
              book.coverUrl
                ? { uri: book.coverUrl }
                : require("@/assets/images/DummyBookCover.png")
            }
            className="w-32 h-44 rounded-xl"
            resizeMode="cover"
          />
          <View className="flex-1 gap-1">
            <Text className="text-base text-pomegranate-950 opacity-70">
              You are currently reading
            </Text>
            <Text className="text-3xl font-bold text-pomegranate-950 leading-tight">
              {book.title}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          <StatCard
            label={"Time in this\nsession"}
            value={formatDuration(sessionSeconds)}
            flex
          />
          <StatCard
            label={"Total pages read\nso far"}
            value={`${currentPage}/${book.pageCount}`}
            flex
          />
        </View>
        <StatCard
          label="Total time with this book"
          value={formatDuration(totalTimeSeconds + sessionSeconds)}
        />
        <View className="flex-row gap-3">
          <StatCard
            label={"Pages read\nthis session"}
            value={String(pagesReadThisSession)}
            flex
          />
          <StatCard
            label={"Reading pace\n(per hour)"}
            value={`${readingPacePerHour} pg`}
            flex
          />
        </View>
        <View className="flex-row gap-3">
          <StatCard
            label={"Pages left\nto finish"}
            value={String(pagesLeft)}
            flex
          />
          <StatCard
            label={"Avg session\nlength"}
            value={formatDuration(avgSessionSeconds)}
            flex
          />
        </View>
        <StatCard
          label="Total sessions logged"
          value={String(pastSessions.length)}
        />

        {isRunning && (
          <PageStepper
            currentPage={currentPage}
            pageCount={book.pageCount}
            minPage={book.currentPage}
            onIncrement={() =>
              setCurrentPage((p) => Math.min(book.pageCount, p + 1))
            }
            onDecrement={() =>
              setCurrentPage((p) => Math.max(book.currentPage, p - 1))
            }
          />
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-pomegranate-50 gap-2">
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleStart}
            disabled={isRunning}
            className={`flex-1 rounded-2xl py-4 items-center justify-center ${
              isRunning ? "bg-pomegranate-100" : "bg-white"
            }`}
          >
            <Text
              className={`text-base font-semibold ${isRunning ? "text-pomegranate-300" : "text-pomegranate-950"}`}
            >
              Start
            </Text>
          </Pressable>
          <Pressable
            onPress={handleEndSession}
            className="flex-1 rounded-2xl py-4 items-center justify-center bg-pomegranate-500"
          >
            <Text className="text-base font-semibold text-white">
              End Session
            </Text>
          </Pressable>
        </View>
        {/* Finish book — always accessible */}
        <Pressable
          onPress={handleFinishBook}
          className="w-full rounded-2xl py-3 items-center justify-center bg-pomegranate-100"
        >
          <Text className="text-base font-semibold text-pomegranate-700">
            ✓ Mark as Finished
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
