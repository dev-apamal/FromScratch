import AnimatedListItem from "@/components/animatedListItem";
import BookCardView from "@/components/bookCardView";
import EmptyShelfView from "@/components/emptyShelfView";
import ErrorBoundary from "@/components/errorBoundary";
import { useReadingBooks, useRemoveBook } from "@/hooks/useShelf";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// function ReadingNowContent() {
//   const { data: books = [], isLoading } = useReadingBooks();
//   const { mutate: removeBook } = useRemoveBook();
//   const router = useRouter();

//   if (isLoading || books.length === 0) {
//     return (
//       <ScrollView className="flex-1 bg-pomegranate-50">
//         <View className="p-4 gap-6">
//           <EmptyShelfView
//             title="Start Reading"
//             subtitle={
//               isLoading
//                 ? "Loading your shelf…"
//                 : "Pick a book to begin. Your current reads will appear here."
//             }
//           />
//           {!isLoading && (
//             <Pressable
//               onPress={() => router.push("/(tabs)/add")}
//               className="bg-pomegranate-500 rounded-full py-3 items-center active:opacity-80"
//             >
//               <Text className="text-white text-base">+ Browse & Add Books</Text>
//             </Pressable>
//           )}
//         </View>
//       </ScrollView>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-pomegranate-50">
//       <View className="p-4 gap-4">
//         <View className="gap-1">
//           <Text className="text-3xl font-bold text-pomegranate-950">
//             Currently Reading
//           </Text>
//           <Text className="text-base font-medium text-pomegranate-950 opacity-80">
//             Continue where you left off.
//           </Text>
//         </View>
//         <Text className="text-lg font-semibold text-pomegranate-950 opacity-80">
//           On My Shelf
//         </Text>
//         <View className="gap-2">
//           {books.map((book, index) => (
//             <AnimatedListItem key={book.id} index={index}>
//               <BookCardView
//                 book={book}
//                 onUpdate={() => {}}
//                 onDelete={() => removeBook(book)}
//               />
//             </AnimatedListItem>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

function ReadingNowContent() {
  const { data: books = [], isLoading } = useReadingBooks();
  const { mutate: removeBook } = useRemoveBook();
  const router = useRouter();

  if (isLoading || books.length === 0) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-pomegranate-50">
        <ScrollView>
          <View className="p-4 gap-6">
            <EmptyShelfView
              title="Start Reading"
              subtitle={
                isLoading
                  ? "Loading your shelf…"
                  : "Pick a book to begin. Your current reads will appear here."
              }
            />
            {!isLoading && (
              <Pressable
                onPress={() => router.push("/(tabs)/add")}
                className="bg-pomegranate-500 rounded-full py-3 items-center active:opacity-80"
              >
                <Text className="text-white text-base">
                  + Browse & Add Books
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-pomegranate-50">
      <ScrollView>
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
                  onDelete={() => removeBook(book)}
                />
              </AnimatedListItem>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ReadingNowView() {
  return (
    <ErrorBoundary>
      <ReadingNowContent />
    </ErrorBoundary>
  );
}
