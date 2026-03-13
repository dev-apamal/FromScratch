import { BookItem } from "@/types/bookItem";
import { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";

type Props = {
  book: BookItem;
  alreadyOnShelf: boolean;
  onAdd: () => void;
};

export default function ResultBookCardView({
  book,
  alreadyOnShelf,
  onAdd,
}: Props) {
  const [added, setAdded] = useState(alreadyOnShelf);

  function handleAdd() {
    setAdded(true);
    onAdd();
  }

  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4">
        {/* Top row: image + details */}
        <View className="flex-row gap-4 items-start">
          <Image
            source={book.imageName}
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />

          <View className="flex-1 gap-2">
            {/* Title */}
            <Text
              className="text-xl font-bold text-pomegranate-950 leading-tight"
              numberOfLines={2}
            >
              {book.title}
            </Text>

            {/* Author / category */}
            <View className="gap-1">
              <Text className="text-sm text-pomegranate-950 opacity-80">
                by {book.author}
              </Text>
              <Text className="text-sm text-pomegranate-950 opacity-80">
                {book.category}
              </Text>
            </View>

            {/* Add / Already on shelf */}
            {added ? (
              <View className="self-start bg-pomegranate-200 rounded-lg px-3 py-1.5">
                <Text className="text-xs font-semibold text-pomegranate-700">
                  ✓ Already on your shelf
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={handleAdd}
                className="self-start bg-pomegranate-500 rounded-lg px-3 py-1.5 active:opacity-70"
              >
                <Text className="text-xs font-semibold text-white">
                  + Add to shelf
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
