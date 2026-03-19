// import { SymbolView } from "expo-symbols";
// import { useState } from "react";
// import { Pressable, ScrollView, Switch, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // ── Types ────────────────────────────────────────────────────────────────────
// type SettingsRowProps =
//   | {
//       symbolName: string;
//       label: string;
//       type: "link";
//       onPress: () => void;
//       showDivider?: boolean;
//     }
//   | {
//       symbolName: string;
//       label: string;
//       type: "toggle";
//       value: boolean;
//       onToggle: (v: boolean) => void;
//       showDivider?: boolean;
//     };

// const ICON_COLOR = "#3b0a0a";
// const ICON_SIZE = 20;

// // ── Row component ─────────────────────────────────────────────────────────────
// function SettingsRow(props: SettingsRowProps) {
//   const inner = (
//     <View className="flex-row items-center py-4 px-4 gap-3">
//       {/* SF Symbol icon */}
//       <View className="w-6 items-center justify-center">
//         <SymbolView
//           name={props.symbolName as any}
//           size={ICON_SIZE}
//           tintColor={ICON_COLOR}
//           type="monochrome"
//           style={{ width: ICON_SIZE, height: ICON_SIZE }}
//         />
//       </View>

//       {/* Label */}
//       <Text className="flex-1 text-base font-medium text-pomegranate-950">
//         {props.label}
//       </Text>

//       {/* Right control */}
//       {props.type === "toggle" && (
//         <Switch
//           value={props.value}
//           onValueChange={props.onToggle}
//           trackColor={{ false: "#d1d5db", true: "#e07070" }}
//           thumbColor="#ffffff"
//         />
//       )}
//     </View>
//   );

//   return (
//     <View>
//       {props.type === "link" ? (
//         <Pressable
//           onPress={props.onPress}
//           android_ripple={{ color: "#f5c0b0" }}
//           className="active:opacity-60"
//         >
//           {inner}
//         </Pressable>
//       ) : (
//         inner
//       )}

//       {/* Divider */}
//       {props.showDivider && <View className="h-px bg-pomegranate-200 mx-4" />}
//     </View>
//   );
// }

// // ── Main screen ───────────────────────────────────────────────────────────────
// export default function SettingsView() {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(false);

//   return (
//     <SafeAreaView className="flex-1 bg-pomegranate-50">
//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{ padding: 16, gap: 24 }}
//       >
//         {/* Title */}
//         <Text className="text-4xl font-bold text-pomegranate-950">
//           Settings
//         </Text>

//         {/* Settings card */}
//         <View className="bg-pomegranate-100 rounded-2xl overflow-hidden">
//           <SettingsRow
//             type="link"
//             symbolName="person.2.fill"
//             label="Refer a friend"
//             onPress={() => console.log("Refer a friend")}
//             showDivider
//           />
//           <SettingsRow
//             type="link"
//             symbolName="star.fill"
//             label="Rate App"
//             onPress={() => console.log("Rate App")}
//             showDivider
//           />
//           <SettingsRow
//             type="link"
//             symbolName="envelope.fill"
//             label="Contact Us"
//             onPress={() => console.log("Contact Us")}
//             showDivider
//           />
//           <SettingsRow
//             type="link"
//             symbolName="lifepreserver.fill"
//             label="Support"
//             onPress={() => console.log("Support")}
//             showDivider
//           />
//           {/* <SettingsRow
//             type="toggle"
//             symbolName="bell.fill"
//             label="Receive Notification"
//             value={notificationsEnabled}
//             onToggle={setNotificationsEnabled}
//             showDivider
//           /> */}
//           <SettingsRow
//             type="link"
//             symbolName="questionmark.circle.fill"
//             label="FAQ"
//             onPress={() => console.log("FAQ")}
//             showDivider
//           />
//           <SettingsRow
//             type="link"
//             symbolName="doc.text.fill"
//             label="Terms of Use"
//             onPress={() => console.log("Terms of Use")}
//             showDivider
//           />
//           <SettingsRow
//             type="link"
//             symbolName="lock.doc.fill"
//             label="Privacy Policy"
//             onPress={() => console.log("Privacy Policy")}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import ErrorBoundary from "@/components/errorBoundary";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SettingsRowProps =
  | {
      symbolName: string;
      label: string;
      type: "link";
      onPress: () => void;
      showDivider?: boolean;
    }
  | {
      symbolName: string;
      label: string;
      type: "toggle";
      value: boolean;
      onToggle: (v: boolean) => void;
      showDivider?: boolean;
    };

const ICON_COLOR = "#3b0a0a";
const ICON_SIZE = 20;

function SettingsRow(props: SettingsRowProps) {
  const inner = (
    <View className="flex-row items-center py-4 px-4 gap-3">
      <View className="w-6 items-center justify-center">
        <SymbolView
          name={props.symbolName as any}
          size={ICON_SIZE}
          tintColor={ICON_COLOR}
          type="monochrome"
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        />
      </View>
      <Text className="flex-1 text-base font-medium text-pomegranate-950">
        {props.label}
      </Text>
      {props.type === "toggle" && (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ false: "#d1d5db", true: "#e07070" }}
          thumbColor="#ffffff"
        />
      )}
    </View>
  );

  return (
    <View>
      {props.type === "link" ? (
        <Pressable
          onPress={props.onPress}
          android_ripple={{ color: "#f5c0b0" }}
          className="active:opacity-60"
        >
          {inner}
        </Pressable>
      ) : (
        inner
      )}
      {props.showDivider && <View className="h-px bg-pomegranate-200 mx-4" />}
    </View>
  );
}

function SettingsContent() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-pomegranate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 24 }}
      >
        <Text className="text-4xl font-bold text-pomegranate-950">
          Settings
        </Text>

        <View className="bg-pomegranate-100 rounded-2xl overflow-hidden">
          {/* <SettingsRow
            type="link"
            symbolName="person.2.fill"
            label="Refer a friend"
            onPress={() => console.log("Refer a friend")}
            showDivider
          />
          <SettingsRow
            type="link"
            symbolName="star.fill"
            label="Rate App"
            onPress={() => console.log("Rate App")}
            showDivider
          /> */}
          {/* <SettingsRow
            type="link"
            symbolName="envelope.fill"
            label="Contact Us"
            onPress={() => console.log("Contact Us")}
            showDivider
          /> */}
          <SettingsRow
            type="link"
            symbolName="lifepreserver.fill"
            label="Support"
            onPress={() =>
              Linking.openURL("mailto:support@theworkbench.studio")
            }
            showDivider
          />
          <SettingsRow
            type="link"
            symbolName="doc.text.fill"
            label="Terms and Conditions"
            onPress={() =>
              Linking.openURL(
                "https://theworkbench.studio/thereadingnook/terms-and-conditions",
              )
            }
            showDivider
          />
          <SettingsRow
            type="link"
            symbolName="lock.doc.fill"
            label="Privacy Policy"
            onPress={() =>
              Linking.openURL(
                "https://theworkbench.studio/thereadingnook/privacy-policy",
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SettingsView() {
  return (
    <ErrorBoundary>
      <SettingsContent />
    </ErrorBoundary>
  );
}
