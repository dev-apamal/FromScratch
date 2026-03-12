import { View, Text } from "react-native";

type Props = {
  label: string;
  value: string;
  flex?: boolean;
};

export default function StatCard({ label, value, flex }: Props) {
  return (
    <View
      className={`bg-pomegranate-100 rounded-2xl p-4 gap-1 ${flex ? "flex-1" : "w-full"}`}
    >
      <Text className="text-sm text-pomegranate-950 opacity-60 leading-snug">
        {label}
      </Text>
      <Text className="text-2xl font-bold text-pomegranate-950">{value}</Text>
    </View>
  );
}
