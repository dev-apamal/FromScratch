// app/cart.tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { useCartStore, CartItem } from "@/store/cartStore";
import { supabase } from "@/services/supabase";

export default function CartScreen() {
  const { items, removeItem, clearCart } = useCartStore();
  const [isBooking, setIsBooking] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceBooking = async () => {
    if (items.length === 0) return;
    setIsBooking(true);

    try {
      // 🧠 For each cart item we create one booking row per devotee.
      // flatMap() is perfect here — it maps each item to an array of rows,
      // then flattens all arrays into a single array for batch insert.
      const bookings = items.flatMap((item) =>
        item.devotees.map((devotee) => ({
          temple_id: item.templeId,
          pooja_id: item.poojaId,
          user_name: devotee.name,
          user_phone: "0000000000",
          booking_date: `${item.date}T${item.time}:00+05:30`,
          status: "pending",
          amount: Number(item.price) / item.devotees.length,
          // 🧠 Amount per row = total / devotees so each booking row
          // reflects the per-person cost, not the total.
          notes: [
            `Gender: ${devotee.gender}`,
            `Age: ${devotee.age}`,
            `Star: ${devotee.star}`,
            item.note ? `Note: ${item.note}` : "",
          ]
            .filter(Boolean)
            .join(" | "),
        })),
      );

      const { error } = await supabase.from("bookings").insert(bookings);
      if (error) throw error;

      await clearCart();

      Alert.alert(
        "Booking Confirmed! 🙏",
        `Your bookings for ${bookings.length} devotee${bookings.length > 1 ? "s" : ""} have been placed successfully. The temple will confirm shortly.`,
        [
          {
            text: "View Bookings",
            onPress: () => {
              router.back();
              router.push("/(tabs)/bookings");
            },
          },
          {
            text: "Go Home",
            onPress: () => {
              router.back();
              router.push("/(tabs)");
            },
          },
        ],
      );
    } catch {
      Alert.alert("Booking Failed", "Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["top", "left", "right", "bottom"]}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <MaterialIcons name="shopping-cart" size={64} color={colors.border} />
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Your cart is empty
          </Text>
          <Text
            className="text-sm text-center"
            style={{ color: colors.textSecondary }}
          >
            Browse temples and add poojas{"\n"}to get started
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-6 py-3 mt-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">Browse Temples</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right", "bottom"]}
      // 🧠 All four edges now — top, left, right, bottom.
      // This is a full screen so we own the entire safe area.
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.cartItemId}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onRemove={() => removeItem(item.cartItemId)}
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="h-2" style={{ backgroundColor: "#F3F4F6" }} />
        )}
        contentContainerStyle={{ paddingBottom: 180 }}
        ListHeaderComponent={() => (
          <View
            className="px-4 py-3 border-b"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {items.length} pooja{items.length > 1 ? "s" : ""} ·{" "}
              {items.reduce((sum, i) => sum + i.devotees.length, 0)} devotees
              total
            </Text>
          </View>
        )}
      />

      {/* ── Checkout Footer ── */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 gap-3 border-t"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className="text-base font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Total Amount
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {items.reduce((sum, i) => sum + i.devotees.length, 0)} devotees
              across {items.length} pooja{items.length > 1 ? "s" : ""}
            </Text>
          </View>
          <Text className="text-xl font-bold" style={{ color: colors.primary }}>
            ₹{total.toLocaleString("en-IN")}
          </Text>
        </View>

        <Pressable
          onPress={handlePlaceBooking}
          disabled={isBooking}
          className="py-4 items-center"
          style={{
            backgroundColor: isBooking ? colors.border : colors.primary,
          }}
        >
          {isBooking ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Confirm Booking
            </Text>
          )}
        </Pressable>

        <Text
          className="text-xs text-center"
          style={{ color: colors.textSecondary }}
        >
          No payment required. Temple will confirm your booking.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── CartItemRow ──────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: () => void;
}) {
  return (
    <View className="p-4 gap-3">
      {/* Header */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-0.5">
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.textPrimary }}
          >
            {item.poojaName}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {item.templeName}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Text
            className="text-base font-bold"
            style={{ color: colors.primary }}
          >
            ₹{item.price.toLocaleString("en-IN")}
          </Text>
          <Pressable onPress={onRemove} hitSlop={8}>
            <MaterialIcons
              name="delete-outline"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* Booking date/time */}
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="event" size={13} color={colors.textSecondary} />
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          {new Date(`${item.date}T${item.time}`).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          at {item.time}
        </Text>
      </View>

      {/* Devotees */}
      <View className="gap-2">
        <Text
          className="text-xs font-medium"
          style={{ color: colors.textSecondary }}
        >
          {item.devotees.length}{" "}
          {item.devotees.length === 1 ? "Devotee" : "Devotees"}
        </Text>
        {item.devotees.map((d, i) => (
          <View
            key={i}
            className="flex-row items-center gap-3 p-3"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            {/* 🧠 Avatar initial — simple but makes each devotee visually distinct */}
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary + "20" }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: colors.primary }}
              >
                {d.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                {d.name}
              </Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                {d.gender} · {d.age} yrs · {d.star}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {item.note ? (
        <View className="flex-row items-start gap-2">
          <MaterialIcons name="note" size={13} color={colors.textSecondary} />
          <Text
            className="text-xs flex-1"
            style={{ color: colors.textSecondary }}
          >
            {item.note}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
