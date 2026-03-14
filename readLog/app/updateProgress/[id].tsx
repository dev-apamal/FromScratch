import { BookItem } from "@/types/bookItem";
import { getBookSessionData, saveSession } from "@/store/sessionStore";
import { SessionItem } from "@/types/sessionItem";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useFinishBook, useUpdateBookProgress } from "@/hooks/useShelf";
import StatCard from "@/components/statCard";
import PageStepper from "@/components/pageStepper";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router"; // ← added useNavigation here
import { useEffect, useRef, useState } from "react"; // ← added useRef here
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
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

  // ↓ ADD REFS HERE — right after state declarations
  const isEndingSessionRef = useRef(false);
  const sessionSecondsRef = useRef(sessionSeconds);
  const currentPageRef = useRef(currentPage);
  useEffect(() => {
    sessionSecondsRef.current = sessionSeconds;
  }, [sessionSeconds]);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // ↓ ADD NAVIGATION + LISTENER HERE — right after refs
  const navigation = useNavigation();
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("beforeRemove", (e) => {
  //     if (sessionStartTime === null) return;
  //     e.preventDefault();
  //     Alert.alert(
  //       "Save session?",
  //       "You have an active session. Do you want to save your progress before leaving?",
  //       [
  //         {
  //           text: "Discard",
  //           style: "destructive",
  //           onPress: () => navigation.dispatch(e.data.action),
  //         },
  //         {
  //           text: "Save & Exit",
  //           style: "default",
  //           onPress: async () => {
  //             await handleEndSessionSilent();
  //             navigation.dispatch(e.data.action);
  //           },
  //         },
  //       ],
  //     );
  //   });
  //   return unsubscribe;
  // }, [navigation, sessionStartTime]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (sessionStartTime === null) return;
      if (isEndingSessionRef.current) return; // ← intentional navigation, skip
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

  useEffect(() => {
    getBookSessionData(book.id).then((data) => {
      setTotalTimeSeconds(data.totalTimeSeconds);
      setPastSessions(data.sessions);
      if (data.totalPagesRead > 0) setCurrentPage(data.totalPagesRead);
    });
  }, []);

  // ↓ ADD THIS — right before handleEndSession
  async function handleEndSessionSilent() {
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

  // ↓ REPLACE your existing handleEndSession with this
  // async function handleEndSession() {
  //   const pagesThisSession = Math.max(0, currentPage - book.currentPage);
  //   const readingPacePerHour =
  //     sessionSeconds > 0
  //       ? Math.round((pagesThisSession / sessionSeconds) * 3600)
  //       : 0;

  //   await handleEndSessionSilent();

  //   router.replace({
  //     pathname: "/sessionSummary",
  //     params: {
  //       bookJson: params.bookJson,
  //       sessionSeconds: String(sessionSeconds),
  //       pagesThisSession: String(pagesThisSession),
  //       currentPage: String(currentPage),
  //       readingPacePerHour: String(readingPacePerHour),
  //     },
  //   });
  // }
  async function handleEndSession() {
    const pagesThisSession = Math.max(0, currentPage - book.currentPage);
    const readingPacePerHour =
      sessionSeconds > 0
        ? Math.round((pagesThisSession / sessionSeconds) * 3600)
        : 0;

    isEndingSessionRef.current = true; // ← tell the listener to stand down
    await handleEndSessionSilent();

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

  // handleFinishBook stays exactly the same
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
            finishBook(book);
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
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="flex items-center">
              <Text className="text-lg font-bold text-pomegranate-950">
                {book.title}
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
          headerStyle: {
            backgroundColor: Colors.pomegranate[50],
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
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

        {/* {isRunning && (
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
        )} */}

        {sessionStartTime !== null && (
          // <PageStepper
          //   currentPage={currentPage}
          //   pageCount={book.pageCount}
          //   minPage={book.currentPage}
          //   onIncrement={() =>
          //     setCurrentPage((p) => Math.min(book.pageCount, p + 1))
          //   }
          //   onDecrement={() =>
          //     setCurrentPage((p) => Math.max(book.currentPage, p - 1))
          //   }
          // />
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

        {/* Stats */}
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
        {/* Bottom action bar */}

        <View className="flex-row gap-4">
          {/* <Pressable
            onPress={isRunning ? handleStop : handleStart}
            className={`flex-1 rounded-full p-4 items-center justify-center ${
              isRunning ? "bg-white" : "bg-white"
            }`}
          >
            <Text
              className={`text-base ${
                isRunning ? "text-pomegranate-500" : "text-pomegranate-500"
              }`}
            >
              {isRunning ? "Pause" : sessionSeconds > 0 ? "Resume" : "Start"}
            </Text>
            <SymbolView
              name="checkmark"
              size={16}
              tintColor={Colors.pomegranate[950]}
              weight="semibold"
            />
          </Pressable> */}

          <Pressable
            onPress={isRunning ? handleStop : handleStart}
            className="flex-1 rounded-full p-4 flex-row gap-2 items-center justify-center bg-white"
          >
            <Text className="text-base text-pomegranate-500">
              {isRunning ? "Pause" : sessionSeconds > 0 ? "Resume" : "Start"}
            </Text>
            <SymbolView
              name={
                isRunning
                  ? "pause.fill"
                  : sessionSeconds > 0
                    ? "play.fill"
                    : "play.fill"
              }
              size={16}
              tintColor={Colors.pomegranate[500]}
            />
          </Pressable>
          <Pressable
            // onPress={() =>
            //   Alert.alert(
            //     "End session?",
            //     "Your progress and time will be saved.",
            //     [
            //       { text: "Cancel", style: "cancel" },
            //       {
            //         text: "End Session",
            //         style: "destructive",
            //         onPress: handleEndSession,
            //       },
            //     ],
            //   )
            // }
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
