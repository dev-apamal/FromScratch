// components/ui/templeList.tsx
import { colors } from "@/constants/colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SavedAddress } from "@/store/locationStore";
import { fetchTemples, TempleListItem } from "@/services/templeService";
import TempleCard from "@/components/ui/templeCard";

type TempleListProps = {
  selectedLocation: SavedAddress | null;
};

export default function TempleList({ selectedLocation }: TempleListProps) {
  const [temples, setTemples] = useState<TempleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const city = selectedLocation?.city ?? "Malappuram";

  // 🧠 Re-fetches temples every time the user changes their city.
  // This is the core location → results connection:
  // user picks "Tirur" → city changes → effect runs → Supabase query
  // filters by "Tirur" → list updates automatically.
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchTemples(city);
      setTemples(data);
      setIsLoading(false);
    };
    load();
  }, [city]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          {temples.length} found
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={temples}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TempleCard temple={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">🛕</Text>
            <Text
              className="text-base font-medium"
              style={{ color: colors.textSecondary }}
            >
              No temples found near {city}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
