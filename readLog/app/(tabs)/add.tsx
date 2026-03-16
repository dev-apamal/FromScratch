import ResultBookCardView from "@/components/resultBookCardView";
import ErrorBoundary from "@/components/errorBoundary";
import { useBookSearch, type SearchMode } from "@/hooks/useBookSearch";
import { useAddBook, useShelfIds } from "@/hooks/useShelf";
import { BookItem } from "@/types/bookItem";
import { OLSearchResult } from "@/types/olSearchResult";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import AnimatedListItem from "@/components/animatedListItem";

const DEBOUNCE_MS = 500;

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

function AddBookContent() {
  const [mode, setMode] = useState<SearchMode>("title");
  const [inputValue, setInput] = useState("");
  const [searchQuery, setQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: results = [],
    isFetching,
    error,
    isSuccess,
    refetch,
  } = useBookSearch(searchQuery, mode);

  const { data: shelfIds = new Set<string>() } = useShelfIds();
  const { mutate: addBook } = useAddBook();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setInput("");
        setQuery("");
        setIsDebouncing(false);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
      };
    }, []),
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const trimmed = inputValue.trim();

    if (trimmed.length < 2) {
      setIsDebouncing(false);
      setQuery("");
      return;
    }

    setIsDebouncing(true);

    debounceTimer.current = setTimeout(() => {
      setIsDebouncing(false);
      setQuery(trimmed);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue]);

  function handleModeSwitch(next: SearchMode) {
    setMode(next);
    setInput("");
    setQuery("");
    setIsDebouncing(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }

  function handleClear() {
    setInput("");
    setQuery("");
    setIsDebouncing(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }

  const hasSearched = searchQuery.length >= 2;
  const showSpinner = isDebouncing || isFetching;

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
              <View className="gap-1">
                <Text className="text-3xl font-bold text-pomegranate-950">
                  Add a Book
                </Text>
                <Text className="text-base font-medium text-pomegranate-950 opacity-80">
                  Search by title or scan an ISBN.
                </Text>
              </View>

              <View className="flex-row w-full bg-pomegranate-100 rounded-full p-1 gap-1">
                {(["title", "isbn"] as SearchMode[]).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => handleModeSwitch(m)}
                    className={`flex-1 py-2 rounded-full items-center ${
                      mode === m ? "bg-pomegranate-500" : ""
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
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

              <View className="flex-row w-full items-center justify-center bg-pomegranate-100 rounded-full px-4 py-3 gap-2">
                <TextInput
                  className="flex-1 text-base text-pomegranate-950"
                  multiline={true}
                  numberOfLines={1}
                  scrollEnabled={false}
                  placeholder={
                    mode === "title"
                      ? "Search by title or author…"
                      : "Enter ISBN (e.g. 9780385472579)"
                  }
                  placeholderTextColor="#9b7b7b"
                  value={inputValue}
                  onChangeText={setInput}
                  returnKeyType="search"
                  keyboardType={
                    mode === "isbn" ? "numbers-and-punctuation" : "default"
                  }
                />
                {inputValue.length > 0 && (
                  <Pressable
                    onPress={handleClear}
                    hitSlop={8}
                    className="w-6 h-6 rounded-full bg-pomegranate-300 items-center justify-center"
                  >
                    <Text className="text-pomegranate-950 text-xs font-bold leading-none">
                      ✕
                    </Text>
                  </Pressable>
                )}
              </View>

              {showSpinner && (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="#f45335" size="small" />
                  <Text className="text-sm text-pomegranate-950 opacity-50">
                    {isDebouncing
                      ? "Waiting for you to finish typing…"
                      : "Searching…"}
                  </Text>
                </View>
              )}

              {/* Error state with retry button */}
              {!!error && !showSpinner && (
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-sm text-red-500">
                    Could not reach Open Library. Check your connection.
                  </Text>
                  <Pressable
                    onPress={() => refetch()}
                    className="bg-pomegranate-100 rounded-full px-4 py-2"
                  >
                    <Text className="text-sm font-semibold text-pomegranate-700">
                      Retry
                    </Text>
                  </Pressable>
                </View>
              )}

              {isSuccess && !showSpinner && hasSearched && (
                <Text className="text-sm font-medium text-pomegranate-950 opacity-60">
                  {results.length === 0
                    ? "No books found."
                    : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
                </Text>
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <AnimatedListItem index={index}>
              <ResultBookCardView
                book={item}
                alreadyOnShelf={shelfIds.has(item.olKey.replace("/works/", ""))}
                onAdd={() => addBook(resultToBookItem(item))}
              />
            </AnimatedListItem>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function AddBook() {
  return (
    <ErrorBoundary>
      <AddBookContent />
    </ErrorBoundary>
  );
}
