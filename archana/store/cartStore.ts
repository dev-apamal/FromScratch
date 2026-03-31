// store/cartStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DevoteeInfo = {
  name: string;
  gender: "Male" | "Female" | "Other";
  age: string;
  star: string;
};

// 🧠 CartItem now holds an ARRAY of devotees instead of a single one.
// This way one booking entry can cover a family — mother, father, child —
// all under the same pooja, same date/time, same temple.
export type CartItem = {
  cartItemId: string;
  templeId: string;
  templeName: string;
  poojaId: string;
  poojaName: string;
  price: number; // price per devotee
  date: string;
  time: string;
  devotees: DevoteeInfo[]; // ← array instead of single object
  note: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  hydrate: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: async (item) => {
    set((state) => {
      const updated = [...state.items, item];
      AsyncStorage.setItem("cartItems", JSON.stringify(updated));
      return { items: updated };
    });
  },

  removeItem: async (cartItemId) => {
    set((state) => {
      const updated = state.items.filter((i) => i.cartItemId !== cartItemId);
      AsyncStorage.setItem("cartItems", JSON.stringify(updated));
      return { items: updated };
    });
  },

  clearCart: async () => {
    await AsyncStorage.removeItem("cartItems");
    set({ items: [] });
  },

  hydrate: async () => {
    const raw = await AsyncStorage.getItem("cartItems");
    set({ items: raw ? JSON.parse(raw) : [] });
  },
}));
