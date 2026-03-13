import BookCardView from "@/components/bookCardView";
import EmptyShelfView from "@/components/emptyShelfView";
import { useReadingBooks, useRemoveBook } from "@/hooks/useShelf";
import { ScrollView, Text, View } from "react-native";

export default function ReadingNowView() {
  const { data: books = [], isLoading } = useReadingBooks();
  const { mutate: removeBook } = useRemoveBook();

  if (isLoading || books.length === 0) {
    return (
      <ScrollView className="flex-1 bg-pomegranate-50">
        <View className="p-4">
          <EmptyShelfView
            title="Currently Reading"
            subtitle={
              isLoading
                ? "Loading your shelf…"
                : "Go to Add Books and pick something to read."
            }
          />
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
          {books.map((book) => (
            <BookCardView
              key={book.id}
              book={book}
              onUpdate={() => {}}
              onDelete={() => removeBook(book.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
