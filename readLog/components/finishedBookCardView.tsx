import { BookItem } from "@/types/bookItem";
import { BookSessionData } from "@/types/sessionItem";
import { getBookSessionData } from "@/store/sessionStore";
import { useScalePress } from "@/hooks/useScalePress";
import formatDate from "@/utils/formatDate";
import formatDuration from "@/utils/formatDuration";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import capitalizeWords from "@/utils/capitalizeWords";
import StatCard from "./statCard";
import { Colors } from "@/constants/colors";

type Props = {
  book: BookItem;
  isOpen: boolean;
  onReveal: () => void;
  onDelete: () => void;
};

const STATS_MAX_HEIGHT = 320;
const DURATION = 320;

export default function FinishedBookCardView({
  book,
  isOpen,
  onReveal,
  onDelete,
}: Props) {
  const [sessionData, setSessionData] = useState<BookSessionData | null>(null);
  const btn = useScalePress(0.97);

  const statsHeight = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      statsHeight.value = withTiming(STATS_MAX_HEIGHT, {
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
      });
      statsOpacity.value = withTiming(1, { duration: DURATION - 60 });
      if (!sessionData) {
        getBookSessionData(book.id).then(setSessionData);
      }
    } else {
      statsHeight.value = withTiming(0, {
        duration: DURATION - 40,
        easing: Easing.in(Easing.cubic),
      });
      statsOpacity.value = withTiming(0, { duration: DURATION - 80 });
    }
  }, [isOpen]);

  const statsStyle = useAnimatedStyle(() => ({
    maxHeight: statsHeight.value,
    opacity: statsOpacity.value,
    overflow: "hidden",
  }));

  const avgSession =
    sessionData && sessionData.sessions.length > 0
      ? Math.round(sessionData.totalTimeSeconds / sessionData.sessions.length)
      : 0;

  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4">
        {/* Top row — same as BookCardView */}
        <View className="flex-row gap-4 items-start">
          <Image
            source={
              book.coverUrl
                ? { uri: book.coverUrl }
                : require("@/assets/images/DummyBookIcon.png")
            }
            className="w-36 h-36 rounded-xl"
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
                by {capitalizeWords(book.author)}
              </Text>
              <Text className="text-sm text-pomegranate-950 opacity-80">
                {capitalizeWords(book.category)}
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm text-pomegranate-500">Finished</Text>
                <SymbolView
                  name="checkmark.seal.fill"
                  size={14}
                  tintColor="#f45335"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Buttons row — same layout as BookCardView */}
        <View className="flex-row items-center gap-2">
          <Animated.View style={[btn.animatedStyle, { flex: 1 }]}>
            <Pressable
              onPress={onReveal}
              onPressIn={btn.onPressIn}
              onPressOut={btn.onPressOut}
              className="bg-white rounded-full py-3 items-center active:opacity-80"
            >
              <Text className="text-pomegranate-500 text-base">
                {isOpen ? "Close Stats" : "View Stats"}
              </Text>
            </Pressable>
          </Animated.View>
          <Pressable
            onPress={onDelete}
            className="bg-pomegranate-200 rounded-full p-3 items-center justify-center"
          >
            <SymbolView name="trash.fill" size={20} tintColor="#f45335" />
          </Pressable>
        </View>

        {/* Animated stats panel */}
        {/* <Animated.View style={statsStyle}>
          <View className="gap-3 pb-1">
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
        </Animated.View> */}
        <Animated.View style={statsStyle}>
          <View className="gap-3 pb-1">
            <View className="flex-row gap-3">
              <StatCard
                label="Total sessions"
                value={String(sessionData?.sessions.length ?? 0)}
                flex
                bgColor={Colors.pomegranate[200]}
              />
              <StatCard
                label="Total reading time"
                value={formatDuration(sessionData?.totalTimeSeconds ?? 0)}
                flex
                bgColor={Colors.pomegranate[200]}
              />
            </View>
            <View className="flex-row gap-3">
              <StatCard
                label="Pages read"
                value={String(book.pageCount)}
                flex
                bgColor={Colors.pomegranate[200]}
              />
              <StatCard
                label="Avg session"
                value={formatDuration(avgSession)}
                flex
                bgColor={Colors.pomegranate[200]}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
