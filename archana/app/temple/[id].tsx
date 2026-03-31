// app/temple/[id].tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";
import { fetchTempleById, TempleDetail, Pooja } from "@/services/templeService";

export default function TempleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [temple, setTemple] = useState<TempleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTempleById(id);
      setTemple(data);
      // 🧠 Set native header title dynamically once data loads —
      // much better than showing "Temple Detail" as a placeholder.
      if (data) navigation.setOptions({ title: data.name });
      setIsLoading(false);
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!temple) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text style={{ color: colors.textSecondary }}>Temple not found.</Text>
      </View>
    );
  }

  const primaryImage = temple.temple_images?.find((img) => img.is_primary);
  const upcomingEvents = temple.events?.filter(
    (e) => new Date(e.event_date) >= new Date(),
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["left", "right"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Image ── */}
        <View className="w-full h-56 bg-gray-100">
          {primaryImage ? (
            <Image
              source={{ uri: primaryImage.url }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-5xl">🛕</Text>
            </View>
          )}
        </View>

        <View className="p-4 gap-6">
          {/* ── Header Info ── */}
          <View className="gap-2">
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {temple.name}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="star" size={16} color="#F59E0B" />
              <Text
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                {temple.rating.toFixed(1)}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                ({temple.review_count} reviews)
              </Text>
              <View
                className="px-2 py-0.5 rounded-full ml-2"
                style={{
                  backgroundColor: temple.is_open ? "#DCFCE7" : "#FEE2E2",
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: temple.is_open ? colors.success : colors.error,
                  }}
                >
                  {temple.is_open ? "Open Now" : "Closed"}
                </Text>
              </View>
            </View>

            {/* Address */}
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="location-on"
                size={16}
                color={colors.textSecondary}
              />
              <Text
                className="text-sm flex-1"
                style={{ color: colors.textSecondary }}
              >
                {temple.address}
              </Text>
            </View>

            {/* Timing */}
            {temple.open_time && temple.close_time && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {temple.open_time} – {temple.close_time}
                </Text>
              </View>
            )}

            {/* Phone */}
            {temple.phone && (
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => Linking.openURL(`tel:${temple.phone}`)}
                // 🧠 Linking.openURL with tel: opens the phone dialer
                // directly — one tap to call the temple.
              >
                <MaterialIcons name="phone" size={16} color={colors.primary} />
                <Text className="text-sm" style={{ color: colors.primary }}>
                  {temple.phone}
                </Text>
              </Pressable>
            )}
          </View>

          {/* ── Description ── */}
          {temple.description && (
            <View className="gap-2">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                About
              </Text>
              <Text
                className="text-sm leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                {temple.description}
              </Text>
            </View>
          )}

          {/* ── Poojas & Pricing ── */}
          {temple.poojas?.length > 0 && (
            <View className="gap-3">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Poojas & Pricing
              </Text>
              {temple.poojas.map((pooja) => (
                <PoojaRow key={pooja.id} pooja={pooja} />
              ))}
            </View>
          )}

          {/* ── Priests ── */}
          {temple.priests?.length > 0 && (
            <View className="gap-3">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Priests
              </Text>
              {temple.priests.map((priest) => (
                <View
                  key={priest.id}
                  className="flex-row items-center gap-3 p-3 bg-gray-50"
                >
                  <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                    <MaterialIcons
                      name="person"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-sm font-medium"
                      style={{ color: colors.textPrimary }}
                    >
                      {priest.name}
                    </Text>
                    {priest.specialization && (
                      <Text
                        className="text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        {priest.specialization}
                      </Text>
                    )}
                  </View>
                  {priest.phone && (
                    <Pressable
                      onPress={() => Linking.openURL(`tel:${priest.phone}`)}
                    >
                      <MaterialIcons
                        name="phone"
                        size={18}
                        color={colors.primary}
                      />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* ── Upcoming Events ── */}
          {upcomingEvents?.length > 0 && (
            <View className="gap-3">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Upcoming Events
              </Text>
              {upcomingEvents.map((event) => (
                <View
                  key={event.id}
                  className="p-3 border-l-4 bg-gray-50"
                  style={{ borderLeftColor: colors.primary }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {event.name}
                  </Text>
                  <Text
                    className="text-xs mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    {new Date(event.event_date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  {event.description && (
                    <Text
                      className="text-xs mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {event.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Pooja Row Component ──────────────────────────────────────────────────────
// 🧠 Small components like this are extracted to keep the main
// component readable. PoojaRow is only used here so it lives
// in the same file — no need to create a separate file for it.
function PoojaRow({ pooja }: { pooja: Pooja }) {
  return (
    <View
      className="flex-row items-center justify-between p-4 border"
      style={{ borderColor: colors.border }}
    >
      <View className="flex-1 gap-1">
        <Text
          className="text-sm font-medium"
          style={{ color: colors.textPrimary }}
        >
          {pooja.name}
        </Text>
        {pooja.description && (
          <Text
            className="text-xs"
            style={{ color: colors.textSecondary }}
            numberOfLines={2}
          >
            {pooja.description}
          </Text>
        )}
        {pooja.duration_minutes && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons
              name="schedule"
              size={11}
              color={colors.textSecondary}
            />
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {pooja.duration_minutes} mins
            </Text>
          </View>
        )}
      </View>

      <View className="items-end gap-2 ml-4">
        <Text className="text-base font-bold" style={{ color: colors.primary }}>
          ₹{pooja.price.toLocaleString("en-IN")}
        </Text>
        {!pooja.is_available && (
          <Text className="text-xs" style={{ color: colors.error }}>
            Unavailable
          </Text>
        )}
      </View>
    </View>
  );
}
