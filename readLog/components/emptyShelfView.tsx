import BookCardSkeleton from "@/components/bookCardSkeleton";
import { Text, View } from "react-native";

type Props = { title: string; subtitle: string };

export default function EmptyShelfView({ title, subtitle }: Props) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-pomegranate-950">{title}</Text>
        <Text className="text-base font-medium text-pomegranate-950 opacity-80">
          {subtitle}
        </Text>
      </View>
      {/* Ghost cards to hint at what will appear */}
      <View className="gap-2 opacity-40">
        <BookCardSkeleton />
        <BookCardSkeleton />
      </View>
    </View>
  );
}
