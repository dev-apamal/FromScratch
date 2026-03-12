import { BookItem } from "@/types/bookItem";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

type Props = {
  book: BookItem;
  isOpen: boolean;
  onReveal: () => void;
};

export default function FinishedBookCardView({
  book,
  isOpen,
  onReveal,
}: Props) {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }

  const handleReveal = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onReveal();
  };

  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4 overflow-hidden">
        {/* Top row: image + details */}
        <View className="flex-row gap-4 items-start">
          <Image
            source={book.imageName}
            className="w-36 h-36 rounded-lg"
            resizeMode="cover"
          />

          <View className="flex-1 gap-2">
            {/* Date + page count */}
            <View className="flex-row justify-between">
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.date}
              </Text>
              <Text className="text-xs text-pomegranate-950 opacity-60">
                {book.pageCount} Pages
              </Text>
            </View>

            {/* Title */}
            <Text
              className="text-xl font-bold text-pomegranate-950 leading-tight"
              numberOfLines={2}
            >
              {book.title}
            </Text>

            {/* Author / category / status */}
            <View className="gap-1">
              <Text className="text-sm text-pomegranate-950 opacity-80">
                by {book.author}
              </Text>
              <Text className="text-sm text-pomegranate-950 opacity-80">
                {book.category}
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm">📋</Text>
                <Text className="text-sm text-pomegranate-950 opacity-80">
                  {book.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Pressable
          onPress={handleReveal}
          className=" bg-white rounded-lg py-2 items-center"
        >
          {isOpen ? (
            <Text className="text-pomegranate-500 text-base">Close Stats</Text>
          ) : (
            <Text className="text-pomegranate-500 text-base">View Stats</Text>
          )}
        </Pressable>
        {isOpen ? (
          <View>
            <Text>Hello India</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
