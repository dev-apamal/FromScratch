import BookCardView from "@/components/bookCardView";
import FinishedBookCardView from "@/components/finishedBookCardView";
import ResultBookCardView from "@/components/resultBookCardView";
import { BookItem } from "@/types/bookItem";
import { useState } from "react";
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

export default function FinishedView() {
  const [openBookId, setOpenBookId] = useState<string | null>(null);

  const handleReveal = (id: string) => {
    setOpenBookId((prev) => (prev === id ? null : id));
  };

  return (
    <ScrollView className="flex-1 bg-pomegranate-50">
      <View className="p-4 gap-4">
        {/* Header */}
        <View className="gap-1">
          <Text className="text-3xl font-bold text-pomegranate-950">
            Your Finished Books
          </Text>
          <Text className="text-base font-medium text-pomegranate-950 opacity-80">
            Every book you've completed, along with the time and effort you put
            into reading it.
          </Text>
        </View>

        {/* Section label */}
        <Text className="text-lg font-semibold text-pomegranate-950 opacity-80">
          Your Bookshelf
        </Text>
        {/* Book cards */}
        <View className="gap-2">
          {myBooks.map((book) => (
            <FinishedBookCardView
              key={book.id}
              book={book}
              isOpen={openBookId === book.id}
              onReveal={() => handleReveal(book.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
