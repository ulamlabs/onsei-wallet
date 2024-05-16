import { Colors, FontSizes } from "@/styles";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
  size?: keyof typeof FontSizes;
};

export default function Paragraph({ style, size = "sm", ...props }: Props) {
  return (
    <Text
      style={[{ color: Colors.text100, fontSize: FontSizes[size] }, style]}
      {...props}
    />
  );
}
