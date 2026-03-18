// import { Colors } from "@/constants/colors";
// import { NativeTabs } from "expo-router/unstable-native-tabs";
// import { DynamicColorIOS } from "react-native";

// export default function TabLayout() {
//   return (
//     <NativeTabs
//       //   labelStyle={{
//       //     // For the text color
//       //     color: DynamicColorIOS({
//       //       dark: Colors.pomegranate[950],
//       //       light: Colors.pomegranate[950],
//       //     }),
//       //   }}
//       // For the selected icon color
//       tintColor={DynamicColorIOS({
//         dark: Colors.pomegranate[500],
//         light: Colors.pomegranate[500],
//       })}
//     >
//       <NativeTabs.Trigger name="index">
//         <NativeTabs.Trigger.Label>Reading Now</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="finished">
//         <NativeTabs.Trigger.Icon sf="book.closed.fill" md="book" />
//         <NativeTabs.Trigger.Label>Finished</NativeTabs.Trigger.Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="add">
//         <NativeTabs.Trigger.Label>Add Books</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="book.badge.plus.fill" md="add" />
//       </NativeTabs.Trigger>
//       {/* <NativeTabs.Trigger name="search" role="search">
//         <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
//         <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
//       </NativeTabs.Trigger> */}
//       <NativeTabs.Trigger name="settings">
//         <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
//         <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }

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
