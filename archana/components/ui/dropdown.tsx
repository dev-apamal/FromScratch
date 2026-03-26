import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/colors";

type DropdownButtonProps = {
  location: string;
  address: string;
  onLocationPress?: () => void;
};

const DropdownButton = ({
  location,
  address,
  onLocationPress,
}: DropdownButtonProps) => {
  return (
    <Pressable
      onPress={onLocationPress}
      className="flex flex-col gap-1 items-start justify-start mb-6"
    >
      <View className="flex flex-row items-center gap-0.5 justify-center">
        <MaterialIcons
          name="location-pin"
          size={20}
          style={{ color: colors.textPrimary }}
        />
        <Text
          className="text-base font-medium"
          style={{ color: colors.textPrimary }}
        >
          {location}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={colors.textPrimary}
        />
      </View>
      <Text className="text-sm" style={{ color: colors.textSecondary }}>
        {address}
      </Text>
    </Pressable>
  );
};

export default DropdownButton;
