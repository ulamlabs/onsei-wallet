import { View, ViewProps } from "react-native";

export default function Column({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[
        { flexDirection: "row", justifyContent: "space-between", gap: 12 },
        style,
      ]}
    />
  );
}
