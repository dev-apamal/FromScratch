// components/ui/CartButton.tsx
import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { useCartStore } from "@/store/cartStore";

export default function CartButton() {
  const items = useCartStore((state) => state.items);

  // 🧠 Don't render anything if cart is empty —
  // no point showing a cart button with 0 items.
  if (items.length === 0) return null;

  return (
    <Pressable
      onPress={() => router.push("/cart")}
      className="flex-row items-center gap-2 px-4 py-3 rounded-full"
      style={{ backgroundColor: colors.primary }}
    >
      <MaterialIcons name="shopping-cart" size={20} color="white" />
      <Text className="text-white text-sm font-semibold">
        {items.length} {items.length === 1 ? "item" : "items"} in cart
      </Text>
      {/* 🧠 Total price shown inline so user always knows what they'll pay */}
      <Text className="text-white text-sm font-bold">
        · ₹{items.reduce((sum, i) => sum + i.price, 0).toLocaleString("en-IN")}
      </Text>
    </Pressable>
  );
}
