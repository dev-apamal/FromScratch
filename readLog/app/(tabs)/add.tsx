import ResultBookCardView from "@/components/resultBookCardView";
import { useBookSearch, type SearchMode } from "@/hooks/useBookSearch";
import { useAddBook, useShelfIds } from "@/hooks/useShelf";
import { BookItem } from "@/types/bookItem";
import { OLSearchResult } from "@/types/olSearchResult";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function resultToBookItem(result: OLSearchResult): BookItem {
  return {
    id: result.olKey.replace("/works/", ""),
    olKey: result.olKey,
    title: result.title,
    author: result.author,
    pageCount: result.pageCount,
    currentPage: 0,
    category: result.category,
    status: "reading",
    coverUrl: result.coverUrl,
    isbn: result.isbn,
    addedAt: Date.now(),
    finishedAt: null,
  };
}

export default function AddBook() {
  const [mode, setMode] = useState<SearchMode>("title");
  const [inputValue, setInput] = useState("");
  const [searchQuery, setQuery] = useState("");

  const {
    data: results = [],
    isFetching,
    error,
    isSuccess,
  } = useBookSearch(searchQuery, mode);

  const { data: shelfIds = new Set<string>() } = useShelfIds();
  const { mutate: addBook } = useAddBook();

  function handleSearch() {
    const trimmed = inputValue.trim();
    if (trimmed.length < 2) return;
    setQuery(trimmed);
  }

  function handleModeSwitch(next: SearchMode) {
    setMode(next);
    setInput("");
    setQuery("");
  }

  const hasSearched = searchQuery.length >= 2;

  return (
    <SafeAreaView className="flex-1 bg-pomegranate-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={results}
          keyExtractor={(item) => item.olKey}
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
                      ? "Search by title or author…"
                      : "Enter ISBN (e.g. 9780385472579)"
                  }
                  placeholderTextColor="#9b7b7b"
                  value={inputValue}
                  onChangeText={setInput}
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

              {/* Status line */}
              {isFetching && (
                <View className="items-center py-2">
                  <ActivityIndicator color="#f45335" />
                </View>
              )}
              {!!error && !isFetching && (
                <Text className="text-sm text-red-500">
                  Could not reach Open Library. Check your connection and try
                  again.
                </Text>
              )}
              {isSuccess && !isFetching && hasSearched && (
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
              book={resultToBookItem(item)}
              alreadyOnShelf={shelfIds.has(item.olKey.replace("/works/", ""))}
              onAdd={() => addBook(resultToBookItem(item))}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
