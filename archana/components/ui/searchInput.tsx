// components/ui/searchInput.tsx
import React from "react";
import { View, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void; // ← add this
  autoFocus?: boolean; // ← and this (useful in search page)
};

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search temples near you",
  onSubmit,
  autoFocus = false,
}: SearchInputProps) {
  return (
    <View
      className="flex-row items-center bg-gray-50 border p-4 mb-6"
      style={{ borderColor: colors.border }}
    >
      <MaterialIcons name="search" size={20} color={colors.textSecondary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        className="flex-1 ml-2 text-base items-center justify-center leading-tight"
        style={{ color: colors.textPrimary }}
        maxLength={50}
        multiline={false}
        clearButtonMode="always"
        autoFocus={autoFocus}
        returnKeyType="search"
        // 🧠 returnKeyType="search" changes the keyboard's return key
        // label to "Search" — a small detail that makes the UX feel
        // intentional and native.
        onSubmitEditing={onSubmit}
        // 🧠 onSubmitEditing fires when user taps the "Search" key
        // on the keyboard. We pipe it to our optional onSubmit prop.
        // Since it's optional, everywhere else SearchInput is used
        // (like location.tsx) nothing changes — if onSubmit isn't
        // passed, tapping return just dismisses the keyboard as normal.
      />
    </View>
  );
}
