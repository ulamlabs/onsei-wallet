import { Colors } from "@/styles";
import { Text, TextProps } from "react-native";

export default function Headline({ style, ...props }: TextProps) {
  return (
    <Text
      style={[
        {
          color: Colors.text,
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 8,
          textAlign: "center",
        },
        style,
      ]}
      {...props}
    />
  );
}
