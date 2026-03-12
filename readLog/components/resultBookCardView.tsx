import { BookItem } from "@/types/bookItem";
import { View, Text, Image, Pressable } from "react-native";

type Props = {
  book: BookItem;
};

export default function ResultBookCardView({ book }: Props) {
  return (
    <View className="w-full">
      <View className="bg-pomegranate-100 rounded-2xl p-4 w-full gap-4">
        {/* Top row: image + details */}
        <View className="flex-row gap-4 items-start">
          <Image
            source={book.imageName}
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />

          <View className="flex-1 gap-2">
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
              {/* Add Text Saying Already Exist in the Currently Reading List if not a button that says add book */}
            </View>
          </View>
        </View>
        {/* Buttons */}
      </View>
    </View>
  );
}
