import AnimatedListItem from "@/components/animatedListItem";
import BookCardView from "@/components/bookCardView";
import EmptyShelfView from "@/components/emptyShelfView";
import { useReadingBooks, useRemoveBook } from "@/hooks/useShelf";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ReadingNowView() {
  const { data: books = [], isLoading } = useReadingBooks();
  const { mutate: removeBook } = useRemoveBook();
  const router = useRouter();

  if (isLoading || books.length === 0) {
    return (
      <ScrollView className="flex-1 bg-pomegranate-50">
        <View className="p-4 gap-6">
          <EmptyShelfView
            title="Currently Reading"
            subtitle={
              isLoading
                ? "Loading your shelf…"
                : "You haven't added any books yet. Start your reading journey!"
            }
          />
          {!isLoading && (
            <Pressable
              onPress={() => router.push("/(tabs)/add")}
              className="bg-pomegranate-500 rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-white text-base font-semibold">
                + Browse & Add Books
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-pomegranate-50">
      <View className="p-4 gap-4">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-pomegranate-950">
            Currently Reading
          </Text>
          <Text className="text-base font-medium text-pomegranate-950 opacity-80">
            Continue where you left off.
          </Text>
        </View>
        <Text className="text-lg font-semibold text-pomegranate-950 opacity-80">
          On My Shelf
        </Text>
        <View className="gap-2">
          {books.map((book, index) => (
            <AnimatedListItem key={book.id} index={index}>
              <BookCardView
                book={book}
                onUpdate={() => {}}
                onDelete={() => removeBook(book.id)}
              />
            </AnimatedListItem>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
