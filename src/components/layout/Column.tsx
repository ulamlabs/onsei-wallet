import { View, ViewProps } from "react-native";

export default function Column({ style, ...props }: ViewProps) {
  return <View {...props} style={[{ gap: 12 }, style]} />;
}
