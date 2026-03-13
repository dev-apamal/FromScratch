import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useScalePress } from "@/hooks/useScalePress";

type Props = {
  currentPage: number;
  pageCount: number;
  minPage: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function PageStepper({
  currentPage,
  pageCount,
  minPage,
  onIncrement,
  onDecrement,
}: Props) {
  const inc = useScalePress(0.85);
  const dec = useScalePress(0.85);

  // Page number pops every time it changes
  const numScale = useSharedValue(1);
  useEffect(() => {
    numScale.value = withSequence(
      withSpring(1.35, { damping: 6, stiffness: 500 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    );
  }, [currentPage]);

  const numStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numScale.value }],
  }));

  return (
    <View className="bg-pomegranate-100 rounded-2xl p-4 gap-3">
      <Text className="text-sm text-pomegranate-950 opacity-60">
        Update current page
      </Text>

      <View className="flex-row items-center justify-between gap-4">
        {/* Decrement */}
        <Animated.View style={dec.animatedStyle}>
          <Pressable
            onPress={onDecrement}
            onPressIn={dec.onPressIn}
            onPressOut={dec.onPressOut}
            disabled={currentPage <= minPage}
            className="w-10 h-10 rounded-full bg-pomegranate-200 items-center justify-center"
          >
            <Text className="text-pomegranate-950 text-xl font-bold">−</Text>
          </Pressable>
        </Animated.View>

        {/* Animated page number */}
        <Animated.Text
          style={numStyle}
          className="text-3xl font-bold text-pomegranate-950"
        >
          {currentPage}
        </Animated.Text>

        {/* Increment */}
        <Animated.View style={inc.animatedStyle}>
          <Pressable
            onPress={onIncrement}
            onPressIn={inc.onPressIn}
            onPressOut={inc.onPressOut}
            disabled={currentPage >= pageCount}
            className="w-10 h-10 rounded-full bg-pomegranate-200 items-center justify-center"
          >
            <Text className="text-pomegranate-950 text-xl font-bold">+</Text>
          </Pressable>
        </Animated.View>
      </View>

      <View className="h-1 bg-pomegranate-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-pomegranate-500 rounded-full"
          style={{
            width: `${Math.min((currentPage / pageCount) * 100, 100)}%`,
          }}
        />
      </View>
    </View>
  );
}
