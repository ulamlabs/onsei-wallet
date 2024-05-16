import { Colors, FontSizes } from "@/styles";
import { TextProps } from "react-native";
import Text from "./Text";

type Props = TextProps & {
  size?: keyof typeof FontSizes;
};

export default function Headline({ style, size = "xl", ...props }: Props) {
  return (
    <Text
      style={[
        {
          color: Colors.text,
          fontSize: FontSizes[size],
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
