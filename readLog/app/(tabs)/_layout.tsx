import { Colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.pomegranate[500],
        tabBarInactiveTintColor: Colors.pomegranate[300],
        tabBarStyle: {
          backgroundColor: Colors.pomegranate[50],
          borderTopColor: Colors.pomegranate[100],
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Reading Now",
          tabBarIcon: ({ color }) => (
            <SymbolView name="book.fill" type="monochrome" tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finished"
        options={{
          title: "Finished",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="book.closed.fill"
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add Books",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="book.badge.plus.fill"
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="gearshape.fill"
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
