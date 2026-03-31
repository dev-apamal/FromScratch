// app/search.tsx
import React, { useEffect, useRef, useState } from "react";
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
import { useLocalSearchParams, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";
import TempleCard from "@/components/ui/templeCard";
import { useLocationStore } from "@/store/locationStore";
import { searchTemples, TempleListItem } from "@/services/templeService";

type SearchState = "idle" | "loading" | "results" | "empty";

export default function SearchScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<TempleListItem[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("loading");

  const city = selectedLocation?.city ?? "Malappuram";

  // ─── Sync native header title as user types ───────────────────────────────
  useEffect(() => {
    navigation.setOptions({
      title: searchQuery.length > 0 ? `"${searchQuery}"` : "Search",
    });
  }, [searchQuery]);

  // ─── Focus input on mount ──────────────────────────────────────────────────
  useEffect(() => {
    // 🧠 Small delay so the keyboard doesn't fight the screen transition animation
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // ─── Live search with debounce ─────────────────────────────────────────────
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchState("idle");
      setResults([]);
      return;
    }

    // Show loading immediately — user sees feedback on every keystroke
    setSearchState("loading");

    // Debounce: wait 400ms after user stops typing before hitting the DB
    const timer = setTimeout(async () => {
      const data = await searchTemples(searchQuery, city);
      setResults(data);
      setSearchState(data.length > 0 ? "results" : "empty");
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, city]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["left", "right"]}
      >
        {/* ── Search Input ── */}
        <View
          className="flex-row items-center border-b px-4 py-3 gap-3"
          style={{ borderColor: colors.border, backgroundColor: "#F9FAFB" }}
        >
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search temples, deities..."
            placeholderTextColor={colors.textSecondary}
            className="flex-1 text-base"
            style={{ color: colors.textPrimary }}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="always"
          />
        </View>

        {/* ── Location context strip ── */}
        {searchQuery.length > 0 && (
          <View
            className="flex-row items-center gap-1 px-4 py-2 border-b"
            style={{ borderColor: colors.border }}
          >
            <MaterialIcons
              name="location-on"
              size={12}
              color={colors.textSecondary}
            />
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Searching near{" "}
              <Text
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {city}
              </Text>
            </Text>
          </View>
        )}

        {/* ── IDLE state ── */}
        {searchState === "idle" && (
          <View className="flex-1 items-center justify-center gap-3">
            <MaterialIcons name="search" size={52} color={colors.border} />
            <Text
              className="text-base font-medium"
              style={{ color: colors.textSecondary }}
            >
              Search for temples near you
            </Text>
            <Text
              className="text-sm text-center"
              style={{ color: colors.textSecondary }}
            >
              Try a deity name, temple name{"\n"}or a nearby area
            </Text>
          </View>
        )}

        {/* ── LOADING state ── */}
        {searchState === "loading" && (
          <View className="flex-1 items-center justify-center gap-4">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Searching for "{searchQuery}"...
            </Text>
          </View>
        )}

        {/* ── RESULTS state ── */}
        {searchState === "results" && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TempleCard temple={item} />}
            contentContainerStyle={{ padding: 16, gap: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={() => (
              <Text
                className="text-xs mb-2"
                style={{ color: colors.textSecondary }}
              >
                {results.length} temple{results.length !== 1 ? "s" : ""} found
                near {city}
              </Text>
            )}
          />
        )}

        {/* ── EMPTY state ── */}
        {searchState === "empty" && (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-4xl">🛕</Text>
            <Text
              className="text-base font-semibold"
              style={{ color: colors.textPrimary }}
            >
              No temples found
            </Text>
            <Text
              className="text-sm text-center"
              style={{ color: colors.textSecondary }}
            >
              No results for "{searchQuery}" near {city}.{"\n"}
              Try a different name or deity.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
