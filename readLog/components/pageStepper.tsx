import { View, Text, Pressable } from "react-native";

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
  return (
    <View className="bg-pomegranate-100 rounded-2xl p-4 gap-3">
      <Text className="text-sm text-pomegranate-950 opacity-60">
        Update current page
      </Text>

      <View className="flex-row items-center justify-between gap-4">
        <Pressable
          onPress={onDecrement}
          disabled={currentPage <= minPage}
          className="w-10 h-10 rounded-full bg-pomegranate-200 items-center justify-center"
        >
          <Text className="text-pomegranate-950 text-xl font-bold">−</Text>
        </Pressable>

        <Text className="text-3xl font-bold text-pomegranate-950">
          {currentPage}
        </Text>

        <Pressable
          onPress={onIncrement}
          disabled={currentPage >= pageCount}
          className="w-10 h-10 rounded-full bg-pomegranate-200 items-center justify-center"
        >
          <Text className="text-pomegranate-950 text-xl font-bold">+</Text>
        </Pressable>
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
