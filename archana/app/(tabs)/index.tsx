// app/(tabs)/index.tsx
import { ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import DropdownButton from "@/components/ui/dropdown";
import SearchInput from "@/components/ui/searchInput";
import CategoryList from "@/components/ui/categoryList";
import TempleList from "@/components/ui/templeList";
import { useLocationStore } from "@/store/locationStore";
import { router } from "expo-router";

export default function HomeScreen() {
  const [searchValue, setSearchValue] = useState("");
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  const locationLabel = selectedLocation?.city ?? "Malappuram";
  const locationAddress =
    selectedLocation?.address ?? "23RP+4QG, NH 966, Up Hill, Malappuram";

  const handleSearchChange = (text: string) => {
    setSearchValue(text);

    if (text.trim().length === 1) {
      // 🧠 We navigate on the FIRST character typed — not on submit.
      // length === 1 means this is the exact moment the user starts typing.
      // We use router.push() with the query so the search page
      // gets the initial character immediately and shows a loading state.
      // From that point on, the search page owns the search state —
      // the user is typing directly into the search input on THAT page,
      // not this one. So we clear the home screen input after navigating.
      router.push({
        pathname: "/search",
        params: { query: text.trim() },
      });
      setSearchValue("");
      // 🧠 We reset searchValue to "" here so next time the user
      // comes back to home and taps search, it starts fresh.
    }
  };

  return (
    <SafeAreaView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <DropdownButton
          onLocationPress={() => router.push("/location")}
          location={locationLabel}
          address={locationAddress}
        />
        <SearchInput
          value={searchValue}
          onChangeText={handleSearchChange}
          // 🧠 No onSubmit needed anymore — navigation happens
          // on first keystroke via handleSearchChange above.
        />
        <CategoryList />
        <TempleList selectedLocation={selectedLocation} />
      </ScrollView>
    </SafeAreaView>
  );
}
