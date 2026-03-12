import { Colors } from "@/constants/colors";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // For the text color
        color: DynamicColorIOS({
          dark: Colors.pomegranate[950],
          light: Colors.pomegranate[950],
        }),
      }}
      // For the selected icon color
      tintColor={DynamicColorIOS({
        dark: Colors.pomegranate[500],
        light: Colors.pomegranate[500],
      })}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Reading Now</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="finished">
        <NativeTabs.Trigger.Icon sf="book.closed.fill" md="book" />
        <NativeTabs.Trigger.Label>Finished</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
