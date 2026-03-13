import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function BookCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <View className="bg-pomegranate-100 rounded-2xl p-4 gap-4">
        {/* Top row */}
        <View className="flex-row gap-4 items-start">
          <View className="w-36 h-36 rounded-lg bg-pomegranate-200" />
          <View className="flex-1 gap-3 pt-1">
            <View className="h-3 w-1/3 bg-pomegranate-200 rounded-full" />
            <View className="h-5 w-full bg-pomegranate-200 rounded-full" />
            <View className="h-4 w-3/4 bg-pomegranate-200 rounded-full" />
            <View className="h-4 w-1/2 bg-pomegranate-200 rounded-full" />
            <View className="h-4 w-2/3 bg-pomegranate-200 rounded-full" />
          </View>
        </View>
        {/* Button placeholder */}
        <View className="h-10 bg-pomegranate-200 rounded-lg" />
        {/* Progress bar placeholder */}
        <View className="h-1 bg-pomegranate-200 rounded-full" />
      </View>
    </Animated.View>
  );
}
