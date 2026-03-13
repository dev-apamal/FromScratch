import { BookItem } from "@/types/bookItem";
import StatCard from "@/components/statCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
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

  return (
    <View className="flex-1 bg-pomegranate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-16 pb-36 gap-6 items-center"
        showsVerticalScrollIndicator={false}
      >
        {/* Book cover */}
        <Image
          source={
            book.coverUrl
              ? { uri: book.coverUrl }
              : require("@/assets/images/DummyBookCover.png")
          }
          className="w-64 h-96 rounded-2xl"
          resizeMode="cover"
        />

        {/* Headline */}
        <Text className="text-2xl font-bold text-pomegranate-950 text-center">
          {getSessionMessage(sessionSeconds)}
        </Text>

        {/* Stats grid */}
        <View className="w-full gap-3">
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
        </View>
      </ScrollView>

      {/* Continue button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-3 bg-pomegranate-50">
        <Pressable
          onPress={() => router.replace("./(tabs)/")}
          className="w-full bg-pomegranate-500 rounded-full py-5 items-center"
        >
          <Text className="text-white text-base font-semibold">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
