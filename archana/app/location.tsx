import React, { useCallback, useEffect, useState } from "react";
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { searchLocations, reverseGeocode } from "@/services/locationService";
import { useLocationStore, SavedAddress } from "@/store/locationStore";
import type { SearchResult } from "@/services/locationService";
import SearchInput from "@/components/ui/searchInput";

export default function LocationScreen() {
  const {
    savedAddresses,
    setSelectedLocation,
    addSavedAddress,
    removeSavedAddress,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const result = await reverseGeocode(
        location.coords.latitude,
        location.coords.longitude,
      );
      if (result) handleSelectLocation(result);
    } catch (error) {
      alert("Could not get your location. Please try again.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectLocation = (result: SearchResult | SavedAddress) => {
    const location: SavedAddress = {
      id: result.id,
      label: result.label,
      address: result.address,
      city: result.city,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    setSelectedLocation(location);
    router.back();
  };

  const handleSaveAddress = (result: SearchResult) => {
    addSavedAddress({
      id: result.id,
      label: result.label,
      address: result.address,
      city: result.city,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  };

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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Search Input ── */}
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for an area, street name..."
          />
          {/* ── Use Current Location ── */}
          <Pressable
            onPress={handleUseCurrentLocation}
            className="flex-row items-center gap-3 p-4 mb-6"
            style={{ backgroundColor: "#F0F9FF" }}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MaterialIcons
                name="my-location"
                size={20}
                color={colors.primary}
              />
            )}
            <View>
              <Text
                className="text-base font-medium"
                style={{ color: colors.primary }}
              >
                {isLocating ? "Detecting location..." : "Use current location"}
              </Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Uses your device GPS
              </Text>
            </View>
          </Pressable>

          {/* ── Search Loading ── */}
          {isSearching && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ marginVertical: 12 }}
            />
          )}

          {/* ── Search Results ── */}
          {searchResults.length > 0 && (
            <View className="mb-6">
              <Text
                className="text-sm font-medium mb-3"
                style={{ color: colors.textSecondary }}
              >
                SEARCH RESULTS
              </Text>
              {searchResults.map((result) => (
                <Pressable
                  key={result.id}
                  onPress={() => handleSelectLocation(result)}
                  className="flex-row items-center justify-between py-4 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color={colors.textSecondary}
                    />
                    <View className="flex-1">
                      <Text
                        className="text-sm font-medium"
                        style={{ color: colors.textPrimary }}
                        numberOfLines={1}
                      >
                        {result.label}
                      </Text>
                      <Text
                        className="text-xs mt-1"
                        style={{ color: colors.textSecondary }}
                        numberOfLines={2}
                      >
                        {result.address}
                      </Text>
                    </View>
                  </View>
                  {/* 🧠 Bookmark saves the address for future use
                      without selecting it — user may want to save
                      multiple addresses and pick later */}
                  <Pressable
                    onPress={() => handleSaveAddress(result)}
                    className="ml-3 p-2"
                    hitSlop={8}
                  >
                    <MaterialIcons
                      name="bookmark-border"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )}

          {/* ── Saved Addresses ── */}
          {savedAddresses.length > 0 && searchResults.length === 0 && (
            <View>
              <Text
                className="text-sm font-medium mb-3"
                style={{ color: colors.textSecondary }}
              >
                SAVED ADDRESSES
              </Text>
              {savedAddresses.map((addr) => (
                <Pressable
                  key={addr.id}
                  onPress={() => handleSelectLocation(addr)}
                  className="flex-row items-center justify-between py-4 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <MaterialIcons
                      name="bookmark"
                      size={20}
                      color={colors.primary}
                    />
                    <View className="flex-1">
                      <Text
                        className="text-sm font-medium"
                        style={{ color: colors.textPrimary }}
                        numberOfLines={1}
                      >
                        {addr.label}
                      </Text>
                      <Text
                        className="text-xs mt-1"
                        style={{ color: colors.textSecondary }}
                        numberOfLines={2}
                      >
                        {addr.address}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => removeSavedAddress(addr.id)}
                    className="ml-3 p-2"
                    hitSlop={8}
                  >
                    <MaterialIcons
                      name="close"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )}

          {/* ── Empty State ── */}
          {!isSearching &&
            searchResults.length === 0 &&
            savedAddresses.length === 0 &&
            searchQuery.length === 0 && (
              <View className="items-center mt-12">
                <MaterialIcons
                  name="location-searching"
                  size={48}
                  color={colors.border}
                />
                <Text
                  className="text-base mt-4 text-center"
                  style={{ color: colors.textSecondary }}
                >
                  Search for a city, area or street{"\n"}or use your current
                  location
                </Text>
              </View>
            )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
