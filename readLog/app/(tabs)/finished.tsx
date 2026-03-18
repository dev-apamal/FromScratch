// import AnimatedListItem from "@/components/animatedListItem";
// import EmptyShelfView from "@/components/emptyShelfView";
// import FinishedBookCardView from "@/components/finishedBookCardView";
// import { useFinishedBooks, useRemoveBook } from "@/hooks/useShelf";
// import { useState } from "react";
// import { Alert, ScrollView, Text, View } from "react-native";

// export default function FinishedView() {
//   const { data: books = [], isLoading } = useFinishedBooks();
//   const { mutate: removeBook } = useRemoveBook();
//   const [openBookId, setOpenBookId] = useState<string | null>(null);

//   if (isLoading || books.length === 0) {
//     return (
//       <ScrollView className="flex-1 bg-pomegranate-50">
//         <View className="p-4">
//           <EmptyShelfView
//             title="Your Finished Books"
//             subtitle={
//               isLoading
//                 ? "Loading your shelf…"
//                 : "Finish a book from your reading shelf to see it here."
//             }
//           />
//         </View>
//       </ScrollView>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-pomegranate-50">
//       <View className="p-4 gap-4">
//         <View className="gap-1">
//           <Text className="text-3xl font-bold text-pomegranate-950">
//             Your Finished Books
//           </Text>
//           <Text className="text-base font-medium text-pomegranate-950 opacity-80">
//             Every book you've completed, along with the time and effort you put
//             in.
//           </Text>
//         </View>
//         <Text className="text-lg font-semibold text-pomegranate-950 opacity-80">
//           Your Bookshelf
//         </Text>
//         <View className="gap-2">
//           {books.map((book, index) => (
//             <AnimatedListItem key={book.id} index={index}>
//               <FinishedBookCardView
//                 book={book}
//                 isOpen={openBookId === book.id}
//                 onReveal={() =>
//                   setOpenBookId((prev) => (prev === book.id ? null : book.id))
//                 }
//                 onDelete={() =>
//                   Alert.alert(
//                     "Remove this book?",
//                     "This will delete your reading sessions and all progress for this book.",
//                     [
//                       { text: "Cancel", style: "cancel" },
//                       {
//                         text: "Remove",
//                         style: "destructive",
//                         onPress: () => removeBook(book),
//                       },
//                     ],
//                   )
//                 }
//               />
//             </AnimatedListItem>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

import AnimatedListItem from "@/components/animatedListItem";
import EmptyShelfView from "@/components/emptyShelfView";
import ErrorBoundary from "@/components/errorBoundary";
import FinishedBookCardView from "@/components/finishedBookCardView";
import { useFinishedBooks, useRemoveBook } from "@/hooks/useShelf";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FinishedContent() {
  const { data: books = [], isLoading } = useFinishedBooks();
  const { mutate: removeBook } = useRemoveBook();
  const [openBookId, setOpenBookId] = useState<string | null>(null);

  if (isLoading || books.length === 0) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-pomegranate-50">
        <ScrollView className="flex-1 bg-pomegranate-50">
          <View className="p-4">
            <EmptyShelfView
              title="Your Finished Books"
              subtitle={
                isLoading
                  ? "Loading your shelf…"
                  : "Finish a book from your reading shelf to see it here."
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-pomegranate-50">
      <ScrollView className="flex-1 bg-pomegranate-50">
        <View className="p-4 gap-4">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-pomegranate-950">
              Your Finished Books
            </Text>
            <Text className="text-base font-medium text-pomegranate-950 opacity-80">
              Every book you've completed, along with the time and effort you
              put in.
            </Text>
          </View>
          <Text className="text-lg font-semibold text-pomegranate-950 opacity-80">
            Your Bookshelf
          </Text>
          <View className="gap-2">
            {books.map((book, index) => (
              <AnimatedListItem key={book.id} index={index}>
                <FinishedBookCardView
                  book={book}
                  isOpen={openBookId === book.id}
                  onReveal={() =>
                    setOpenBookId((prev) => (prev === book.id ? null : book.id))
                  }
                  onDelete={() =>
                    Alert.alert(
                      "Remove this book?",
                      "This will delete your reading sessions and all progress for this book.",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Remove",
                          style: "destructive",
                          onPress: () => removeBook(book),
                        },
                      ],
                    )
                  }
                />
              </AnimatedListItem>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function FinishedView() {
  return (
    <ErrorBoundary>
      <FinishedContent />
    </ErrorBoundary>
  );
}
