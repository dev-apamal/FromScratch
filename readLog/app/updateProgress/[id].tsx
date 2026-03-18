import { getBookSessionData, saveSession } from "@/store/sessionStore";
import { SessionItem } from "@/types/sessionItem";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import {
  useBookById,
  useFinishBook,
  useUpdateBookProgress,
} from "@/hooks/useShelf";
import StatCard from "@/components/statCard";
import PageStepper from "@/components/pageStepper";
import ErrorBoundary from "@/components/errorBoundary";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import formatDuration from "@/utils/formatDuration";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { SymbolView } from "expo-symbols";
import truncateTitle from "@/utils/truncateTitle";

function UpdateProgressContent() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  // Fetch the book fresh from SQLite — never parse a serialised URL param
  const { data: book, isLoading: bookLoading } = useBookById(params.id);

  const {
    sessionSeconds,
    isRunning,
    sessionStartTime,
    handleStart,
    handleStop,
  } = useSessionTimer();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [pastSessions, setPastSessions] = useState<SessionItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const isEndingSessionRef = useRef(false);
  const sessionSecondsRef = useRef(sessionSeconds);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    sessionSecondsRef.current = sessionSeconds;
  }, [sessionSeconds]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (sessionStartTime === null) return;
      if (isEndingSessionRef.current) return;
      e.preventDefault();
      Alert.alert(
        "Save session?",
        "You have an active session. Do you want to save your progress before leaving?",
        [
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
          {
            text: "Save & Exit",
            style: "default",
            onPress: async () => {
              await handleEndSessionSilent();
              navigation.dispatch(e.data.action);
            },
          },
        ],
      );
    });
    return unsubscribe;
  }, [navigation, sessionStartTime]);

  const { mutate: updateProgress } = useUpdateBookProgress();
  const { mutate: finishBook } = useFinishBook();

  // Load session history once the book is available
  useEffect(() => {
    if (!book || dataLoaded) return;
    getBookSessionData(book.id).then((data) => {
      setTotalTimeSeconds(data.totalTimeSeconds);
      setPastSessions(data.sessions);
      // Prefer the highest recorded end-page; fall back to book's current page
      setCurrentPage(
        data.totalPagesRead > 0 ? data.totalPagesRead : book.currentPage,
      );
      setDataLoaded(true);
    });
  }, [book, dataLoaded]);

  const progressAnim = useSharedValue(0);

  useEffect(() => {
    if (!book) return;
    const target = book.pageCount > 0 ? currentPage / book.pageCount : 0;
    progressAnim.value = withTiming(Math.min(target, 1), {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentPage, book]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  // ── Handlers (all guard against book being null) ───────────────────────────

  async function handleEndSessionSilent() {
    if (!book) return;
    handleStop();
    const endTime = Date.now();
    const startTime =
      sessionStartTime ?? endTime - sessionSecondsRef.current * 1000;
    const pagesThisSession = Math.max(
      0,
      currentPageRef.current - book.currentPage,
    );
    const session: SessionItem = {
      id: String(Date.now()),
      bookId: book.id,
      startTime,
      endTime,
      durationSeconds: sessionSecondsRef.current,
      pagesReadInSession: pagesThisSession,
      startPage: book.currentPage,
      endPage: currentPageRef.current,
    };
    await saveSession(book.id, session, currentPageRef.current);
    updateProgress({ id: book.id, currentPage: currentPageRef.current });
  }

  async function handleEndSession() {
    if (!book) return;
    const pagesThisSession = Math.max(0, currentPage - book.currentPage);
    const readingPacePerHour =
      sessionSeconds > 0
        ? Math.round((pagesThisSession / sessionSeconds) * 3600)
        : 0;

    isEndingSessionRef.current = true;
    await handleEndSessionSilent();

    // Pass only the id — sessionSummary fetches the book itself
    router.replace({
      pathname: "/sessionSummary",
      params: {
        bookId: book.id,
        sessionSeconds: String(sessionSeconds),
        pagesThisSession: String(pagesThisSession),
        currentPage: String(currentPage),
        readingPacePerHour: String(readingPacePerHour),
      },
    });
  }

  function handleFinishBook() {
    if (!book) return;
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
            finishBook(book);
            router.replace("/(tabs)/finished");
          },
        },
      ],
    );
  }

  // ── Loading / not-found states ─────────────────────────────────────────────

  if (bookLoading || !dataLoaded) {
    return (
      <>
        <Stack.Screen
          options={{ headerTitle: "Loading…", headerShadowVisible: false }}
        />
        <View className="flex-1 bg-pomegranate-50 items-center justify-center">
          <ActivityIndicator color={Colors.pomegranate[500]} size="large" />
        </View>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: "Book not found",
            headerShadowVisible: false,
          }}
        />
        <View className="flex-1 bg-pomegranate-50 items-center justify-center p-8 gap-4">
          <Text className="text-lg text-pomegranate-950 text-center opacity-60">
            This book could not be found.
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
      </>
    );
  }

  // ── Derived stats (book is guaranteed non-null below this line) ────────────

  const pagesReadThisSession = Math.max(0, currentPage - book.currentPage);
  const readingPacePerHour =
    sessionSeconds > 0
      ? Math.round((pagesReadThisSession / sessionSeconds) * 3600)
      : 0;
  const totalSessions = pastSessions.length + (sessionSeconds > 0 ? 1 : 0);
  const avgSessionSeconds =
    totalSessions > 0
      ? Math.round((totalTimeSeconds + sessionSeconds) / totalSessions)
      : 0;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="flex items-center">
              <Text className="text-lg font-bold text-pomegranate-950">
                {truncateTitle(book.title)}
              </Text>
              <Text className="text-sm text-pomegranate-950 opacity-60">
                Update Progress
              </Text>
            </View>
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <SymbolView
                name="chevron.left"
                size={20}
                tintColor="#450a0a"
                weight="semibold"
              />
            </Pressable>
          ),
          headerBackTitle: "",
          headerTintColor: Colors.pomegranate[950],
          headerStyle: { backgroundColor: Colors.pomegranate[50] },
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        className="flex-1 bg-pomegranate-50"
        contentContainerClassName="p-4 gap-4 pb-safe"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-pomegranate-100 rounded-2xl p-4 flex-row gap-4 items-center">
          <View className="bg-pomegranate-400 w-40 h-40 rounded-xl items-center justify-center">
            <Image
              source={
                book.coverUrl
                  ? { uri: book.coverUrl }
                  : require("@/assets/images/DummyBookIcon.png")
              }
              className="w-16 h-24 rounded-md"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-base font-medium text-pomegranate-950 opacity-80">
              You are currently reading
            </Text>
            <Text className="text-2xl font-bold text-pomegranate-950">
              {book.title}
            </Text>
          </View>
        </View>

        {sessionStartTime !== null && (
          <PageStepper
            currentPage={currentPage}
            pageCount={book.pageCount}
            minPage={book.currentPage}
            isRunning={isRunning}
            onIncrement={() =>
              setCurrentPage((p) => Math.min(book.pageCount, p + 1))
            }
            onDecrement={() =>
              setCurrentPage((p) => Math.max(book.currentPage, p - 1))
            }
          />
        )}

        <View className="flex-row gap-4">
          <StatCard
            label={"Time in this\nsession"}
            value={formatDuration(sessionSeconds)}
            flex
          />
          <StatCard
            label={"Pages read\nthis session"}
            value={String(pagesReadThisSession)}
            flex
          />
        </View>
        <StatCard
          label={"Reading pace\n(per hour)"}
          value={`${readingPacePerHour} pg`}
        />
        <View className="flex-row gap-4">
          <StatCard
            label={"Total pages read\nso far"}
            value={`${currentPage}/${book.pageCount}`}
            flex
          />
          <StatCard
            label="Total time with this book"
            value={formatDuration(totalTimeSeconds + sessionSeconds)}
            flex
          />
        </View>

        <View className="flex-row gap-4">
          <Pressable
            onPress={isRunning ? handleStop : handleStart}
            className="flex-1 rounded-full p-4 flex-row gap-2 items-center justify-center bg-white"
          >
            <Text className="text-base text-pomegranate-500">
              {isRunning ? "Pause" : sessionSeconds > 0 ? "Resume" : "Start"}
            </Text>
            <SymbolView
              name={isRunning ? "pause.fill" : "play.fill"}
              size={16}
              tintColor={Colors.pomegranate[500]}
            />
          </Pressable>
          <Pressable
            onPress={handleEndSession}
            className="flex-1 flex-row gap-2 rounded-full p-4 items-center justify-center bg-pomegranate-500"
          >
            <Text className="text-base text-white">End Session</Text>
            <SymbolView name="stop.fill" size={16} tintColor="#FFFFFF" />
          </Pressable>
        </View>

        <Pressable
          onPress={handleFinishBook}
          className="w-full flex-row gap-2 rounded-full p-4 items-center justify-center bg-pomegranate-100"
        >
          <Text className="text-base text-pomegranate-500">
            Mark as Finished
          </Text>
          <SymbolView
            name="checkmark"
            size={16}
            tintColor={Colors.pomegranate[500]}
          />
        </Pressable>
      </ScrollView>
    </>
  );
}

export default function UpdateProgressScreen() {
  return (
    <ErrorBoundary>
      <UpdateProgressContent />
    </ErrorBoundary>
  );
}
