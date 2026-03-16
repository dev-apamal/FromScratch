import { Colors } from "@/constants/colors";
import { View, Text } from "react-native";

type Props = {
  label: string;
  value: string;
  flex?: boolean;
  bgColor?: string;
};

export default function StatCard({ label, value, flex, bgColor }: Props) {
  return (
    <View
      className={`rounded-xl overflow-hidden ${flex ? "flex-1" : "w-full"}`}
      style={{
        backgroundColor: bgColor ?? Colors.pomegranate[100],
      }}
    >
      {/* Red top stripe */}
      <View style={{ height: 4, backgroundColor: Colors.pomegranate[500] }} />

      <View className="p-4 gap-2">
        {/* Label */}
        <Text className="text-xs uppercase text-pomegranate-950 opacity-80 tracking-widest">
          {label}
        </Text>
        {/* Value */}
        <Text className="text-xl font-medium text-pomegranate-950">
          {value}
        </Text>
      </View>
    </View>
  );
}
