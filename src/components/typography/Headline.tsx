import { Colors, FontSizes, FontWeights } from "@/styles";
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
          fontFamily: FontWeights.bold,
          marginBottom: 8,
          textAlign: "center",
        },
        style,
      ]}
      {...props}
    />
  );
}
