import { OLSearchResult } from "@/types/olSearchResult";
import { useScalePress } from "@/hooks/useScalePress";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  book: OLSearchResult;
  alreadyOnShelf: boolean;
  onAdd: () => void;
};

export default function ResultBookCardView({
  book,
  alreadyOnShelf,
  onAdd,
}: Props) {
  const [added, setAdded] = useState(alreadyOnShelf);
  const btn = useScalePress(0.92);

  // Pop animation that plays when the book gets added
  const successScale = useSharedValue(1);
  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  function handleAdd() {
    // Quick pop before switching to the "already on shelf" state
    successScale.value = withSequence(
      withSpring(1.12, { damping: 8, stiffness: 500 }),
      withTiming(1, { duration: 150 }),
    );
    setTimeout(() => setAdded(true), 180);
    onAdd();
  }

  return (
    <View className="bg-pomegranate-100 rounded-2xl p-4 gap-4">
      <View className="flex-row gap-4 items-start">
        <Image
          source={
            book.coverUrl
              ? { uri: book.coverUrl }
              : require("@/assets/images/DummyBookIcon.png")
          }
          className="w-24 h-32 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 gap-2">
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
            {book.pageCount > 0 && (
              <Text className="text-sm text-pomegranate-950 opacity-60">
                {book.pageCount} pages
              </Text>
            )}
          </View>

          <Animated.View style={[successStyle, { alignSelf: "flex-start" }]}>
            {added ? (
              <View className="bg-pomegranate-200 rounded-lg px-3 py-1.5">
                <Text className="text-xs font-semibold text-pomegranate-700">
                  ✓ Already on your shelf
                </Text>
              </View>
            ) : (
              <Animated.View style={btn.animatedStyle}>
                <Pressable
                  onPress={handleAdd}
                  onPressIn={btn.onPressIn}
                  onPressOut={btn.onPressOut}
                  className="bg-pomegranate-500 rounded-lg px-3 py-1.5"
                >
                  <Text className="text-xs font-semibold text-white">
                    + Add to shelf
                  </Text>
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
