import React from "react";
import { View, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search temples near you",
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
        style={{
          color: colors.textPrimary,
        }}
        maxLength={50}
        multiline={false}
        clearButtonMode="always"
      />
    </View>
  );
}
