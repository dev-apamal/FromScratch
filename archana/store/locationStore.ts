// store/locationStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── 1. Types ────────────────────────────────────────────────────────────────
export type SavedAddress = {
  id: string;
  label: string; // e.g. "Home", "Work", or a search result name
  address: string; // full readable address string
  city: string; // e.g. "Malappuram"
  latitude: number;
  longitude: number;
};

type LocationStore = {
  selectedLocation: SavedAddress | null;
  savedAddresses: SavedAddress[];
  setSelectedLocation: (location: SavedAddress) => void;
  addSavedAddress: (address: SavedAddress) => void;
  removeSavedAddress: (id: string) => void;
  hydrate: () => Promise<void>; // loads saved data from storage on app start
};

// ─── 2. The Zustand Store ────────────────────────────────────────────────────
// Unlike MMKV, AsyncStorage is async — so we can't read it during store
// creation. Instead we expose a `hydrate()` function that we call once
// when the app starts, which loads the persisted data into the store.
export const useLocationStore = create<LocationStore>((set) => ({
  selectedLocation: null,
  savedAddresses: [],

  // When user picks a location — save to store + persist to device
  setSelectedLocation: async (location) => {
    await AsyncStorage.setItem("selectedLocation", JSON.stringify(location));
    set({ selectedLocation: location });
  },

  // When user saves an address for future use
  addSavedAddress: async (address) => {
    set((state) => {
      const updated = [...state.savedAddresses, address];
      AsyncStorage.setItem("savedAddresses", JSON.stringify(updated));
      return { savedAddresses: updated };
    });
  },

  // When user deletes a saved address
  removeSavedAddress: async (id) => {
    set((state) => {
      const updated = state.savedAddresses.filter((a) => a.id !== id);
      AsyncStorage.setItem("savedAddresses", JSON.stringify(updated));
      return { savedAddresses: updated };
    });
  },

  // Called once on app start — reads persisted data and loads into store
  // This is the key difference from MMKV — we need this extra step because
  // AsyncStorage is async and can't be read synchronously during store init
  hydrate: async () => {
    const [locationRaw, addressesRaw] = await Promise.all([
      AsyncStorage.getItem("selectedLocation"),
      AsyncStorage.getItem("savedAddresses"),
    ]);
    set({
      selectedLocation: locationRaw ? JSON.parse(locationRaw) : null,
      savedAddresses: addressesRaw ? JSON.parse(addressesRaw) : [],
    });
  },
}));
