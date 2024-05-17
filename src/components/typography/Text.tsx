import { Colors, FontWeights } from "@/styles";
import ReactNative from "react-native";

export default function Text({ style, ...props }: ReactNative.TextProps) {
  return (
    <ReactNative.Text
      style={[{ color: Colors.text, fontFamily: FontWeights.regular }, style]}
      {...props}
    />
  );
}
