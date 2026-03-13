import { OLSearchResult } from "@/types/olSearchResult";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

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

  function handleAdd() {
    setAdded(true);
    onAdd();
  }

  return (
    <View className="bg-pomegranate-100 rounded-2xl p-4 gap-4">
      <View className="flex-row gap-4 items-start">
        <Image
          source={
            book.coverUrl
              ? { uri: book.coverUrl }
              : require("@/assets/images/DummyBookCover.png")
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
  );
}
