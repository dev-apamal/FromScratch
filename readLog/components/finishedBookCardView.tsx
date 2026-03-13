import { BookItem } from "@/types/bookItem";
import { BookSessionData } from "@/types/sessionItem";
import { getBookSessionData } from "@/store/sessionStore";
import formatDate from "@/utils/formatDate";
import formatDuration from "@/utils/formatDuration";
import { useEffect, useState } from "react";
import {
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";

type Props = { book: BookItem; isOpen: boolean; onReveal: () => void };

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function FinishedBookCardView({
  book,
  isOpen,
  onReveal,
}: Props) {
  const [sessionData, setSessionData] = useState<BookSessionData | null>(null);

  useEffect(() => {
    if (isOpen && !sessionData) {
      getBookSessionData(book.id).then(setSessionData);
    }
  }, [isOpen]);

  const handleReveal = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onReveal();
  };

  const avgSession =
    sessionData && sessionData.sessions.length > 0
      ? Math.round(sessionData.totalTimeSeconds / sessionData.sessions.length)
      : 0;

  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4 overflow-hidden">
        <View className="flex-row gap-4 items-start">
          <Image
            source={
              book.coverUrl
                ? { uri: book.coverUrl }
                : require("@/assets/images/DummyBookCover.png")
            }
            className="w-36 h-36 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.finishedAt
                  ? `Finished ${formatDate(book.finishedAt)}`
                  : formatDate(book.addedAt)}
              </Text>
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.pageCount} Pages
              </Text>
            </View>
            <Text
              className="text-xl font-bold text-pomegranate-950 leading-tight"
              numberOfLines={2}
            >
              {book.title}
            </Text>
            <View className="gap-1">
              <Text className="text-sm text-pomegranate-950 opacity-80">
                by {book.author}
              </Text>
              <Text className="text-sm text-pomegranate-950 opacity-80">
                {book.category}
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm">✅</Text>
                <Text className="text-sm text-pomegranate-950 opacity-80">
                  Finished
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleReveal}
          className="bg-white rounded-lg py-2 items-center"
        >
          <Text className="text-pomegranate-500 text-base">
            {isOpen ? "Close Stats" : "View Stats"}
          </Text>
        </Pressable>

        {isOpen && (
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-pomegranate-200 rounded-xl p-3 gap-1">
                <Text className="text-xs text-pomegranate-950 opacity-60">
                  Total sessions
                </Text>
                <Text className="text-xl font-bold text-pomegranate-950">
                  {sessionData?.sessions.length ?? 0}
                </Text>
              </View>
              <View className="flex-1 bg-pomegranate-200 rounded-xl p-3 gap-1">
                <Text className="text-xs text-pomegranate-950 opacity-60">
                  Total reading time
                </Text>
                <Text className="text-xl font-bold text-pomegranate-950">
                  {formatDuration(sessionData?.totalTimeSeconds ?? 0)}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-pomegranate-200 rounded-xl p-3 gap-1">
                <Text className="text-xs text-pomegranate-950 opacity-60">
                  Pages read
                </Text>
                <Text className="text-xl font-bold text-pomegranate-950">
                  {book.pageCount}
                </Text>
              </View>
              <View className="flex-1 bg-pomegranate-200 rounded-xl p-3 gap-1">
                <Text className="text-xs text-pomegranate-950 opacity-60">
                  Avg session
                </Text>
                <Text className="text-xl font-bold text-pomegranate-950">
                  {formatDuration(avgSession)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
