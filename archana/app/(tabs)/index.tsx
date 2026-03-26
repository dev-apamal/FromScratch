import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import DropdownButton from "@/components/ui/dropdown";
import SearchInput from "@/components/ui/searchInput";
import { Image } from "expo-image";
import CategoryList from "@/components/ui/categoryList";
import TempleList from "@/components/ui/templeList";

export default function HomeScreen() {
  const [searchValue, setSearchValue] = useState("");

  function handleLocation() {
    // handle location logic
    // default location is must and nearby needs to be tapped in.
  }

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <SafeAreaView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <DropdownButton
          onLocationPress={handleLocation}
          location="Malappuram"
          address="23RP+4QG, NH 966, Up Hill, Malappuram" // Add limit here
        />
        <SearchInput value={searchValue} onChangeText={setSearchValue} />
        <CategoryList />
        <TempleList />
      </ScrollView>
    </SafeAreaView>
  );
}
