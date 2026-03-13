import { BookItem } from "@/types/bookItem";
import formatDate from "@/utils/formatDate";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type Props = { book: BookItem; onUpdate: () => void; onDelete: () => void };

export default function BookCardView({ book, onUpdate, onDelete }: Props) {
  const router = useRouter();
  const progress = book.pageCount > 0 ? book.currentPage / book.pageCount : 0;

  function handleUpdateProgress() {
    router.push({
      pathname: "./updateProgress/[id]",
      params: { id: book.id, bookJson: JSON.stringify(book) },
    });
    onUpdate();
  }

  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4">
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
                {formatDate(book.addedAt)}
              </Text>
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.pageCount > 0
                  ? `${book.pageCount} Pages`
                  : "Unknown length"}
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
              <Text className="text-sm text-pomegranate-950 opacity-60">
                {book.currentPage} / {book.pageCount} pages
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleUpdateProgress}
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
            <SymbolView name="trash.fill" size={20} tintColor="#f45335" />
          </Pressable>
        </View>

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
