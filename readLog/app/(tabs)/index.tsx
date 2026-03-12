import BookCardView from "@/components/bookCardView";
import { BookItem } from "@/types/bookItem";
import { ScrollView, Text, View } from "react-native";

const myBooks: BookItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  title: `Book Title ${i + 1}`,
  author: `Author Name ${i + 1}`,
  date: "Oct 24",
  pageCount: 100,
  currentPage: 10,
  category: "Category",
  status: "Reading",
  imageName: require("@/assets/images/DummyBookCover.png"),
}));

export default function ReadingNowView() {
  return (
    <ScrollView className="flex-1 bg-pomegranate-50">
      <View className="p-4 gap-4">
        {/* Header */}
        <View className="gap-1">
          <Text className="text-3xl font-bold text-pomegranate-950">
            Currently Reading
          </Text>
          <Text className="text-base font-medium text-pomegranate-950 opacity-80">
            Continue where you left off.
          </Text>
        </View>

        {/* Section label */}
        <Text className="text-lg font-semibold text-pomegranate-950 opacity-80">
          On My Shelf
        </Text>

        {/* Book cards */}
        <View className="gap-2">
          {myBooks.map((book) => (
            <BookCardView
              key={book.id}
              book={book}
              onUpdate={() => console.log(`Update tapped for ${book.title}`)}
              onDelete={() => console.log(`Delete tapped for ${book.title}`)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
