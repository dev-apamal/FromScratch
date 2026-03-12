import { BookItem } from "@/types/bookItem";
import { SymbolView } from "expo-symbols";
import { View, Text, Image, Pressable } from "react-native";

type Props = {
  book: BookItem;
  onUpdate: () => void;
  onDelete: () => void;
};

export default function BookCardView({ book, onUpdate, onDelete }: Props) {
  const progress = book.currentPage / book.pageCount;

  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4">
        {/* Top row: image + details */}
        <View className="flex-row gap-4 items-start">
          <Image
            source={book.imageName}
            className="w-36 h-36 rounded-lg"
            resizeMode="cover"
          />

          <View className="flex-1 gap-2">
            {/* Date + page count */}
            <View className="flex-row justify-between">
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.date}
              </Text>
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.pageCount} Pages
              </Text>
            </View>

            {/* Title */}
            <Text
              className="text-xl font-bold text-pomegranate-950 leading-tight"
              numberOfLines={2}
            >
              {book.title}
            </Text>

            {/* Author / category / status */}
            <View className="gap-1">
              <Text className="text-sm text-pomegranate-950 opacity-80">
                by {book.author}
              </Text>
              <Text className="text-sm text-pomegranate-950 opacity-80">
                {book.category}
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm">📋</Text>
                <Text className="text-sm text-pomegranate-950 opacity-80">
                  {book.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onUpdate}
            className="flex-1 bg-white rounded-lg py-2 items-center"
          >
            <Text className="text-pomegranate-500 text-base">
              Update Progress
            </Text>
          </Pressable>

          <Pressable
            onPress={onDelete}
            className="bg-pomegranate-200 rounded-full p-2 items-center justify-center"
          >
            <SymbolView
              name="trash.fill"
              size={20}
              tintColor="#f45335" // pomegranate-500
            />
          </Pressable>
        </View>

        {/* Progress bar */}
        <View className="h-1 bg-pomegranate-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-rose-950 rounded-full"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </View>
      </View>
    </View>
  );
}
