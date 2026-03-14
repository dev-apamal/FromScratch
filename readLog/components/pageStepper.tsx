import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useScalePress } from "@/hooks/useScalePress";
import { SymbolView } from "expo-symbols";
import { Colors } from "@/constants/colors";

type Props = {
  currentPage: number;
  pageCount: number;
  minPage: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isRunning: boolean;
};

export default function PageStepper({
  currentPage,
  pageCount,
  minPage,
  onIncrement,
  onDecrement,
  isRunning,
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
    <View className="bg-pomegranate-100 rounded-2xl p-4 border-t-4 border-t-pomegranate-500 gap-4">
      <Text className="text-base text-pomegranate-950 opacity-80">
        Update current page
      </Text>

      <View className="flex-row items-center justify-between gap-4">
        {/* Decrement */}
        <Animated.View style={dec.animatedStyle}>
          <Pressable
            onPress={onDecrement}
            onPressIn={dec.onPressIn}
            onPressOut={dec.onPressOut}
            // disabled={currentPage <= minPage}
            disabled={!isRunning || currentPage <= minPage}
            className={`p-3 rounded-full bg-pomegranate-200 items-center justify-center ${
              !isRunning ? "opacity-40" : "opacity-100"
            }`}
          >
            <SymbolView
              name="minus"
              size={16}
              tintColor={Colors.pomegranate[500]}
              weight="semibold"
            />
          </Pressable>
        </Animated.View>

        {/* Animated page number */}
        <Animated.Text
          style={numStyle}
          className="text-2xl font-bold text-pomegranate-950"
        >
          {currentPage}
        </Animated.Text>

        {/* Increment */}
        <Animated.View style={inc.animatedStyle}>
          <Pressable
            onPress={onIncrement}
            onPressIn={inc.onPressIn}
            onPressOut={inc.onPressOut}
            // disabled={currentPage >= pageCount}
            disabled={!isRunning || currentPage >= pageCount}
            className={`p-3 rounded-full bg-pomegranate-200 items-center justify-center ${
              !isRunning ? "opacity-40" : "opacity-100"
            }`}
          >
            <SymbolView
              name="plus"
              size={16}
              tintColor={Colors.pomegranate[500]}
              weight="semibold"
            />
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
