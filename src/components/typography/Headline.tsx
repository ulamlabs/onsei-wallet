import { Colors } from "@/styles";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
  size?: "h1" | "h2" | "h3";
};

export default function Headline({ style, size = "h1", ...props }: Props) {
  const fontSize = () => {
    if (size === "h1") {
      return 26;
    }
    if (size === "h2") {
      return 20;
    }
    if (size === "h3") {
      return 16;
    }
  };
  return (
    <Text
      style={[
        {
          color: Colors.text,
          fontSize: fontSize(),
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
