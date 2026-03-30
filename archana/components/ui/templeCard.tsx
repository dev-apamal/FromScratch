import { colors } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Pressable, Text, View, StyleSheet } from "react-native";

export type Temple = {
  id: string;
  name: string;
  deity: string;
  category: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount?: number;
  openNow: boolean;
  timing: string;
  image?: string;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <View className="flex-row items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const name =
          i < fullStars
            ? "star"
            : i === fullStars && hasHalf
              ? "star-half"
              : "star-outline";
        return <MaterialIcons key={i} name={name} size={12} color="#F59E0B" />;
      })}
    </View>
  );
};

export default function TempleCard({ temple }: { temple: Temple }) {
  return (
    <Pressable className="flex-row items-start gap-3 bg-gray-50 p-4">
      <View className="flex-1 gap-1">
        <Text
          className="text-base font-semibold leading-snug mb-1"
          style={{ color: colors.textPrimary }}
          numberOfLines={2}
        >
          {temple.name}
        </Text>

        <View className="flex-row items-center gap-1">
          <Text className="text-xs" style={{ color: colors.textPrimary }}>
            {temple.rating.toFixed(1)}
          </Text>
          <StarRating rating={temple.rating} />
          {temple.reviewCount && (
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              ({temple.reviewCount})
            </Text>
          )}
        </View>

        {/* Category · Location */}
        <Text
          className="text-xs leading-relaxed"
          style={{ color: colors.textSecondary }}
          numberOfLines={2}
        >
          {temple.category} · {temple.location}
        </Text>

        {/* Open/Closed · Timing */}
        <View className="flex-row items-center gap-1">
          <Text
            className="text-xs font-medium"
            style={{ color: temple.openNow ? "#16A34A" : "#DC2626" }}
          >
            {temple.openNow ? "Open" : "Closed"}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            · {temple.openNow ? "Closes" : "Opens"} {temple.timing}
          </Text>
        </View>

        {/* Distance */}
        <View className="flex-row items-center gap-1">
          <MaterialIcons
            name="near-me"
            size={11}
            color={colors.textSecondary}
          />
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {temple.distance}
          </Text>
        </View>
      </View>

      {/* ─── Right: Thumbnail ─── */}
      <View className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          style={StyleSheet.absoluteFill}
          source={temple.image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={400}
        />
      </View>
    </Pressable>
  );
}
