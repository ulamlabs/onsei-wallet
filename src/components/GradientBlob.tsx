import { Dimensions, Image, ImageStyle, StyleProp } from "react-native";

const blob = require("../../assets/blob.png");

const { width, height } = Dimensions.get("window");

type Props = {
  style?: StyleProp<ImageStyle>;
  bottomAllign?: boolean;
};

export default function GradientBlob({ style, bottomAllign }: Props) {
  return (
    <Image
      style={[
        {
          position: "absolute",
          [bottomAllign ? "bottom" : "top"]: height / 12,
          [bottomAllign ? "right" : "left"]: width / 5,
          width: width,
          transform: [
            { translateX: -(width + 50) / 2 },
            { translateY: -(width + 50) / 2 },
            { scale: 1.5 },
          ],
        },
        style,
      ]}
      source={blob}
      resizeMode="contain"
    />
  );
}
