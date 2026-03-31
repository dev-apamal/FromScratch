// components/ui/templeList.tsx
import { colors } from "@/constants/colors";
import { FlatList, Text, View } from "react-native";
import TempleCard, { Temple } from "@/components/ui/templeCard";
import { SavedAddress } from "@/store/locationStore";

const TEMPLES: Temple[] = [
  {
    id: "1",
    name: "Thirunnavaya Navamukunda",
    deity: "Lord Vishnu",
    category: "Hindu",
    location: "Thirunnavaya, Malappuram",
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
    location: "Kottakkal, Malappuram",
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
    location: "Tirur, Malappuram",
    distance: "7.8 km",
    rating: 4.6,
    openNow: true,
    timing: "5:00 AM – 7 PM",
  },
];

type TempleListProps = {
  selectedLocation: SavedAddress | null;
};

export default function TempleList({ selectedLocation }: TempleListProps) {
  // 🧠 In a real app, you'd filter TEMPLES by distance from selectedLocation
  // using the Haversine formula (calculates distance between two lat/lng points).
  // For now we show all temples but update the header to reflect the city.
  // This is a great next step to implement once you have real temple data
  // with actual coordinates.
  const city = selectedLocation?.city ?? "Malappuram";

  return (
    <View className="flex-1 gap-4">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text
          className="text-base font-semibold"
          style={{ color: colors.textSecondary }}
        >
          Temples near {city}
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
            No temples found near {city}.
          </Text>
        )}
      />
    </View>
  );
}
