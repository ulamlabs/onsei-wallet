import { Colors } from "@/styles";
import { Text, TextProps } from "react-native";

export default function Paragraph({ style, ...props }: TextProps) {
  return (
    <Text
      style={[
        { color: Colors.text100, fontSize: 14, lineHeight: 24, flex: 1 },
        style,
      ]}
      {...props}
    />
  );
}
