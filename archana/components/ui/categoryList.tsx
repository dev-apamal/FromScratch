import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { colors } from "@/constants/colors";

const CATEGORIES = [
  {
    id: "1",
    label: "Ganapathi",
    source: require("../../assets/images/ganapathi_compressed.png"),
  },
  {
    id: "2",
    label: "Devi",
    source: require("../../assets/images/ganapathi_compressed.png"),
  },
  {
    id: "3",
    label: "Shiva",
    source: require("../../assets/images/ganapathi_compressed.png"),
  },
  {
    id: "4",
    label: "Ayyappa",
    source: require("../../assets/images/ganapathi_compressed.png"),
  },
  {
    id: "5",
    label: "Vishnu",
    source: require("../../assets/images/ganapathi_compressed.png"),
  },
  {
    id: "6",
    label: "Krishna",
    source: require("../../assets/images/ganapathi_compressed.png"),
  },
];

export default function CategoryList() {
  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text
          className="text-base font-semibold"
          style={{ color: colors.textSecondary }}
        >
          Find pooja by deity
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="py-4 gap-4"
      >
        {CATEGORIES.map((item) => {
          return (
            <Pressable
              key={item.id}
              onPress={() => console.log(item.id)}
              className="items-center gap-1.5 p-4 bg-gray-50 active:opacity-75"
            >
              <View className="w-20 h-20 rounded-full overflow-hidden  shadow-sm">
                <Image
                  className="w-full h-full"
                  source={item.source}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-sm font-medium">{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
