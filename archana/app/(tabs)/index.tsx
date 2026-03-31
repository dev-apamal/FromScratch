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

  return (
    <SafeAreaView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <DropdownButton
          // 🧠 router.push() navigates to the location page.
          // Since we set presentation: "modal" in _layout.tsx,
          // it slides up from the bottom — same feel as a sheet
          // but with a full page and proper keyboard support.
          onLocationPress={() => router.push("./location")}
          location={locationLabel}
          address={locationAddress}
        />
        <SearchInput value={searchValue} onChangeText={setSearchValue} />
        <CategoryList />
        <TempleList selectedLocation={selectedLocation} />
      </ScrollView>
    </SafeAreaView>
  );
}
