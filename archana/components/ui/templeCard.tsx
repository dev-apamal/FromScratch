// components/ui/templeCard.tsx
import { colors } from "@/constants/colors";
import { TempleListItem } from "@/services/templeService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

export default function TempleCard({ temple }: { temple: TempleListItem }) {
  // 🧠 Get the primary image from the temple_images array.
  // find() returns the first item matching the condition, or undefined.
  // We fall back to the first image if none is marked as primary.
  const primaryImage =
    temple.temple_images?.find((img) => img.is_primary) ??
    temple.temple_images?.[0];

  // 🧠 Derive a human-readable timing string from open_time and close_time.
  // These come from Supabase as "05:30" and "20:00" — we join them with an em dash.
  const timing =
    temple.open_time && temple.close_time
      ? `${temple.open_time} – ${temple.close_time}`
      : null;

  return (
    <Pressable
      // 🧠 Navigate to the temple detail page passing the temple id.
      // Expo Router reads the [id] segment from the URL automatically.
      onPress={() => router.push(`./temple/${temple.id}`)}
      className="flex-row items-start gap-3 bg-gray-50 p-4"
    >
      {/* ─── Left: Info ─── */}
      <View className="flex-1 gap-1">
        <Text
          className="text-base font-semibold leading-snug mb-1"
          style={{ color: colors.textPrimary }}
          numberOfLines={2}
        >
          {temple.name}
        </Text>

        {/* Rating row */}
        <View className="flex-row items-center gap-1">
          <Text className="text-xs" style={{ color: colors.textPrimary }}>
            {temple.rating.toFixed(1)}
          </Text>
          <StarRating rating={temple.rating} />
          {temple.review_count > 0 && (
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              ({temple.review_count})
            </Text>
          )}
        </View>

        {/* Category · Address */}
        <Text
          className="text-xs leading-relaxed"
          style={{ color: colors.textSecondary }}
          numberOfLines={2}
        >
          {temple.category} · {temple.address}
        </Text>

        {/* Open/Closed · Timing */}
        <View className="flex-row items-center gap-1">
          <Text
            className="text-xs font-medium"
            style={{ color: temple.is_open ? "#16A34A" : "#DC2626" }}
          >
            {temple.is_open ? "Open" : "Closed"}
          </Text>
          {timing && (
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              · {temple.is_open ? "Closes" : "Opens"}{" "}
              {temple.is_open ? temple.close_time : temple.open_time}
            </Text>
          )}
        </View>

        {/* Deity */}
        <View className="flex-row items-center gap-1">
          <MaterialIcons
            name="temple-hindu"
            size={11}
            color={colors.textSecondary}
          />
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {temple.deity}
          </Text>
        </View>
      </View>

      {/* ─── Right: Thumbnail ─── */}
      <View className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          style={StyleSheet.absoluteFill}
          source={primaryImage ? { uri: primaryImage.url } : null}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={400}
        />
      </View>
    </Pressable>
  );
}
