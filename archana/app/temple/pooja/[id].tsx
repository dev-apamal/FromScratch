// app/temple/pooja/[id].tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";
import { useCartStore, DevoteeInfo } from "@/store/cartStore";

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Karthika",
  "Rohini",
  "Mrigashira",
  "Thiruvathira",
  "Punartham",
  "Pooyam",
  "Ayilyam",
  "Makam",
  "Pooram",
  "Uthram",
  "Atham",
  "Chithira",
  "Chothi",
  "Vishakham",
  "Anizham",
  "Thrikketta",
  "Moolam",
  "Pooradam",
  "Uthradam",
  "Thiruvonam",
  "Avittam",
  "Chathayam",
  "Pooruruttathi",
  "Uthrattathi",
  "Revathi",
];

const GENDERS = ["Male", "Female", "Other"] as const;

// 🧠 Factory function for a blank devotee — used when initializing
// and when user taps "Add Another Person". Keeps creation logic in one place.
const blankDevotee = (): DevoteeInfo => ({
  name: "",
  gender: "Male",
  age: "",
  star: "",
});

export default function PoojaBookingScreen() {
  const {
    id: poojaId,
    templeId,
    templeName,
    poojaName,
    price,
  } = useLocalSearchParams<{
    id: string;
    templeId: string;
    templeName: string;
    poojaName: string;
    price: string;
  }>();

  const addItem = useCartStore((state) => state.addItem);

  // ─── Devotees State ───────────────────────────────────────────────────────
  // 🧠 We start with one blank devotee. User can add more with the
  // "Add Another Person" button or remove extras with the × button.
  // We never allow removing the last devotee — minimum is always 1.
  const [devotees, setDevotees] = useState<DevoteeInfo[]>([blankDevotee()]);
  const [activeStarPicker, setActiveStarPicker] = useState<number | null>(null);

  // ─── Booking Details State ────────────────────────────────────────────────
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  // ─── Devotee Helpers ──────────────────────────────────────────────────────
  const updateDevotee = (
    index: number,
    field: keyof DevoteeInfo,
    value: string,
  ) => {
    setDevotees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear error for this field when user starts typing
    setErrors((e) => ({ ...e, [`${field}_${index}`]: "" }));
  };

  const addDevotee = () => setDevotees((prev) => [...prev, blankDevotee()]);

  const removeDevotee = (index: number) => {
    // 🧠 Never remove the last devotee — booking needs at least one person
    if (devotees.length === 1) return;
    setDevotees((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate each devotee
    devotees.forEach((d, i) => {
      if (!d.name.trim()) newErrors[`name_${i}`] = "Name is required";
      if (!d.age.trim()) newErrors[`age_${i}`] = "Age is required";
      else if (
        isNaN(Number(d.age)) ||
        Number(d.age) <= 0 ||
        Number(d.age) > 120
      )
        newErrors[`age_${i}`] = "Enter a valid age";
      if (!d.star) newErrors[`star_${i}`] = "Birth star is required";
    });

    // Validate booking details
    if (!date.trim()) {
      newErrors.date = "Date is required";
    } else {
      const parts = date.split("/");
      if (parts.length !== 3) {
        newErrors.date = "Use format DD/MM/YYYY";
      } else {
        const parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (isNaN(parsed.getTime())) newErrors.date = "Invalid date";
        else if (parsed < new Date())
          newErrors.date = "Date must be in the future";
      }
    }

    if (!time.trim()) {
      newErrors.time = "Time is required";
    } else {
      const parts = time.split(":");
      if (
        parts.length !== 2 ||
        isNaN(Number(parts[0])) ||
        isNaN(Number(parts[1])) ||
        Number(parts[0]) > 23 ||
        Number(parts[1]) > 59
      ) {
        newErrors.time = "Use format HH:MM (e.g. 06:30)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Add to Cart ──────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!validate()) return;
    setIsAdding(true);

    const parts = date.split("/");
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    // 🧠 Price is per devotee — total price scales with number of people.
    // This is shown clearly in the Add to Cart button so user knows.
    const totalPrice = Number(price) * devotees.length;

    await addItem({
      cartItemId: `${poojaId}-${Date.now()}`,
      templeId,
      templeName,
      poojaId,
      poojaName,
      price: totalPrice,
      date: isoDate,
      time,
      devotees,
      note,
    });

    setIsAdding(false);
    router.back();
  };

  // ─── Total price ──────────────────────────────────────────────────────────
  const totalPrice = Number(price) * devotees.length;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["left", "right"]}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Pooja Summary Card ── */}
          <View
            className="p-4 gap-1"
            style={{
              backgroundColor: "#FFF7ED",
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}
          >
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {templeName}
            </Text>
            <Text
              className="text-base font-semibold"
              style={{ color: colors.textPrimary }}
            >
              {poojaName}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              ₹{Number(price).toLocaleString("en-IN")} per devotee
            </Text>
          </View>

          {/* ── Devotee Cards ── */}
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Devotee Details
              </Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                {devotees.length} {devotees.length === 1 ? "person" : "people"}
              </Text>
            </View>

            {devotees.map((devotee, index) => (
              <DevoteeCard
                key={index}
                index={index}
                devotee={devotee}
                total={devotees.length}
                errors={errors}
                activeStarPicker={activeStarPicker}
                onStarPickerToggle={(i) =>
                  setActiveStarPicker(activeStarPicker === i ? null : i)
                }
                onChange={updateDevotee}
                onRemove={removeDevotee}
              />
            ))}

            {/* Add Another Person button */}
            <Pressable
              onPress={addDevotee}
              className="flex-row items-center justify-center gap-2 py-3 border border-dashed"
              style={{ borderColor: colors.primary }}
            >
              <MaterialIcons name="add" size={20} color={colors.primary} />
              <Text
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Add Another Person
              </Text>
            </Pressable>
          </View>

          {/* ── Booking Details ── */}
          <View className="gap-4">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Booking Details
            </Text>

            <FormField
              label="Date"
              error={errors.date}
              required
              hint="DD/MM/YYYY"
            >
              <TextInput
                value={date}
                onChangeText={(v) => {
                  setDate(v);
                  setErrors((e) => ({ ...e, date: "" }));
                }}
                placeholder="e.g. 14/04/2026"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={10}
                className="text-sm"
                style={{ color: colors.textPrimary }}
              />
            </FormField>

            <FormField
              label="Preferred Time"
              error={errors.time}
              required
              hint="HH:MM (24hr)"
            >
              <TextInput
                value={time}
                onChangeText={(v) => {
                  setTime(v);
                  setErrors((e) => ({ ...e, time: "" }));
                }}
                placeholder="e.g. 06:30"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={5}
                className="text-sm"
                style={{ color: colors.textPrimary }}
              />
            </FormField>

            <View className="gap-1.5">
              <Text
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Special Note{" "}
                <Text
                  className="text-xs font-normal"
                  style={{ color: colors.textSecondary }}
                >
                  (optional)
                </Text>
              </Text>
              <View
                className="border p-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: "#F9FAFB",
                }}
              >
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Any specific requests or gothra details..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={200}
                  className="text-sm"
                  style={{ color: colors.textPrimary, minHeight: 72 }}
                />
              </View>
              <Text
                className="text-xs text-right"
                style={{ color: colors.textSecondary }}
              >
                {note.length}/200
              </Text>
            </View>
          </View>

          {/* ── Add to Cart Button ── */}
          <Pressable
            onPress={handleAddToCart}
            disabled={isAdding}
            className="py-4 items-center"
            style={{
              backgroundColor: isAdding ? colors.border : colors.primary,
            }}
          >
            {isAdding ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="items-center gap-0.5">
                <Text className="text-white text-base font-semibold">
                  Add to Cart · ₹{totalPrice.toLocaleString("en-IN")}
                </Text>
                {devotees.length > 1 && (
                  // 🧠 Show price breakdown when multiple devotees —
                  // transparency builds trust in the booking flow.
                  <Text className="text-white text-xs opacity-80">
                    {devotees.length} people × ₹
                    {Number(price).toLocaleString("en-IN")}
                  </Text>
                )}
              </View>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ─── DevoteeCard ──────────────────────────────────────────────────────────────
// 🧠 Each devotee gets their own card with all fields.
// We extract this as a separate component to keep the main screen clean.
// When there are 3 devotees, we'd have 3 of these cards stacked.
function DevoteeCard({
  index,
  devotee,
  total,
  errors,
  activeStarPicker,
  onStarPickerToggle,
  onChange,
  onRemove,
}: {
  index: number;
  devotee: DevoteeInfo;
  total: number;
  errors: Record<string, string>;
  activeStarPicker: number | null;
  onStarPickerToggle: (index: number) => void;
  onChange: (index: number, field: keyof DevoteeInfo, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <View
      className="border p-4 gap-4"
      style={{ borderColor: colors.border, backgroundColor: "#FAFAFA" }}
    >
      {/* Card Header */}
      <View className="flex-row items-center justify-between">
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.textPrimary }}
        >
          Person {index + 1}
        </Text>
        {/* 🧠 Only show remove button when there's more than 1 devotee.
            You can't remove the last person — need at least one. */}
        {total > 1 && (
          <Pressable
            onPress={() => onRemove(index)}
            hitSlop={8}
            className="flex-row items-center gap-1"
          >
            <MaterialIcons name="close" size={16} color={colors.error} />
            <Text className="text-xs" style={{ color: colors.error }}>
              Remove
            </Text>
          </Pressable>
        )}
      </View>

      {/* Name */}
      <FormField label="Full Name" error={errors[`name_${index}`]} required>
        <TextInput
          value={devotee.name}
          onChangeText={(v) => onChange(index, "name", v)}
          placeholder="Enter full name"
          placeholderTextColor={colors.textSecondary}
          className="text-sm"
          style={{ color: colors.textPrimary }}
        />
      </FormField>

      {/* Gender */}
      <View className="gap-1.5">
        <Text
          className="text-sm font-medium"
          style={{ color: colors.textPrimary }}
        >
          Gender <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <View className="flex-row gap-2">
          {GENDERS.map((g) => (
            <Pressable
              key={g}
              onPress={() => onChange(index, "gender", g)}
              className="flex-1 py-2 items-center border"
              style={{
                borderColor:
                  devotee.gender === g ? colors.primary : colors.border,
                backgroundColor:
                  devotee.gender === g ? "#FFF7ED" : "transparent",
              }}
            >
              <Text
                className="text-xs font-medium"
                style={{
                  color:
                    devotee.gender === g
                      ? colors.primary
                      : colors.textSecondary,
                }}
              >
                {g}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Age */}
      <FormField label="Age" error={errors[`age_${index}`]} required>
        <TextInput
          value={devotee.age}
          onChangeText={(v) => onChange(index, "age", v)}
          placeholder="e.g. 35"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          maxLength={3}
          className="text-sm"
          style={{ color: colors.textPrimary }}
        />
      </FormField>

      {/* Birth Star */}
      <View className="gap-1.5">
        <Text
          className="text-sm font-medium"
          style={{ color: colors.textPrimary }}
        >
          Birth Star (Nakshatra) <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <Pressable
          onPress={() => onStarPickerToggle(index)}
          className="flex-row items-center justify-between border p-3"
          style={{
            borderColor: errors[`star_${index}`] ? colors.error : colors.border,
            backgroundColor: "#F9FAFB",
          }}
        >
          <Text
            className="text-sm"
            style={{
              color: devotee.star ? colors.textPrimary : colors.textSecondary,
            }}
          >
            {devotee.star || "Select birth star"}
          </Text>
          <MaterialIcons
            name={
              activeStarPicker === index
                ? "keyboard-arrow-up"
                : "keyboard-arrow-down"
            }
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>

        {activeStarPicker === index && (
          <View
            className="border"
            style={{ borderColor: colors.border, maxHeight: 180 }}
          >
            <ScrollView nestedScrollEnabled>
              {NAKSHATRAS.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => {
                    onChange(index, "star", n);
                    onStarPickerToggle(index);
                  }}
                  className="px-4 py-3 border-b"
                  style={{
                    borderColor: colors.border,
                    backgroundColor:
                      devotee.star === n ? "#FFF7ED" : "transparent",
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      color:
                        devotee.star === n
                          ? colors.primary
                          : colors.textPrimary,
                    }}
                  >
                    {n}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {errors[`star_${index}`] && (
          <Text className="text-xs" style={{ color: colors.error }}>
            {errors[`star_${index}`]}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
function FormField({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-between">
        <Text
          className="text-sm font-medium"
          style={{ color: colors.textPrimary }}
        >
          {label} {required && <Text style={{ color: colors.error }}>*</Text>}
        </Text>
        {hint && (
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {hint}
          </Text>
        )}
      </View>
      <View
        className="border p-3"
        style={{
          borderColor: error ? colors.error : colors.border,
          backgroundColor: "#F9FAFB",
        }}
      >
        {children}
      </View>
      {error && (
        <Text className="text-xs" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}
