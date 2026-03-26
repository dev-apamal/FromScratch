import { colors } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type Temple = {
  id: string;
  name: string;
  deity: string;
  category: string;
  location: string;
  distance: string;
  rating: number;
  openNow: boolean;
  timing: string;
  image?: string;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function TempleCard({ temple }: { temple: Temple }) {
  return (
    <Pressable
      className=" overflow-hidden border bg-gray-50"
      style={{ borderColor: colors.border }}
    >
      {/* ── Image ── */}
      <View className="h-40 relative">
        <Image
          style={StyleSheet.absoluteFill}
          source={temple.image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={400}
        />

        {/* Badges row */}
        <View className="absolute top-4 left-4 right-4 flex-row items-center justify-end">
          <View
            className="py-1 px-3 flex-row items-center gap-1"
            style={{ backgroundColor: colors.background }}
          >
            <MaterialIcons name="star" size={12} color={colors.primary} />
            <Text className="text-xs" style={{ color: colors.primary }}>
              {temple.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Body ── */}
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text
            className="text-lg font-semibold mb-1"
            style={{ color: colors.textPrimary }}
            numberOfLines={2}
          >
            {temple.name}
          </Text>
          <View className="ml-auto">
            <View
              className={`py-1 px-3 ${
                temple.openNow ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <Text
                className={`text-xs ${
                  temple.openNow ? "text-green-800" : "text-red-800"
                }`}
              >
                {temple.openNow ? "Open Now" : "Closed"}
              </Text>
            </View>
          </View>
        </View>
        <Text
          className="text-xs mb-1"
          style={{ color: colors.textSecondary }}
          numberOfLines={1}
        >
          Deity: {temple.deity}
          {"  ·  "}
          {temple.location}
        </Text>
        {/* Meta row */}
        <View className="flex-row items-center gap-4 mt-2">
          <View className="flex-row items-center gap-1 justify-center">
            <MaterialIcons
              name="location-pin"
              size={14}
              color={colors.textPrimary}
            />
            <Text className="text-sm" style={{ color: colors.textPrimary }}>
              {temple.distance}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <MaterialIcons
              name="access-time"
              size={14}
              color={colors.textPrimary}
            />
            <Text className="text-sm" style={{ color: colors.textPrimary }}>
              {temple.timing}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
