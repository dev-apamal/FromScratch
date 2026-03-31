// app/search.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";
import TempleCard, { Temple } from "@/components/ui/templeCard";
import { useLocationStore } from "@/store/locationStore";

const ALL_TEMPLES: Temple[] = [
  {
    id: "1",
    name: "Thirunnavaya Navamukunda",
    deity: "Lord Vishnu",
    category: "Hindu",
    location: "Thirunnavaya, Malappuram",
    distance: "2.3 km",
    rating: 4.8,
    openNow: true,
    timing: "5:30 AM – 8 PM",
  },
  {
    id: "2",
    name: "Kottakkal Siva Temple",
    deity: "Lord Shiva",
    category: "Hindu",
    location: "Kottakkal, Malappuram",
    distance: "5.1 km",
    rating: 4.5,
    openNow: false,
    timing: "6:00 AM – 9 PM",
  },
  {
    id: "3",
    name: "Tirur Mundyamparambu Temple",
    deity: "Lord Murugan",
    category: "Hindu",
    location: "Tirur, Malappuram",
    distance: "7.8 km",
    rating: 4.6,
    openNow: true,
    timing: "5:00 AM – 7 PM",
  },
];

type SearchState = "idle" | "loading" | "results" | "empty";

export default function SearchScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<Temple[]>([]);
  // 🧠 Instead of multiple booleans (isLoading, hasResults etc.),
  // we use a single `searchState` string union type.
  // This is called a "state machine" pattern — only one state
  // can be active at a time, making the UI logic much cleaner.
  // Compare: isLoading=true + hasResults=false + isEmpty=false
  // vs just: searchState="loading" ← much easier to reason about.
  const [searchState, setSearchState] = useState<SearchState>("loading");

  const city = selectedLocation?.city ?? "Malappuram";

  // ─── Sync search header title as user types ───────────────────────────
  // 🧠 useNavigation() gives us access to the navigation object
  // so we can update the native header title dynamically as the
  // user types — feels very polished and native.
  useEffect(() => {
    navigation.setOptions({
      title: searchQuery.length > 0 ? `"${searchQuery}"` : "Search",
    });
  }, [searchQuery]);

  // ─── Focus input on mount ─────────────────────────────────────────────
  useEffect(() => {
    // 🧠 Small timeout needed because the screen animation is still
    // running when the component mounts. Focusing too early means
    // the keyboard fights with the transition animation.
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ─── Live search with debounce ────────────────────────────────────────
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchState("idle");
      setResults([]);
      return;
    }

    // Show loading IMMEDIATELY when user types —
    // this is the key change from before. User sees feedback instantly.
    setSearchState("loading");

    // Then debounce the actual API call by 400ms
    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();
      const filtered = ALL_TEMPLES.filter(
        (temple) =>
          temple.name.toLowerCase().includes(q) ||
          temple.deity.toLowerCase().includes(q) ||
          temple.category.toLowerCase().includes(q) ||
          temple.location.toLowerCase().includes(q),
      );

      // 🧠 Transition to either "results" or "empty" state —
      // never both at once. This is the state machine pattern paying off.
      setResults(filtered);
      setSearchState(filtered.length > 0 ? "results" : "empty");
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        {/* 🧠 The search input lives ON this page, not on the home screen.
            Once user lands here, they type directly here.
            We seed it with initialQuery (the first character they typed
            on the home screen) so typing feels continuous — no reset. */}
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

        {/* ── Location context ── */}
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

        {/* ── States ── */}

        {/* IDLE — nothing typed yet */}
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
              Try searching by deity, temple name{"\n"}or a nearby area
            </Text>
          </View>
        )}

        {/* LOADING — user is typing, debounce running */}
        {searchState === "loading" && (
          <View className="flex-1 items-center justify-center gap-4">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {/* 🧠 Showing the query in the loading text reassures the
                  user that the app is actively working on THEIR search —
                  not just spinning randomly. */}
              Searching for "{searchQuery}"...
            </Text>
          </View>
        )}

        {/* RESULTS — matches found */}
        {searchState === "results" && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TempleCard temple={item} />}
            contentContainerStyle={{ padding: 16, gap: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            // 🧠 Results count header — tells user how many matches
            // were found and where. Builds trust in the search.
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

        {/* EMPTY — searched but no matches */}
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
