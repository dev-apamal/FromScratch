import { colors } from "@/constants/colors";
import { FlatList, Pressable, Text, View } from "react-native";
import TempleCard, { Temple } from "@/components/ui/templeCard";

const TEMPLES: Temple[] = [
  {
    id: "1",
    name: "Thirunnavaya Navamukunda",
    deity: "Lord Vishnu",
    category: "Hindu",
    location: "Thirunnavaya, Malappuram", // 👈 added
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
    location: "Kottakkal, Malappuram", // 👈 added
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
    location: "Tirur, Malappuram", // 👈 added
    distance: "7.8 km",
    rating: 4.6,
    openNow: true,
    timing: "5:00 AM – 7 PM",
  },
];

export default function TempleList() {
  return (
    <View className="flex-1 gap-4">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text
          className="text-base font-semibold"
          style={{ color: colors.textSecondary }}
        >
          Temples near you
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={TEMPLES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TempleCard temple={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => (
          <Text
            className="text-center text-base mt-8"
            style={{ color: colors.textSecondary }}
          >
            No temples found nearby.
          </Text>
        )}
      />
    </View>
  );
}
