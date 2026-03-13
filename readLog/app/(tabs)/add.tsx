import ResultBookCardView from "@/components/resultBookCardView";
import { BookItem } from "@/types/bookItem";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Mock library ────────────────────────────────────────────────────────────
const MOCK_BOOKS: BookItem[] = [
  {
    id: "1",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    date: "Oct 24",
    pageCount: 352,
    currentPage: 0,
    category: "Technology",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    date: "Oct 24",
    pageCount: 431,
    currentPage: 0,
    category: "Technology",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    date: "Oct 24",
    pageCount: 320,
    currentPage: 0,
    category: "Self Help",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "4",
    title: "Deep Work",
    author: "Cal Newport",
    date: "Oct 24",
    pageCount: 296,
    currentPage: 0,
    category: "Self Help",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "5",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    date: "Oct 24",
    pageCount: 180,
    currentPage: 0,
    category: "Fiction",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "6",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    date: "Oct 24",
    pageCount: 281,
    currentPage: 0,
    category: "Fiction",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "7",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    date: "Oct 24",
    pageCount: 499,
    currentPage: 0,
    category: "Psychology",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "8",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    date: "Oct 24",
    pageCount: 443,
    currentPage: 0,
    category: "History",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "9",
    title: "The Lean Startup",
    author: "Eric Ries",
    date: "Oct 24",
    pageCount: 299,
    currentPage: 0,
    category: "Business",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
  {
    id: "10",
    title: "1984",
    author: "George Orwell",
    date: "Oct 24",
    pageCount: 328,
    currentPage: 0,
    category: "Fiction",
    status: "Not Started",
    imageName: require("@/assets/images/DummyBookCover.png"),
  },
];

// IDs already on the user's shelf (swap with real state/context later)
const SHELF_IDS = new Set(["3", "7"]);

// ── Search modes ─────────────────────────────────────────────────────────────
type SearchMode = "title" | "isbn";

export default function AddBook() {
  const [mode, setMode] = useState<SearchMode>("title");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookItem[]>([]);
  const [searched, setSearched] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (mode === "title") {
      const lower = trimmed.toLowerCase();
      setResults(
        MOCK_BOOKS.filter(
          (b) =>
            b.title.toLowerCase().includes(lower) ||
            b.author.toLowerCase().includes(lower) ||
            b.category.toLowerCase().includes(lower),
        ),
      );
    } else {
      // ISBN mode: mock — just return a single dummy result keyed to the ISBN
      setResults([
        {
          id: `isbn-${trimmed}`,
          title: `Book for ISBN ${trimmed}`,
          author: "Unknown Author",
          date: "Oct 24",
          pageCount: 0,
          currentPage: 0,
          category: "Unknown",
          status: "Not Started",
          imageName: require("@/assets/images/DummyBookCover.png"),
        },
      ]);
    }

    setSearched(true);
  }

  function handleModeSwitch(next: SearchMode) {
    setMode(next);
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-pomegranate-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View className="gap-4 mb-2">
              {/* Header */}
              <View className="gap-1">
                <Text className="text-3xl font-bold text-pomegranate-950">
                  Add a Book
                </Text>
                <Text className="text-base font-medium text-pomegranate-950 opacity-80">
                  Search by title or scan an ISBN.
                </Text>
              </View>

              {/* Mode toggle */}
              <View className="flex-row bg-pomegranate-100 rounded-xl p-1 gap-1">
                {(["title", "isbn"] as SearchMode[]).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => handleModeSwitch(m)}
                    className={`flex-1 py-2 rounded-lg items-center ${
                      mode === m ? "bg-pomegranate-500" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        mode === m
                          ? "text-white"
                          : "text-pomegranate-950 opacity-60"
                      }`}
                    >
                      {m === "title" ? "Title / Author" : "ISBN Code"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Search bar */}
              <View className="flex-row gap-2 items-center">
                <TextInput
                  className="flex-1 bg-pomegranate-100 rounded-xl px-4 py-3 text-base text-pomegranate-950"
                  placeholder={
                    mode === "title"
                      ? "Search by title, author or category…"
                      : "Enter ISBN (e.g. 978-3-16-148410-0)"
                  }
                  placeholderTextColor="#9b7b7b"
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  keyboardType={
                    mode === "isbn" ? "numbers-and-punctuation" : "default"
                  }
                />
                <Pressable
                  onPress={handleSearch}
                  className="bg-pomegranate-500 rounded-xl px-4 py-3"
                >
                  <Text className="text-white font-semibold text-base">
                    Search
                  </Text>
                </Pressable>
              </View>

              {/* Result count */}
              {searched && (
                <Text className="text-sm font-medium text-pomegranate-950 opacity-60">
                  {results.length === 0
                    ? "No books found."
                    : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ResultBookCardView
              book={item}
              alreadyOnShelf={SHELF_IDS.has(item.id)}
              onAdd={() => {
                SHELF_IDS.add(item.id);
                console.log(`Added: ${item.title}`);
              }}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
